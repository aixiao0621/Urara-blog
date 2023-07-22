---
title: '通过 Homeassistant 控制继电器'
alt: 'Az'
created: 2023-01-13
updated: 2023-02-27
tags:
  - 'IoT'
---


## 环境安装

1. 使用[HassWP](https://github.com/AlexxIT/HassWP)作为 homeassistant 客户端。
2. 使用 ESPHome 作为连接 ESP8266 与 HA 的平台，由于 HassWP 并不是 HA 的完全体，所以这里需要安装完整的 ESPHome，这里选择将其部署在 Liunx 虚拟机上。
3. 在安装 ESPHome 前请确保 Liunx 的 python 处于较高版本，这里使用了 3.11.1 版本。
4. 使用 `pip3 install esphome` 命令安装 ESPHome;
  使用 `ln -s /home/coolcall/.local/bin/esphome /usr/local/bin/esphome` 创建~~软连接~~ ；
  使用 `sudo esphome dashboard config/` 运行。

## ESP8266 的接入 ESPHome

1. 在 ESPHome 的管理页面中（建议在 windows 系统下使用 Liunx IP 地址的 6052 端口号访问，虚拟机使用桥接模式），点击`NEW DEVICE` 添加新设备，输入`name` ，在选择`ESP8266` 并出现`Configuration created!`后，先选择`SKIP`，然后在页面右上角的`SECRETS`处配置网络并保存。
2. 完成后打开`EDIT`并进行`INSTALL`，选择第四个，这里我选择使用 ESP8266Flasher 刷写下载的`.bin`（需要安装 CH341 驱动），当然你也可以选择使用 ESPHome 提供的 web 页面进行刷写。这里需要下载编译链，请保持良好的网络环境并等待一段时间。
3. 刷写成功后，ESP8266 就可以连接到 ESPHome 了，页面将会显示固件上线，再次点击`EDIT`，在`captive_portal:`后添加以下代码：

```yaml
web_server:
  port: 80

switch:
  - platform: gpio
    pin: GPIO0
    name: "书房灯"
    id: relay2
    inverted: True
    
binary_sensor:
  - platform: gpio
    pin: GPIO2
    name: "press_switch_lib1"
    device_class: opening
    filters:
      - delayed_on_off: 100ms #消抖
    on_state:  #当这个二进制传感器状态改变的时候，触发 gpio0
      then:
        - switch.toggle: relay2
```

再次`INSTALL`时即可选择第一个选项刷写。

## 在 HA 中添加固件

1. 在 HA 的配置面板中选择设备与服务，在添加集成中搜索 ESPHome，主机地址需要填写上文中的`NAME`，在输入 key 后即可添加成功。（key 可以在刷写的`.yaml`文件中找到）

## 其他

WIFI 省电模式：

```yaml
wifi:
  # ...
power_save_mode: light
```
