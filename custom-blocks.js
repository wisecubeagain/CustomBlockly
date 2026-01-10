/**
 * WebSocket SDK 自定义积木定义
 */
import * as Blockly from 'blockly';

// 连接 WebSocket（Echo 模式）
Blockly.Blocks['ws_connect'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('连接 WebSocket')
      .appendField('服务器地址')
      .appendField(new Blockly.FieldTextInput('wss://echo.websocket.org'), 'URL');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200); // 蓝色
    this.setTooltip('连接到 WebSocket Echo 服务器');
    this.setHelpUrl('https://echo.websocket.org');
  }
};

// 连接 SSE WebSocket
Blockly.Blocks['ws_connect_sse'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('连接 SSE WebSocket')
      .appendField('(服务器主动推送)');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('连接到 SSE 模式的 WebSocket，服务器会主动推送消息');
    this.setHelpUrl('https://echo.websocket.org/.sse');
  }
};

// 发送消息
Blockly.Blocks['ws_send'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('发送消息');
    this.appendValueInput('MESSAGE')
      .setCheck('String')
      .appendField('消息内容');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('发送消息到 Echo 服务器，服务器会回显相同消息');
    this.setHelpUrl('');
  }
};

// 测量延迟
Blockly.Blocks['ws_measure_latency'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('测量延迟');
    this.setOutput(true, 'Number');
    this.setColour(200);
    this.setTooltip('发送时间戳到服务器并计算往返延迟（毫秒）');
    this.setHelpUrl('');
  }
};

// 断开 Echo 连接
Blockly.Blocks['ws_disconnect'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('断开 WebSocket 连接');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('断开 Echo WebSocket 连接');
    this.setHelpUrl('');
  }
};

// 断开 SSE 连接
Blockly.Blocks['ws_disconnect_sse'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('断开 SSE WebSocket 连接');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200);
    this.setTooltip('断开 SSE WebSocket 连接');
    this.setHelpUrl('');
  }
};

// 获取连接状态
Blockly.Blocks['ws_get_status'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('获取连接状态');
    this.setOutput(true, 'Object');
    this.setColour(200);
    this.setTooltip('获取 WebSocket 连接状态信息');
    this.setHelpUrl('');
  }
};
