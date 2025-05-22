// Web Worker 用于在后台执行Go WebAssembly计算
// 此脚本将在单独的线程中运行

// 首先导入Go的wasm运行时支持
importScripts('wasm_exec.js');

// Go WebAssembly状态
let goWasmLoaded = false;
let fibonacciReady = false;

// 初始化函数 - 加载Go WebAssembly模块
async function initGoWasm() {
  try {
    console.log('Worker: 开始加载Go WebAssembly模块...');
    
    // 创建Go实例
    const go = new Go();
    
    // 加载wasm文件
    const result = await WebAssembly.instantiateStreaming(
      fetch('fibonacci.wasm'),
      go.importObject
    );
    
    // 运行Go程序，这会注册goFibonacci函数
    go.run(result.instance);
    
    // 检查函数是否可用
    if (typeof self.goFibonacci === 'function') {
      fibonacciReady = true;
      console.log('Worker: Go WebAssembly斐波那契函数已就绪');
    } else {
      console.error('Worker: Go WebAssembly已加载，但找不到斐波那契函数');
    }
    
    goWasmLoaded = true;
    
    // 通知主线程模块已加载
    self.postMessage({
      type: 'init',
      success: true,
      wasmLoaded: true
    });
    
  } catch (error) {
    console.error('Worker: 加载Go WebAssembly失败:', error);
    
    // 通知主线程加载失败
    self.postMessage({
      type: 'init',
      success: false,
      error: error.toString(),
      wasmLoaded: false
    });
  }
}

// JavaScript实现的斐波那契 (当WebAssembly不可用时使用)
function fibonacciJs(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}

// 处理计算斐波那契的请求
function handleFibonacci(n) {
  console.log(`Worker: 计算斐波那契(${n})开始`);
  const start = performance.now();
  
  let result;
  let method;
  
  // 检查WebAssembly是否可用
  if (fibonacciReady && typeof self.goFibonacci === 'function') {
    // 使用Go WebAssembly计算
    try {
      result = self.goFibonacci(n);
      method = 'wasm';
    } catch (error) {
      console.error('Worker: WebAssembly计算出错，回退到JS实现:', error);
      result = fibonacciJs(n);
      method = 'js-fallback';
    }
  } else {
    // 使用JavaScript实现
    result = fibonacciJs(n);
    method = 'js';
  }
  
  const end = performance.now();
  const duration = end - start;
  
  // 发送结果回主线程
  self.postMessage({
    type: 'result',
    input: n,
    result: result,
    duration: duration,
    method: method
  });
}

// 处理来自主线程的消息
self.addEventListener('message', function(event) {
  const message = event.data;
  
  switch (message.type) {
    case 'init':
      // 初始化WebAssembly
      initGoWasm();
      break;
      
    case 'calculate':
      // 计算斐波那契数
      if (message.n !== undefined) {
        handleFibonacci(message.n);
      } else {
        self.postMessage({
          type: 'error',
          message: '缺少参数n'
        });
      }
      break;
      
    case 'status':
      // 返回状态信息
      self.postMessage({
        type: 'status',
        wasmLoaded: goWasmLoaded,
        fibonacciReady: fibonacciReady
      });
      break;
      
    default:
      self.postMessage({
        type: 'error',
        message: `未知命令: ${message.type}`
      });
  }
});

// Worker启动时发送初始状态
self.postMessage({
  type: 'ready',
  wasmLoaded: false,
  message: 'Worker已启动，等待指令'
}); 