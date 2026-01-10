/**
 * WebSocket SDK 自定义代码生成器
 */
import {javascriptGenerator} from 'blockly/javascript';
import {Order} from 'blockly/javascript';

// 连接 WebSocket
javascriptGenerator.forBlock['ws_connect'] = function(block) {
  const url = block.getFieldValue('URL');
  const onConnectedCode = javascriptGenerator.statementToCode(block, 'ON_CONNECTED');
  
  if (onConnectedCode) {
    // 如果有回调代码，包装在回调函数中
    return `await wsSDK.connect('${url}', async () => {\n${onConnectedCode}});\n`;
  } else {
    return `await wsSDK.connect('${url}');\n`;
  }
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

// 发送消息并等待回复
javascriptGenerator.forBlock['ws_send_and_wait'] = function(block) {
  const message = javascriptGenerator.valueToCode(block, 'MESSAGE', Order.NONE) || "''";
  const timeout = javascriptGenerator.valueToCode(block, 'TIMEOUT', Order.NONE) || '5000';
  return [`await wsSDK.sendMessageAndWait(${message}, ${timeout})`, Order.FUNCTION_CALL];
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

// 睡眠
javascriptGenerator.forBlock['sleep'] = function(block) {
  const ms = block.getFieldValue('MS') || 1000;
  return `await wsSDK.sleep(${ms});\n`;
};

// 打印
javascriptGenerator.forBlock['print'] = function(block) {
  const value = javascriptGenerator.valueToCode(block, 'VALUE', Order.NONE) || "''";
  return `wsSDK.print(${value});\n`;
};
