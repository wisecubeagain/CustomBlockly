/**
 * WebSocket SDK 自定义代码生成器
 */
import {javascriptGenerator} from 'blockly/javascript';
import {Order} from 'blockly/javascript';

// 连接 WebSocket
javascriptGenerator.forBlock['ws_connect'] = function(block) {
  const url = block.getFieldValue('URL');
  return `await wsSDK.connect('${url}');\n`;
};

// 连接 SSE WebSocket
javascriptGenerator.forBlock['ws_connect_sse'] = function(block) {
  return `await wsSDK.connectSSE();\n`;
};

// 发送消息
javascriptGenerator.forBlock['ws_send'] = function(block) {
  const message = javascriptGenerator.valueToCode(block, 'MESSAGE', Order.NONE) || "''";
  return `wsSDK.sendMessage(${message});\n`;
};

// 测量延迟
javascriptGenerator.forBlock['ws_measure_latency'] = function(block) {
  return [`await wsSDK.measureLatency()`, Order.FUNCTION_CALL];
};

// 断开 Echo 连接
javascriptGenerator.forBlock['ws_disconnect'] = function(block) {
  return `wsSDK.disconnect();\n`;
};

// 断开 SSE 连接
javascriptGenerator.forBlock['ws_disconnect_sse'] = function(block) {
  return `wsSDK.disconnectSSE();\n`;
};

// 获取连接状态
javascriptGenerator.forBlock['ws_get_status'] = function(block) {
  return [`wsSDK.getStatus()`, Order.FUNCTION_CALL];
};
