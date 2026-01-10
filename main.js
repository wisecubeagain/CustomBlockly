import * as Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';
// 导入 blocks 以注册所有默认积木
import 'blockly/blocks';
// 导入 SDK
import './sdk.js';
// 导入自定义积木定义
import './custom-blocks.js';
// 导入自定义代码生成器
import './custom-generators.js';

// 创建 Blockly 工作区
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: {
    kind: 'categoryToolbox',
    contents: [
      {
        kind: 'category',
        name: '逻辑',
        colour: '#5C81A6',
        contents: [
          {
            kind: 'block',
            type: 'controls_if'
          },
          {
            kind: 'block',
            type: 'logic_compare'
          },
          {
            kind: 'block',
            type: 'logic_operation'
          },
          {
            kind: 'block',
            type: 'logic_negate'
          },
          {
            kind: 'block',
            type: 'logic_boolean'
          }
        ]
      },
      {
        kind: 'category',
        name: '循环',
        colour: '#5CA65C',
        contents: [
          {
            kind: 'block',
            type: 'controls_repeat_ext'
          },
          {
            kind: 'block',
            type: 'controls_forEach'
          },
          {
            kind: 'block',
            type: 'controls_whileUntil'
          }
        ]
      },
      {
        kind: 'category',
        name: '数学',
        colour: '#5C68A6',
        contents: [
          {
            kind: 'block',
            type: 'math_number'
          },
          {
            kind: 'block',
            type: 'math_arithmetic'
          },
          {
            kind: 'block',
            type: 'math_single'
          }
        ]
      },
      {
        kind: 'category',
        name: '文本',
        colour: '#5CA68D',
        contents: [
          {
            kind: 'block',
            type: 'text'
          },
          {
            kind: 'block',
            type: 'text_join'
          },
          {
            kind: 'block',
            type: 'text_length'
          }
        ]
      },
      {
        kind: 'category',
        name: '变量',
        colour: '#A65C81',
        custom: 'VARIABLE'
      },
      {
        kind: 'category',
        name: '函数',
        colour: '#9A5CA6',
        custom: 'PROCEDURE'
      },
      {
        kind: 'category',
        name: 'WebSocket',
        colour: '#C8A2C8',
        contents: [
          {
            kind: 'block',
            type: 'ws_connect'
          },
          {
            kind: 'block',
            type: 'ws_connect_sse'
          },
          {
            kind: 'block',
            type: 'ws_send'
          },
          {
            kind: 'block',
            type: 'ws_send_and_wait'
          },
          {
            kind: 'block',
            type: 'ws_measure_latency'
          },
          {
            kind: 'block',
            type: 'ws_get_status'
          },
          {
            kind: 'block',
            type: 'ws_disconnect'
          },
          {
            kind: 'block',
            type: 'ws_disconnect_sse'
          }
        ]
      },
      {
        kind: 'category',
        name: '工具',
        colour: '#A0A0A0',
        contents: [
          {
            kind: 'block',
            type: 'sleep'
          },
          {
            kind: 'block',
            type: 'print'
          }
        ]
      }
    ]
  },
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
    snap: true
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  },
  trashcan: true
});

// 监听工作区变化，自动生成代码
workspace.addChangeListener((event) => {
  // 忽略 UI 事件（如选择、折叠等），只处理代码相关变化
  if (event.type !== Blockly.Events.UI) {
    generateCode();
  }
});

// 存储生成的代码
let currentGeneratedCode = '';

// 生成代码函数
window.generateCode = function() {
  // 生成代码时，如果是异步函数，需要包装在 async 函数中
  let code = javascriptGenerator.workspaceToCode(workspace);
  currentGeneratedCode = code;
  
  // 如果代码中包含 await，则包装在 async 函数中
  if (code.includes('await')) {
    code = `(async function() {\n${code}})();`;
  }
  
  document.getElementById('generatedCode').textContent = code || '// 暂无代码生成';
};

// 运行代码函数
window.runCode = async function() {
  const outputDiv = document.getElementById('output');
  outputDiv.className = '';
  
  if (!currentGeneratedCode || currentGeneratedCode.trim() === '') {
    outputDiv.textContent = '❌ 错误: 没有可执行的代码，请先拖拽积木并生成代码';
    outputDiv.className = 'error';
    return;
  }
  
  // 清空输出
  outputDiv.textContent = '⏳ 正在运行...\n';
  
  // 清空 print 输出缓冲区
  const printLogs = [];
  window.onPrint = function(data) {
    printLogs.push(data);
    if (originalOnPrint) {
      originalOnPrint(data);
    }
  };
  
  // 捕获 console.log 输出
  const logs = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalOnPrint = window.onPrint;
  
  console.log = (...args) => {
    logs.push('[LOG] ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' '));
    originalLog.apply(console, args);
  };
  
  console.error = (...args) => {
    logs.push('[ERROR] ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' '));
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    logs.push('[WARN] ' + args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' '));
    originalWarn.apply(console, args);
  };
  
  try {
    // 准备执行的代码
    let codeToRun = currentGeneratedCode;
    
    // 如果代码中包含 await，包装在 async 函数中
    if (codeToRun.includes('await')) {
      // 使用 Function 构造函数创建异步函数
      const asyncFunction = new Function('return (async function() {\n' + codeToRun + '\n})()');
      const result = await asyncFunction();
      
      // 恢复 console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      window.onPrint = originalOnPrint;
      
      // 显示输出
      let output = '✅ 执行成功！\n\n';
      
      if (printLogs.length > 0) {
        output += '打印输出:\n' + printLogs.map(log => '[PRINT] ' + log).join('\n') + '\n\n';
      }
      
      if (logs.length > 0) {
        output += '控制台输出:\n' + logs.join('\n') + '\n\n';
      }
      
      if (result !== undefined) {
        output += '返回值:\n' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      }
      
      outputDiv.textContent = output;
      outputDiv.className = 'success';
      return;
    } else {
      // 同步代码直接执行
      const result = Function('"use strict";\n' + codeToRun)();
      
      // 恢复 console
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      window.onPrint = originalOnPrint;
      
      // 显示输出
      let output = '✅ 执行成功！\n\n';
      
      if (printLogs.length > 0) {
        output += '打印输出:\n' + printLogs.map(log => '[PRINT] ' + log).join('\n') + '\n\n';
      }
      
      if (logs.length > 0) {
        output += '控制台输出:\n' + logs.join('\n') + '\n\n';
      }
      
      if (result !== undefined) {
        output += '返回值:\n' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
      }
      
      outputDiv.textContent = output;
      outputDiv.className = 'success';
    }
    
  } catch (error) {
    // 恢复 console
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
    window.onPrint = originalOnPrint;
    
    // 显示错误
    let errorOutput = '❌ 执行出错！\n\n';
    errorOutput += '错误信息: ' + error.message + '\n\n';
    errorOutput += '错误堆栈:\n' + (error.stack || '无堆栈信息');
    
    if (logs.length > 0) {
      errorOutput += '\n\n执行日志:\n' + logs.join('\n');
    }
    
    outputDiv.textContent = errorOutput;
    outputDiv.className = 'error';
    
    // 也在控制台输出错误
    originalError('代码执行错误:', error);
  }
};

// 清空工作区函数
window.clearWorkspace = function() {
  if (confirm('确定要清空所有积木吗？')) {
    workspace.clear();
    document.getElementById('generatedCode').textContent = '工作区已清空';
  }
};

// 初始化时生成一次代码
generateCode();

