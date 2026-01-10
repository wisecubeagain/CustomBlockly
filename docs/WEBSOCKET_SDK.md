# WebSocket SDK 使用指南

这个项目实现了基于 WebSocket 的 SDK，支持消息收发、延迟测试和服务器推送（SSE）功能。

## 功能特性

### 1. Echo WebSocket 连接
- **服务器**: `wss://echo.websocket.org`
- **功能**: 发送消息后，服务器会回显相同的消息
- **用途**: 测试消息收发、延迟测量

### 2. SSE WebSocket 连接
- **服务器**: `wss://echo.websocket.org/.sse`
- **功能**: 服务器主动推送消息
- **用途**: 接收服务器推送的实时数据

### 3. 延迟测试
- 发送时间戳到服务器
- 服务器返回相同时间戳
- 计算往返延迟（RTT）

## Blockly 积木说明

### 连接类积木

#### 连接 WebSocket
- **积木类型**: `ws_connect`
- **功能**: 连接到 Echo WebSocket 服务器
- **参数**: 服务器地址（默认：`wss://echo.websocket.org`）
- **生成代码**: `await wsSDK.connect('wss://echo.websocket.org');`

#### 连接 SSE WebSocket
- **积木类型**: `ws_connect_sse`
- **功能**: 连接到 SSE 模式的 WebSocket（服务器主动推送）
- **参数**: 无（固定连接到 `wss://echo.websocket.org/.sse`）
- **生成代码**: `await wsSDK.connectSSE();`

### 消息类积木

#### 发送消息
- **积木类型**: `ws_send`
- **功能**: 发送消息到 Echo 服务器
- **参数**: 消息内容（字符串）
- **生成代码**: `wsSDK.sendMessage('Hello');`
- **说明**: 服务器会回显相同的消息

#### 测量延迟
- **积木类型**: `ws_measure_latency`
- **功能**: 测量与服务器的往返延迟
- **返回值**: 延迟时间（毫秒，Number 类型）
- **生成代码**: `await wsSDK.measureLatency()`
- **说明**: 发送时间戳，计算往返时间

### 状态类积木

#### 获取连接状态
- **积木类型**: `ws_get_status`
- **功能**: 获取当前连接状态
- **返回值**: 状态对象（包含 echoConnected、sseConnected 等）
- **生成代码**: `wsSDK.getStatus()`

### 断开类积木

#### 断开 WebSocket 连接
- **积木类型**: `ws_disconnect`
- **功能**: 断开 Echo WebSocket 连接
- **生成代码**: `wsSDK.disconnect();`

#### 断开 SSE WebSocket 连接
- **积木类型**: `ws_disconnect_sse`
- **功能**: 断开 SSE WebSocket 连接
- **生成代码**: `wsSDK.disconnectSSE();`

## 使用示例

### 示例 1: 基本消息收发

```
1. 连接 WebSocket
2. 发送消息 "Hello World"
3. 断开连接
```

生成的代码：
```javascript
await wsSDK.connect('wss://echo.websocket.org');
wsSDK.sendMessage('Hello World');
wsSDK.disconnect();
```

### 示例 2: 测量延迟

```
1. 连接 WebSocket
2. 测量延迟（将结果保存到变量）
3. 打印延迟值
```

生成的代码：
```javascript
await wsSDK.connect('wss://echo.websocket.org');
var latency = await wsSDK.measureLatency();
console.log('延迟:', latency, 'ms');
```

### 示例 3: 接收 SSE 消息

```
1. 连接 SSE WebSocket
2. 等待接收消息（消息会自动显示在右侧面板）
```

生成的代码：
```javascript
await wsSDK.connectSSE();
// 消息会自动通过 onSSEMessage 处理器显示
```

## SDK API 参考

### WebSocketSDK 类

#### 方法

##### `connect(url)`
连接 Echo WebSocket 服务器
- **参数**: `url` (string) - WebSocket 服务器地址
- **返回**: `Promise<{success: boolean, message: string}>`

##### `connectSSE()`
连接 SSE WebSocket 服务器
- **返回**: `Promise<{success: boolean, message: string}>`

##### `sendMessage(message)`
发送消息到 Echo 服务器
- **参数**: `message` (string) - 要发送的消息
- **返回**: `{success: boolean, message: string}`
- **抛出**: 如果未连接则抛出错误

##### `measureLatency()`
测量往返延迟
- **返回**: `Promise<number>` - 延迟时间（毫秒）
- **抛出**: 如果未连接或超时则抛出错误

##### `onMessage(handler)`
注册 Echo 消息接收处理器
- **参数**: `handler` (Function) - 消息处理函数
- **说明**: 当收到 Echo 消息时调用

##### `onSSEMessage(handler)`
注册 SSE 消息接收处理器
- **参数**: `handler` (Function) - SSE 消息处理函数
- **说明**: 当收到 SSE 消息时调用

##### `disconnect()`
断开 Echo WebSocket 连接

##### `disconnectSSE()`
断开 SSE WebSocket 连接

##### `disconnectAll()`
断开所有连接

##### `getStatus()`
获取连接状态
- **返回**: `{echoConnected: boolean, sseConnected: boolean, ...}`

## 消息显示

在界面右侧的"WebSocket 消息"面板中，会实时显示：
- **Echo 消息**: 蓝色边框，显示从 Echo 服务器收到的回显消息
- **SSE 消息**: 橙色边框，显示从 SSE 服务器推送的消息

每条消息都包含时间戳，方便追踪消息接收时间。

## 调试技巧

1. **打开浏览器控制台**: 查看详细的连接日志和错误信息
2. **检查连接状态**: 使用"获取连接状态"积木查看当前连接状态
3. **测试延迟**: 使用"测量延迟"积木测试网络延迟
4. **查看消息**: 右侧面板实时显示所有接收到的消息

## 常见问题

### Q: 连接失败怎么办？
A: 
- 检查网络连接
- 确认服务器地址正确（`wss://echo.websocket.org`）
- 查看浏览器控制台的错误信息

### Q: 为什么收不到消息？
A: 
- 确保已成功连接（使用"获取连接状态"积木检查）
- 检查消息处理器是否已注册
- 查看浏览器控制台是否有错误

### Q: 延迟测试超时？
A: 
- 检查网络连接是否稳定
- 延迟测试默认超时时间为 5 秒
- 如果网络较慢，可能需要更长时间

### Q: 如何自定义服务器地址？
A: 
- 在"连接 WebSocket"积木中修改服务器地址字段
- 确保使用 `wss://` 协议（安全 WebSocket）

## 技术实现

- **WebSocket API**: 使用浏览器原生 WebSocket API
- **Promise**: 异步操作使用 Promise 处理
- **事件处理**: 使用消息处理器模式处理接收到的消息
- **延迟计算**: 通过时间戳差值计算往返延迟

## 扩展开发

如果需要添加新的 WebSocket 功能：

1. 在 `sdk.js` 中添加新方法
2. 在 `custom-blocks.js` 中定义新积木
3. 在 `custom-generators.js` 中添加代码生成逻辑
4. 在 `main.js` 的工具箱中添加新积木

参考现有代码的实现方式即可。
