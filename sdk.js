/**
 * WebSocket SDK - 实现 WebSocket 消息收发和延迟测试
 */
class WebSocketSDK {
  constructor() {
    this.ws = null;
    this.wsSSE = null; // SSE 模式的 WebSocket 连接
    this.connected = false;
    this.sseConnected = false;
    this.messageHandlers = [];
    this.sseHandlers = [];
  }

  /**
   * 连接 WebSocket 服务器（Echo 模式）
   * @param {string} url - WebSocket 服务器地址，默认为 echo 服务器
   */
  connect(url = 'wss://echo.websocket.org') {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          console.warn('WebSocket 已经连接，先断开旧连接');
          this.disconnect();
        }

        this.ws = new WebSocket(url);
        
        this.ws.onopen = () => {
          this.connected = true;
          console.log('WebSocket 连接成功:', url);
          resolve({ success: true, message: '连接成功' });
        };

        this.ws.onmessage = (event) => {
          const message = event.data;
          console.log('收到 Echo 消息:', message);
          
          // 触发所有消息处理器
          this.messageHandlers.forEach(handler => {
            try {
              handler(message);
            } catch (error) {
              console.error('消息处理器错误:', error);
            }
          });
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket 错误:', error);
          reject({ success: false, error: '连接错误' });
        };

        this.ws.onclose = () => {
          this.connected = false;
          console.log('WebSocket 连接已关闭');
        };
      } catch (error) {
        console.error('创建 WebSocket 连接失败:', error);
        reject({ success: false, error: error.message });
      }
    });
  }

  /**
   * 连接 SSE 模式的 WebSocket（服务器主动推送消息）
   */
  connectSSE() {
    return new Promise((resolve, reject) => {
      try {
        if (this.wsSSE && this.wsSSE.readyState === WebSocket.OPEN) {
          console.warn('SSE WebSocket 已经连接，先断开旧连接');
          this.disconnectSSE();
        }

        this.wsSSE = new WebSocket('wss://echo.websocket.org/.sse');
        
        this.wsSSE.onopen = () => {
          this.sseConnected = true;
          console.log('SSE WebSocket 连接成功');
          resolve({ success: true, message: 'SSE 连接成功' });
        };

        this.wsSSE.onmessage = (event) => {
          const message = event.data;
          console.log('收到 SSE 消息:', message);
          
          // 触发所有 SSE 处理器
          this.sseHandlers.forEach(handler => {
            try {
              handler(message);
            } catch (error) {
              console.error('SSE 处理器错误:', error);
            }
          });
        };

        this.wsSSE.onerror = (error) => {
          console.error('SSE WebSocket 错误:', error);
          reject({ success: false, error: 'SSE 连接错误' });
        };

        this.wsSSE.onclose = () => {
          this.sseConnected = false;
          console.log('SSE WebSocket 连接已关闭');
        };
      } catch (error) {
        console.error('创建 SSE WebSocket 连接失败:', error);
        reject({ success: false, error: error.message });
      }
    });
  }

  /**
   * 发送消息到 Echo 服务器
   * @param {string} message - 要发送的消息
   */
  sendMessage(message) {
    if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接，请先调用 connect 方法');
    }
    
    this.ws.send(message);
    console.log('发送消息:', message);
    return { success: true, message: '消息已发送' };
  }

  /**
   * 发送时间戳并计算延迟
   * @returns {Promise<number>} 返回延迟时间（毫秒）
   */
  async measureLatency() {
    if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 未连接，请先调用 connect 方法');
    }

    return new Promise((resolve, reject) => {
      const timestamp = Date.now();
      const message = `timestamp:${timestamp}`;
      
      // 临时消息处理器，用于接收回显的时间戳
      const handler = (receivedMessage) => {
        try {
          if (receivedMessage.startsWith('timestamp:')) {
            const receivedTimestamp = parseInt(receivedMessage.split(':')[1]);
            const latency = Date.now() - receivedTimestamp;
            
            // 移除临时处理器
            const index = this.messageHandlers.indexOf(handler);
            if (index > -1) {
              this.messageHandlers.splice(index, 1);
            }
            
            resolve(latency);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 添加临时处理器
      this.messageHandlers.push(handler);
      
      // 发送时间戳
      this.ws.send(message);
      
      // 设置超时（5秒）
      setTimeout(() => {
        const index = this.messageHandlers.indexOf(handler);
        if (index > -1) {
          this.messageHandlers.splice(index, 1);
          reject(new Error('延迟测试超时'));
        }
      }, 5000);
    });
  }

  /**
   * 注册消息接收处理器
   * @param {Function} handler - 消息处理函数
   */
  onMessage(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
    }
  }

  /**
   * 注册 SSE 消息接收处理器
   * @param {Function} handler - SSE 消息处理函数
   */
  onSSEMessage(handler) {
    if (typeof handler === 'function') {
      this.sseHandlers.push(handler);
    }
  }

  /**
   * 断开 Echo WebSocket 连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
      this.messageHandlers = [];
      console.log('WebSocket 已断开');
    }
  }

  /**
   * 断开 SSE WebSocket 连接
   */
  disconnectSSE() {
    if (this.wsSSE) {
      this.wsSSE.close();
      this.wsSSE = null;
      this.sseConnected = false;
      this.sseHandlers = [];
      console.log('SSE WebSocket 已断开');
    }
  }

  /**
   * 断开所有连接
   */
  disconnectAll() {
    this.disconnect();
    this.disconnectSSE();
  }

  /**
   * 获取连接状态
   */
  getStatus() {
    return {
      echoConnected: this.connected,
      sseConnected: this.sseConnected,
      echoReadyState: this.ws ? this.ws.readyState : WebSocket.CLOSED,
      sseReadyState: this.wsSSE ? this.wsSSE.readyState : WebSocket.CLOSED
    };
  }
}

// 创建全局 SDK 实例
window.wsSDK = new WebSocketSDK();

// 导出供其他模块使用
export default window.wsSDK;
