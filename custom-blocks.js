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
    this.appendStatementInput('ON_CONNECTED')
      .appendField('连接成功后执行');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(200); // 蓝色
    this.setTooltip('连接到 WebSocket Echo 服务器，连接成功后执行回调代码');
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

// 发送消息并等待回复
Blockly.Blocks['ws_send_and_wait'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('发送消息并等待回复');
    this.appendValueInput('MESSAGE')
      .setCheck('String')
      .appendField('消息内容');
    this.appendValueInput('TIMEOUT')
      .setCheck('Number')
      .appendField('超时时间(毫秒)');
    this.setInputsInline(true);
    this.setOutput(true, 'String');
    this.setColour(200);
    this.setTooltip('发送消息到服务器，等待并返回收到的回复消息');
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

// 睡眠（延迟）
Blockly.Blocks['sleep'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('睡眠')
      .appendField(new Blockly.FieldNumber(1000, 0, null, 1), 'MS')
      .appendField('毫秒');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160); // 橙色
    this.setTooltip('让程序暂停指定时间（毫秒）');
    this.setHelpUrl('');
  }
};

// 打印
Blockly.Blocks['print'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('打印');
    this.appendValueInput('VALUE')
      .setCheck(null)
      .appendField('内容');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(160);
    this.setTooltip('打印数据到控制台和输出面板');
    this.setHelpUrl('');
  }
};
