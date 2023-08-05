---
title: 'LVGL 初探'
image: ''
alt: 'Az'
created: 2023-08-05
updated: 2023-08-05
summary: '使用 SquareLine Stdio 的 GUI 开发'
tags:
  - 'Iot'
---

## 环境需求

* ESP32-S3-LCD-EV-BOARD
* [SquareLine Stdio](https://squareline.io/) v1.3.1
* ESP-IDF v5.0.2

## 创建项目

1. 在 SquareLine Stdio 的欢迎菜单中选择 Example，选择任意一个示例项目，点击 creat，待相关文件加载完毕
2. 打开 flie 选项卡的 Project setting 修改 BOARD GROUP 为 Espressif，选择 开发板型号并保存
3. 在 Font Manager 选项卡的 CREATFONT 下进行 modify 以防报错
4. 在 Inspector 选项卡的 STYLE(MAIN) 下 确定项目的 Text Font，以便稍后修改
5. 在 Export 选项卡中导出项目，先 Creat Template project 然后再 Export UI Files

## 修改 Menuconfig

### 修改字体

在 ESP-IDF 中打开项目 使用 `idf.py menuconfig` 命令  
  搜索 `font 26` 选择 LV_FONTMONTSERRAT_26(=n) "Enable Montserrat 26" 启用后保存

### 设置 psram 为 120MHz

``` md
1. 搜索 psram
2. 选择 SPIRAM_MODE_OCT(=y) "Octal Mode PSRAM"
3. 进入 Octal Mode PSRAM
4. 进入 Set RAM clock speed
5. 选择 120MHz clock speed
```

### 设置 flash 为 120MHz

``` md
1. 搜索 flash
2. 选择 ESPTOOLPY_FLASHFREQ_120M(=n) "120MHz"
3. 选择 120MHz
```

### 设置 data cache line

``` md
1. 搜索 data cache line
2. 选择 ESP_32S3_DATA_CACHE_LINE_64B(=n) "64 Bytes"
3. 选择 64Bytes
```

### 开启防撕裂模式

``` md
1. 搜索 avoid tearing effect
2. 进入 BSP_DISPLAY_LVGL_AVOID_TEAR(=n) "Avoid tearing effect"
3. 选择 Avoid tearing effect (NEW),进入 LCD
4. 开启 Enable to use double frame buffers 以及 Enable to refresh LCD manually
5. 进入 Display， 开启 Avoid tearing effect
6. 进入 Select LVGL buffer mode，开启 Direct mode
```
