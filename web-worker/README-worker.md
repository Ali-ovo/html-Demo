# Web Worker 演示

这是一个Web Worker的演示应用，用于展示如何在Web应用中使用Web Worker处理耗时任务而不阻塞用户界面。

## 什么是Web Worker?

Web Worker提供了一种在Web应用中运行JavaScript代码的方法，这些代码在浏览器主线程之外的后台线程中执行。这意味着:

- 可以执行计算密集型任务而不会阻塞UI渲染和用户交互
- 用户界面保持响应，即使在执行大量计算的情况下
- 可以更好地利用多核CPU的性能

## 演示功能

本演示包含三个核心部分:

1. **主线程计算** - 展示在主线程中执行密集计算时UI阻塞的问题
2. **Worker线程计算** - 展示使用Web Worker时UI保持响应的优势
3. **数据通信** - 展示如何在主线程和Worker线程之间传递复杂数据

## 核心Web Worker概念

此演示展示了以下关键概念:

### 1. 创建Worker

```javascript
const worker = new Worker('worker.js');
```

### 2. 向Worker发送消息

```javascript
worker.postMessage({
  command: 'start',
  iterations: 10
});
```

### 3. 从Worker接收消息

```javascript
worker.onmessage = function(event) {
  const data = event.data;
  console.log('从Worker收到消息:', data);
};
```

### 4. 错误处理

```javascript
worker.onerror = function(error) {
  console.error('Worker错误:', error.message);
};
```

### 5. 终止Worker

```javascript
worker.terminate();
```

## Worker的限制

Web Worker有一些限制，需要了解:

- 不能直接访问DOM (不能操作UI元素)
- 不能访问`window`对象或`document`对象
- 有限的全局API访问
- 必须通过消息传递与主线程通信
- 文件必须遵循同源策略

## Worker中可用的API

Web Worker可以访问的部分API:

- `setTimeout()`, `setInterval()`
- `XMLHttpRequest` 和 `fetch`
- `Promise`
- `console` 方法
- `navigator` 对象的部分属性
- `WebSockets`
- `IndexedDB`
- `crypto`

## 如何运行演示

1. 在现代浏览器中打开 `worker-demo.html` 文件
2. 观察蓝色动画框的移动 - 这是用来检测主线程是否被阻塞的指示器
3. 点击不同的按钮测试各种功能:
   - "开始大量计算(会卡住UI)" - 演示主线程阻塞
   - "使用Worker执行大量计算" - 演示使用Worker的优势
   - "发送数据给Worker" - 演示数据通信

## 代码结构

- `worker-demo.html` - 主HTML文件和主线程JavaScript代码
- `worker.js` - Worker线程代码

## 浏览器支持

Web Worker在所有现代浏览器中得到良好支持:
- Chrome 4+
- Firefox 3.5+
- Safari
- Edge
- Opera

## 了解更多

- [MDN Web Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [HTML Living Standard - Web Workers](https://html.spec.whatwg.org/multipage/workers.html)
- [Web Workers vs Service Workers vs Worklets](https://bitsofco.de/web-workers-vs-service-workers-vs-worklets/) 