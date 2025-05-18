---
title: 'Mirai 编译踩坑'
alt: 'Az'
image: ''
summary: ''
created: 2025-05-02
updated: 2024-05-15
tags:
  - 'IoT'
---

## 编译环境
Kali Rolling (2025.1a) x64  
go version 1.10  
gcc  14.2.0  

参考：  
https://www.cnblogs.com/lee-qi/p/11430166.html  
https://kamisec.github.io/2020/02/Mirai%E5%B9%B3%E5%8F%B0%E7%9A%84%E5%AD%A6%E4%B9%A0-%E6%90%AD%E5%BB%BA%E7%AF%87/

## 问题 1：go 版本问题，使用 1.10 拉取仍然报错：

`go get  github.com/go-sql-driver/mysql`

```bash
package slices: unrecognized import path "slices" (import path does not begin with hostname)
```

- 删除现有 MySQL 驱动程序：
`rm -rf $GOPATH/src/github.com/go-sql-driver/mysql`
- 克隆仓库并切换到兼容版本（如 v1.5.0）：

```bash
git clone https://github.com/go-sql-driver/mysql.git $GOPATH/src/github.com/go-sql-driver/mysql 
cd $GOPATH/src/github.com/go-sql-driver/mysql 
git checkout v1.5.0
```

## 问题 2：gcc 版本过高，某些特性不支持：
在 mirai 下 build.sh debug telnet 时：

```bash
/usr/bin/ld: /tmp/ccYv6tLe.o:/home/kali/Mirai-Source-Code/mirai/bot/includes.h:31: multiple definition of `LOCAL_ADDR'; /tmp/ccsVmAAb.o:/home/kali/Mirai-Source-Code/mirai/bot/includes.h:31: first defined here
/usr/bin/ld: /tmp/cciIC3rk.o:/home/kali/Mirai-Source-Code/mirai/bot/includes.h:31: multiple definition of `LOCAL_ADDR'; /tmp/ccsVmAAb.o:/home/kali/Mirai-Source-Code/mirai/bot/includes.h:31: first defined here
```

修改 build 脚本，将所有调用 gcc 的命令都添加-fcommon 编译标志，例如：

```sh
gcc -std=c99 -fcommon tools/enc.c -g -o debug/enc
```

## 问题 3：交叉编译库下载失败：

文章中的：

```bash
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/scripts# cd ..
root@ubuntu:/home/test/Desktop/Mirai-Source-Code# mkdir cross-compmile-bin
root@ubuntu:/home/test/Desktop/Mirai-Source-Code# cd cross-compile-bin/

wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-armv4l.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-armv5l.tar.bz2 
wget http://distro.ibiblio.org/slitaz/sources/packages/c/cross-compiler-armv6l.tar.bz2
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-i586.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-i686.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-m68k.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-mips.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-mipsel.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-powerpc.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-sh4.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-sparc.tar.bz2 
wget https://www.uclibc.org/downloads/binaries/0.9.30.1/cross-compiler-x86_64.tar.bz2
```

只有 armv6l 下载成功，将其余的链接全部换为以`http://distro.ibiblio.org/slitaz/sources/packages/c/`起始即可，除了这三个都可以下载：

```bash
--2025-04-30 04:39:47--  http://distro.ibiblio.org/slitaz/sources/packages/c/cross-compiler-i586.tar.bz2
Resolving distro.ibiblio.org (distro.ibiblio.org)... 198.18.0.124
Connecting to distro.ibiblio.org (distro.ibiblio.org)|198.18.0.124|:80... connected.
HTTP request sent, awaiting response... 404 Not Found
2025-04-30 04:39:47 ERROR 404: Not Found.

--2025-04-30 04:39:47--  http://distro.ibiblio.org/slitaz/sources/packages/c/cross-compiler-i686.tar.bz2
Resolving distro.ibiblio.org (distro.ibiblio.org)... 198.18.0.124
Connecting to distro.ibiblio.org (distro.ibiblio.org)|198.18.0.124|:80... connected.
HTTP request sent, awaiting response... 404 Not Found
2025-04-30 04:39:48 ERROR 404: Not Found.

--2025-04-30 04:39:48--  http://distro.ibiblio.org/slitaz/sources/packages/c/cross-compiler-m68k.tar.bz2
Resolving distro.ibiblio.org (distro.ibiblio.org)... 198.18.0.124
Connecting to distro.ibiblio.org (distro.ibiblio.org)|198.18.0.124|:80... connected.
HTTP request sent, awaiting response... 404 Not Found
2025-04-30 04:39:48 ERROR 404: Not Found.
```

## 问题 4：使用 cross-compile.sh 交叉编译器安装后仍然找不到 gcc:

```bash
┌──(root㉿kali)-[/home/kali/Mirai-Source-Code/scripts]
└─# ./cross-compile.sh 
Install mysql-server and mysql-client (y/n)? Installing mysql...
Reading package lists... Done
Building dependency tree... 50%
Building dependency tree... Done
Reading state information... Done
......
move cross-compiler-mips to mips ...
move cross-compiler-mipsel to mipsel ...
move cross-compiler-powerpc to powerpc ...
move cross-compiler-sh4 to sh4 ...
move cross-compiler-sparc to sparc ...
export PATH ...

┌──(root㉿kali)-[/home/kali/Mirai-Source-Code/scripts]
└─# mips-gcc
mips-gcc: command not found
```

将 PATH 写到 .bashrc 中：

```bash
export PATH=$PATH:/etc/xcompile/mips/bin:/etc/xcompile/mipsel/bin:/etc/xcompile/armv4l/bin:/etc/xcompile/armv5l/bin:/etc/xcompile/armv6l/bin:/etc/xcompile/powerpc/bin:/etc/xcompile/sh4/bin:/etc/xcompile/sparc/bin
```

kali 的默认 shell 为 zsh，所以先进 bash，然后再运行 gcc 就 ok 了，为了方便将 go1.10 也加到这里：
`export PATH="/usr/local/go/bin:$PATH"` 然后`source ~/.bashrc`就可以看到 go version 为 1.10，便于编译 mirai 本体

## 问题 5：编译 loader 时报错：

```bash
┌──(root㉿kali)-[/home/kali/Mirai-Source-Code/loader]
└─# ./build.debug.sh

src/binary.c: In function ‘binary_init’:
src/binary.c:19:9: error: ‘return’ with no value, in function returning non-void [-Wreturn-mismatch]
   19 |         return;
      |         ^~~~~~
src/binary.c:11:6: note: declared here
   11 | BOOL binary_init(void)
      |      ^~~~~~~~~~~
src/connection.c: In function ‘connection_close’:
src/connection.c:62:17: error: implicit declaration of function ‘ntohs’ [-Wimplicit-function-declaration]
   62 |                 ntohs(conn->info.port),
      |                 ^~~~~
src/connection.c:79:9: error: implicit declaration of function ‘close’; did you mean ‘pclose’? [-Wimplicit-function-declaration]
   79 |         close(conn->fd);
      |         ^~~~~
      |         pclose
src/connection.c: In function ‘connection_consume_arch’:
src/connection.c:485:35: error: implicit declaration of function ‘htons’ [-Wimplicit-function-declaration]
  485 |                 ehdr->e_machine = htons(ehdr->e_machine);
      |                                   ^~~~~
src/main.c: In function ‘main’:
src/main.c:32:16: error: implicit declaration of function ‘inet_addr’ [-Wimplicit-function-declaration]
   32 |     addrs[0] = inet_addr("0.0.0.0");
      |                ^~~~~~~~~
src/server.c: In function ‘server_queue_telnet’:
src/server.c:93:9: error: implicit declaration of function ‘sleep’ [-Wimplicit-function-declaration]
   93 |         sleep(1);
      |         ^~~~~
src/telnet_info.c: In function ‘telnet_info_parse’:
src/telnet_info.c:59:12: error: implicit declaration of function ‘inet_addr’ [-Wimplicit-function-declaration]
   59 |     addr = inet_addr(addr_str);
      |            ^~~~~~~~~
src/telnet_info.c:60:12: error: implicit declaration of function ‘htons’ [-Wimplicit-function-declaration]
   60 |     port = htons(atoi(port_str));
      |            ^~~~~
src/util.c: In function ‘util_socket_and_bind’:
src/util.c:77:18: error: implicit declaration of function ‘rand’ [-Wimplicit-function-declaration]
   77 |     start_addr = rand() % srv->bind_addrs_len;
      |                  ^~~~
src/util.c:94:9: error: implicit declaration of function ‘close’; did you mean ‘pclose’? [-Wimplicit-function-declaration]
   94 |         close(fd);
      |         ^~~~~
      |         pclose
src/util.c: In function ‘util_trim’:
src/util.c:161:11: error: implicit declaration of function ‘isspace’ [-Wimplicit-function-declaration]
  161 |     while(isspace(*str))
      |           ^~~~~~~
src/util.c:10:1: note: include ‘<ctype.h>’ or provide a declaration of ‘isspace’
    9 | #include "headers/util.h"
  +++ |+#include <ctype.h>
   10 | #include "headers/server.h"
```

直接修复代码：
 Fixed binary_init() return value in src/binary.c
 - Added a proper `return FALSE` statement in the error path
 - Changed the `load()` function to return `TRUE` on success
