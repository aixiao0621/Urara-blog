---
title: 'Frida 学习笔记'
alt: 'Az'
created: 2023-11-06
updated: 2023-11-06
tags:
  - 'frida'
---

## 环境搭建

* 安装 node 和 npm，git 拉取 frida-agent-example 仓库
* 下载版本对应的 frida、 frida-tools、 frida-server
* 在手机的 data/local/tmp 下运行 frida-server 

## Android 虚拟机搭建 

###  环境配置

* VMware 下的 Linux 虚拟机，有完整 frida 环境
* 使用 Genymotion 的 Android x86_64 虚拟机

### 网络配置

默认配置均为NAT ，需要全部更改为桥接:

* VMware 需要启用 复制物理地址

* 在 Genymotion 的设置中将网络状态改为桥接

* 在 VirtualBox 中将安卓虚拟机的网卡 2 改为桥接, 确认和 VMware 桥接至同一网卡，且将两个网卡的混杂模式改为全部允许

### 连接使用

* 在kali中使用 `adb connnect <安卓虚拟机IP>` 连接adb

* 使用 `adb push`将对应的 frida-server 文件推到 _/data/local/tmp_ 文件夹下并赋予权限，不知什么原因，这里的64位文件无法正常使用，但32位的没有问题
* 使用 `./frida-server-15.2.2-android-x86 -l 0.0.0.0:8888`启用网络模式连接
* 现在 `frida-ps -H 192.168.0.232:8888 -a`就可以正常使用了， 还可以用`objection -N -h 192.168.0.232 -p 8888 -g com.android.settings explore` 使用 objection (192.168.0.232 是 Android IP)

## Hook Demo

* 在 frida-agent-example 根目录下新建一个 hello.js 文件，代码如下：

```javascript
function hook() {
    // frida 的入口
    Java.perform(function () {
        // 以下为功能实现代码
        var settings = Java.use("com.android.settings.DisplaySettings");
        var getMetricsCategory_func = settings.getMetricsCategory;
        console.log("log:")
        getMetricsCategory_func.implementation = function () {
            var result = this.getMetricsCategory()
            console.log("log:", '===>', result)
            return result
        }
    })
}
hook();
// 或者: setTimeout(hook), 这里的setTimeout不是js标准库的setTimeout，作用和frida的javascript线程有关
```

* 在Android上启动 frida-server，添加 `-l 0.0.0.0:8888` 可以启用网络监听
* 使用 `frida -U -f com.android.settings -l hello.js` 运行 ，这时点击设置中的显示选项就会打印Hook值（console.log 打印的值）

> -U 为 通过 USB 连接 、-f 为使用 spawn 模式

## 常用插件

* `Objection`  ，使用pip安装，请注意安装顺序，先安装`frida`和`frida-tools`，再安装对应版本的`Objection`
* `WallBreaker` , 和`Objection`一样是用于快速定位类中包含的属性和函数(内存枚举）[教程](https://bbs.kanxue.com/thread-277929.htm)

``` bash
// Objection 常用命令如下：

// 注入
objection -g com.android.settings explore
// 通过 -c 可以读取文件中的多条命令执行
objection -g com.android.settings explore -c hook.txt

// 枚举内存中已加载的类
android hooking list classes  
// 在已加载的类中搜索包含关键字的类
android hooking search classes <pattern>
// 搜索包含关键字key的方法
android hooking search methods <key>
// 包含特定字符
android hooking list classes <pattern> 
// 获取指定类中的所有非构造函数的所有方法
android hooking list class_methods <class_name> 
// Hook类中的所有非构造函数的方法(顺序)
android hooking watch class <class_name> 
// Hook 指定函数方法(倒序)
android hooking watch class_method com.az.az.loading.setXXXX "xx(overload)" --dump-args --dump-return --dump-backtrace
// 主动调用,打印相关实例
android heap search instances <classname>
// 使用 hashcode 调用实例
android heap execute <hashcode> <methodname>

// 作业系统的使用
jobs list
jobs kill <Hook ID>

// 列出进程的所有activity
android hooking list activities

############# 分 界 线 ##############

// Wallbreaker 的安装和使用
mkdir -p ~/.objection/plugins/
git clone https://github.com/hluwa/Wallbreaker ~/.objection/plugins/Wallbreaker

// 加载插件
objection -g com.example.android explore  -P ~/.objection/plugins
// 内存搜索类、实例
plugin wallbreaker objectsearch LoginActivity
// 根据类名搜索内存中已经被创建的实例，列出 handle 和 toString() 的结果 --fullname 打印完整的包名
plugin wallbreaker classdump com.example.android.Activity.LoginActivity --fullname
// 查看对象的一些属性和方法
plugin wallbreaker objectdump 0x2222 --fullname
```

* `Zentrace` 需要先安装 `PyQt5` 和 `frida`，用于关键类定位（ Trace 枚举）
* `dexdump` 用于一代整体加固
* `frida_fart (FART)` 用于二代抽取加壳

## Native 层 Hook

```javascript
Java.perform(function () {  // 也可以不写（确保线程attach到安卓虚拟机上才执行）
    ...
    // Hook 模板
    Interceptor.attach(addr,{				// addr 是目标函数的地址
        onEnter(args) {
            /* do something with args */
        },
        onLeave(retval) {
            /* do something with retval */
        }
    });
    ...
}
```

* 目的是寻找 Java 层函数在 native 层中的对应**地址**
* 在 `Objection` 中执行 `memory list modules`查看你内存中的 `.so `文件，使用 `--json output.json` 来导出
* 执行`memory list exports XXX.so`  查看相应文件导出的所有符号，可以找到函数名对应的地址，但这里的绝对地址在每次加载时都不同，不变的是函数地址相对于基地址的偏移，通过偏移可以在静态分析时找到对应函数，使用 `--json output.json` 来导出(如果在Java层函数编写时未添加`extern C` 描述符，会因为 C++ 的 `name mangling` 导致编译完成的函数名发生一些变化，被破坏的函数名可以使用`C++filt`工具恢复)

### native层导数

使用Frida提供的 API 获得函数首地址：

```javascript
function hook_native() {
    var addr = Module.getExportByName("libnativetty.so", "Java_az_test_nativetty_MainActivity_stringFromJNI");		// 目标.so 和 函数名
    Interceptor.attach(addr, {
        onEnter: function (args) {
            console.log("jnienv => ", args[0])
            console.log("jobj pointer => ", args[1])

        },
        onLeave: function (retval) {
            console.log("retval => ", Java.vm.getEnv().getStringUtfChars(retval, null).readCString())
            console.log("——————————————————————————————")
        }

    })
}

setImmediate(hook_native)
```

### 非native层导出函数（使用动态注册的JNI函数）

通过获得模块地址相对于基地址的偏移来确定函数的绝对地址

* 项目 [frida_hook_libart]([lasting-yang/frida_hook_libart: Frida hook some jni functions (github.com)](https://github.com/lasting-yang/frida_hook_libart)) 包含JNI函数和 art 函数的Hook 脚本,使用其中的 `hook_RegisterNatives.js`,可以获得偏移
* 在获得偏移后使用frida提供的api `Module.findBaseAddress` 获得函数地址并进行Hook

### lib库的Hook

使用 `memory list exports XXX.so --json ./output.json` 导出模块中的导出函数

使用 frida-trace 可以快速trace函数 `frida-trace -UF -I libXXX.so`

使用 Frida 写文件

```javascript
function write(path, contents){
    var fopen_addr = Module.findExportByName("libc.so", "fopen");
    var fputs_addr = Module.findExportByName("libc.so", "fputs");
    var fclose_addr = Module.findExportByName("libc.so", "fclose");

    var fopen = new NativeFunction(fopen_addr, ["pointer", "pointer"])
    var puts = new NativeFunction(fputs_addr, "int", ["pointer", "pointer"])
    
    var fileName = Memory.allocUtf8String(path);
    var mode = Memory.allocUtf8String("a+");

    var fp = fopen(fileName, mode);
    var contentHello = Memory.allocUtf8String(contents);
    var ret = fputs(contentHello, fp);
    fclose(fp);
}
```

## 主动调用、RPC入门

RPC 指通过网络从远程计算机程序上请求服务, 需要将js脚本进行处理，使其被python程序调用，便于使用。例：

```python
# loader.py
import frida, time

device = frida.get_usb_device()
pid = device.spawn("com.symbolic.pitchlab") #目标包名

device.resume(pid)
time.sleep(1)
session = device.attach(pid)

with open("tty.js") as f:
    script = session.create_script(f.read())
    script.load()
    while(True):
        script.exports.output_func() #js导出函数调用
        time.sleep(0.5)
```

```javascript
// tty.js
function hook_native() {
    var result; 	// 需要放在 perform 外面
    Java.perform(function () {
        var addr = Module.getExportByName("libPitchLab.so", "Java_com_symbolic_pitchlab_PitchLabNative_processStreamedSamples"); 	//目标库文件和函数
        Interceptor.attach(addr, {
            onEnter: function (args) {
                for (let index = 0; index < 14; index++) {
                    const element = args[index];
                    console.log( element)
                }
            },
            onLeave: function (retval) {
                //do something
            }
        })
    })
    return result
}

rpc.exports = {
    output_func: hook_native
}
```

## adb 命令拾遗

```bash
netstat -alpe
lsof -p 8888 -l
adb shell dumpsys activity top
adb shell dumpsys package <package_name>
adb shell dumpsys dbinfo <package_name>
adb shell pm list packages
adb shell am start-activity -D -N com.example.az/.MainActivity
```
