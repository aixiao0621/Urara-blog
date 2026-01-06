---
title: 'static strace for LoongArch'
alt: 'Az'
image: ''
summary: ''
created: 2025-12-15
updated: 2024-12-31
tags:
  - 'IoT'
---

## 1. 背景与目标

针对某信创打印机固件进行漏洞挖掘前，在 qemu-system 中模拟运行主 ELF 文件失败，需要 strace 协助以获取更多信息，固件环境中的 rootfs 里不包含此工具，所以想要使用 Ubuntu22 x86_64 机器编译 LoongArch 上使用静态链接的 strace。

## 2. 环境说明

```plain
# 编译环境：
OS: Ubuntu 22.04 Arch: x86_64

# 交叉工具链 :
Toolchain: loongson-gnu-toolchain-8.3
Target: loongarch64-linux-gnu
Libc: glibc

# 目标 rootfs 运行环境，不是 musl
/usr/lib64/
├── ld.so.1
├── libc.so.*
├── libpthread.so.*
├── librt.so.*
├── libdl.so.*
```

## 3. 构建过程

### 3.1 尝试一：使用最新 strace（6.18）

最新版本，已合入 LoongArch 支持，理论上兼容新内核，配置命令如下：

```bash
./configure \
  --host=loongarch64-unknown-linux-gnu \
  CC=loongarch64-linux-gnu-gcc \
  CFLAGS="--sysroot=$SYSROOT -O2" \
  LDFLAGS="--sysroot=$SYSROOT -static" \
  --disable-mpers \
  --disable-stacktrace \
  --without-libunwind
```

结果编译错误

错误 1：KVM 枚举静态断言失败

```c
static_assert((KVM_EXIT_LOONGARCH_IOCSR) == (38),
              "KVM_EXIT_LOONGARCH_IOCSR != 38");
```

```plain
error: initialized field overwritten [-Werror=override-init]
```

尝试规避一下，增加参数：

```plain
--disable-mpers
--disable-stacktrace
--without-libunwind
```

`kvm.c` 仍参与编译，断言仍触发。失败。

---

### 3.2 尝试二：降级 strace 版本（6.9 / 6.2.9）

尝试避开最新 LoongArch KVM 改动，最小化 ABI 不兼容性：

结果 configure 阶段直接失败

```plain
checking for library containing timer_create... no
configure: error: failed to find timer_create
```

即使显式指定 librt

```bash
LDFLAGS="-static -lrt"
```

结果仍然是：

```plain
checking for library containing timer_create... no
```

最后使用 cache 变量强行欺骗

```bash
ac_cv_func_timer_create=yes
ac_cv_lib_rt_timer_create=yes
```

结果失败，glibc 静态链接场景下，`librt.a` 中并不存在可用实现，无法保证 POSIX timer 在静态链接可用

## 巧合解决

再确认下目标 rootfs 的架构信息：

```bash
# 检查动态链接器
$ file usr/lib/ld.so.1
usr/lib/ld.so.1: ELF 64-bit LSB shared object, LoongArch, version 1 (GNU/Linux)
```

尝试直接从官方仓库获取预编译包，选择 Loongnix 官方仓库：

```bash
# 探索 Loongnix 仓库
$ curl -sL http://pkg.loongnix.cn/loongnix/pool/main/s/strace/ \
  | grep -oE 'href="[^"]+\.deb"' \
  | sed 's/href="//;s/"//' \
  | grep loongarch64

strace-dbgsym_5.14-1.lnd.2_loongarch64.deb
strace-dbgsym_5.14-1.lnd.3_loongarch64.deb
strace_5.14-1.lnd.2_loongarch64.deb
strace_5.14-1.lnd.3_loongarch64.deb
```

下载最新版本的 strace 包：

```bash
# 下载 deb 包
$ wget http://pkg.loongnix.cn/loongnix/pool/main/s/strace/strace_5.14-1.lnd.3_loongarch64.deb

# 解压 deb 包（deb 包本质是 ar 归档）
$ ar x strace_5.14-1.lnd.3_loongarch64.deb

# 提取数据部分
$ tar -xf data.tar.xz

# 定位二进制文件
$ find . -name strace -type f
./usr/bin/strace
```

验证二进制兼容性

```bash
# 检查架构
$ file ./usr/bin/strace
./usr/bin/strace: ELF 64-bit LSB pie executable, LoongArch, 
version 1 (SYSV), dynamically linked, interpreter /lib64/ld.so.1, 
for GNU/Linux 4.15.0, BuildID[sha1]=1040e139522cf7f65c0da4a6b57cfe106c5267c0, stripped

# 检查文件大小
$ ls -lh ./usr/bin/strace
-rwxr-xr-x  1 user  staff   1.3M Jan  3 05:22 ./usr/bin/strace
```

由于这是动态链接版本，需要确保目标 rootfs 中有对应的库：

```bash
# 检查目标环境的动态链接器
$ ls -la usr/lib/ld.so*
-rw-r--r--@ 1 user  staff  153120 Dec 31 15:18 usr/lib/ld.so.1

# 检查库路径符号链接结构
$ cat lib64
lib

$ cat lib
usr/lib
```

动态链接的 ELF 可执行文件包含解释器（dynamic linker）路径：

```plain
interpreter /lib64/ld.so.1
```

- 实际文件位置 : `usr/lib/ld.so.1`
- 符号链接链 : `/lib64` → `lib` → `usr/lib`

因此 `/lib64/ld.so.1` 最终会正确解析到 `usr/lib/ld.so.1`，该 strace 在目标 rootfs 可以正常运行。
