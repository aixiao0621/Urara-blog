---
title: ' 为 J1900 小主机刷写 openWRT'
alt: 'Az'
created: 2023-03-05
updated: 2023-03-18
tags:
  - 'IoT'
---

## 刷写

1. 准备 PE 盘：复制准备好的 openwrt 镜像 (x86-64)，（为了方便这里选择了整合包）和刷写工具 [physdiskwrite](https://m0n0.ch/wall/physdiskwrite.php) 到 PE 盘  
2. 刷写镜像：在 bios 修改启动项，进入 PE，将原磁盘格式化为一个分区，使用 `physdiskwrite` 命令刷写，在 cmd 中输入命令 `.\physdiskwriter.exe -u <镜像路径>` 进行刷写
3. 启动：修改回原来的启动项再启动，就可以进入 `openWRT`  

## 其他

* 整合包中自带了 `openclash` ，导入配置即可使用，如果安装 `docker`，则需要使用 `TUN模式`
* 在 BIOS 中设置通电自启是必要的  
* 在使用工具刷写时，需要选择要刷写的盘，请确定`0`和`1`中哪个才是硬盘，确定不了就多试几次吧 (悲)  
* 下载下来的镜像可能需要多次解压，需要的是分为`0.img ...`的上一级  
* 进入 PE 的方法请自行百度，台式机大多为开机时按 ESC 在 `BIOS` 中的 `BOOT` 选项中更改启动项，将 PE 盘放在第一位，保存并重启  
* openWRT 初次启动后请设置账户密码  
* 服务长时间不重新启动可能会造成网速过慢
