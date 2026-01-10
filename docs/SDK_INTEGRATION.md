# SDK 集成指南

这个项目展示了如何在 Blockly 中调用自定义 JavaScript SDK。

## 文件结构

- `sdk.js` - 示例 SDK，你可以替换成你自己的 SDK
- `custom-blocks.js` - 自定义积木定义（定义积木的外观和行为）
- `custom-generators.js` - 自定义代码生成器（定义如何将积木转换为代码）
- `main.js` - 主文件，集成所有组件

## 如何添加你自己的 SDK

### 步骤 1: 替换 SDK 文件

编辑 `sdk.js`，替换成你自己的 SDK：

```javascript
// 你的 SDK 类
class MySDK {
  // 你的方法
  async myMethod(param1, param2) {
    // 你的实现
  }
}

// 创建全局实例
window.mySDK = new MySDK();
export default window.mySDK;
```

### 步骤 2: 定义自定义积木

在 `custom-blocks.js` 中为你的 SDK 方法创建积木：

```javascript
Blockly.Blocks['sdk_my_method'] = {
  init: function() {
    // 定义积木的外观
    this.appendValueInput('PARAM1')
      .setCheck('String')
      .appendField('我的方法');
    this.appendValueInput('PARAM2')
      .setCheck('Number')
      .appendField('参数2');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230); // 颜色
    this.setTooltip('调用我的方法');
  }
};
```

### 步骤 3: 定义代码生成器

在 `custom-generators.js` 中定义如何生成代码：

```javascript
javascriptGenerator.forBlock['sdk_my_method'] = function(block) {
  const param1 = javascriptGenerator.valueToCode(block, 'PARAM1', Order.NONE) || "''";
  const param2 = javascriptGenerator.valueToCode(block, 'PARAM2', Order.NONE) || '0';
  return `await mySDK.myMethod(${param1}, ${param2});\n`;
};
```

### 步骤 4: 添加到工具箱

在 `main.js` 的工具箱配置中添加你的积木：

```javascript
{
  kind: 'category',
  name: '我的 SDK',
  contents: [
    {
      kind: 'block',
      type: 'sdk_my_method'  // 你的积木类型
    }
  ]
}
```

## 积木类型说明

### 语句积木（Statement Block）
- 用于执行操作，不返回值
- 设置：`this.setPreviousStatement(true, null);`
- 示例：初始化、登录、发送消息

### 值积木（Value Block）
- 用于返回值，可以连接到其他积木
- 设置：`this.setOutput(true, 'Number');` 或 `this.setOutput(true, 'String');`
- 示例：计算、获取用户信息

## 代码生成说明

### 同步方法
```javascript
javascriptGenerator.forBlock['sdk_add'] = function(block) {
  const a = javascriptGenerator.valueToCode(block, 'A', Order.ADDITION) || '0';
  const b = javascriptGenerator.valueToCode(block, 'B', Order.ADDITION) || '0';
  return [`mySDK.add(${a}, ${b})`, Order.FUNCTION_CALL];
};
```

### 异步方法
```javascript
javascriptGenerator.forBlock['sdk_login'] = function(block) {
  const username = javascriptGenerator.valueToCode(block, 'USERNAME', Order.NONE) || "''";
  const password = javascriptGenerator.valueToCode(block, 'PASSWORD', Order.NONE) || "''";
  return `await mySDK.login(${username}, ${password});\n`;
};
```

## 示例：完整的 SDK 方法集成

假设你的 SDK 有一个 `createOrder` 方法：

```javascript
// 1. SDK 方法（在 sdk.js 中）
async createOrder(productId, quantity, price) {
  return { orderId: '123', total: quantity * price };
}

// 2. 积木定义（在 custom-blocks.js 中）
Blockly.Blocks['sdk_create_order'] = {
  init: function() {
    this.appendDummyInput()
      .appendField('创建订单');
    this.appendValueInput('PRODUCT_ID')
      .setCheck('String')
      .appendField('商品ID');
    this.appendValueInput('QUANTITY')
      .setCheck('Number')
      .appendField('数量');
    this.appendValueInput('PRICE')
      .setCheck('Number')
      .appendField('价格');
    this.setOutput(true, 'Object');
    this.setColour(230);
    this.setTooltip('创建新订单');
  }
};

// 3. 代码生成器（在 custom-generators.js 中）
javascriptGenerator.forBlock['sdk_create_order'] = function(block) {
  const productId = javascriptGenerator.valueToCode(block, 'PRODUCT_ID', Order.NONE) || "''";
  const quantity = javascriptGenerator.valueToCode(block, 'QUANTITY', Order.NONE) || '0';
  const price = javascriptGenerator.valueToCode(block, 'PRICE', Order.NONE) || '0';
  return [`await mySDK.createOrder(${productId}, ${quantity}, ${price})`, Order.FUNCTION_CALL];
};

// 4. 添加到工具箱（在 main.js 中）
{
  kind: 'block',
  type: 'sdk_create_order'
}
```

## 调试技巧

1. 打开浏览器控制台，查看生成的代码
2. 使用 `console.log` 在 SDK 方法中输出调试信息
3. 检查积木是否正确连接到其他积木
4. 验证生成的代码语法是否正确

## 常见问题

### Q: 生成的代码有语法错误？
A: 检查代码生成器中的字符串拼接，确保引号正确转义。

### Q: 异步方法不工作？
A: 确保在代码生成器中使用 `await`，并且生成的代码被包装在 `async` 函数中。

### Q: 积木不显示在工具箱中？
A: 检查积木类型名称是否与工具箱配置中的一致。

### Q: 如何修改积木颜色？
A: 在积木定义中使用 `this.setColour(颜色值)`，颜色值是 0-360 的色相值。
