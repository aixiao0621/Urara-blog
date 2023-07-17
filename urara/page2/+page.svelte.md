---
title: '使用 frida 对 APP 进行脱壳'
image: '/about/urara.webp'
alt: 'Az'
created: 2022-11-01
updated: 2023-12-12
tags:
  - 'frida'
---

## Android 端的准备  

1. 在 [frida](https://github.com/frida/frida) 仓库中下载`frida-server`文件，需要与手机架构和 PC 端 frida 版本相对应，解压后可以使用`adb push` 到手机，也可以使用 `MT文件管理器`，将其移动到 `/data/local/tmp` 目录内，赋予 `777` 权限
2. 将手机与电脑连接，使用 `adb devices` 查看连接的设备，确保 adb 正确连接

## PC 端的准备  

1. 使用 `pip install frida` 命令安装 [frida](https://github.com/frida/frida)  
2. 使用 `pip install frida-tools` 命令安装 frida-tools  
3. 使用`pip3 install frida-dexdump` 安装 [dexdump](https://github.com/hluwa/FRIDA-DEXDump)
4. 在 cmd 中执行以下命令  

```shell
adb shell  
cd /data/local/tmp/  
su  
./frida-server-android...  
```  

## 开始脱壳  

1. 打开新的 cmd 执行以下命令 `frida-dexdump -U -f com.app.pkgname` 即可开始脱壳  
2. 推荐加上 `-d` 即深度搜索，结果更加完整，注意 `-f` 后必须直接跟包名

## 修复和查看  

1. 生成的项目文件存放在`C:\\Windows\\System32`目录下  
2. 使用 MT 管理器进行 dex 修复  
3. 使用 jadx 查看修复后的 dex 文件  
