# Go WebAssembly与Web Worker演示

这个演示项目展示了如何使用Go语言编写WebAssembly模块，并在Web Worker中运行，从而实现高性能计算而不阻塞浏览器的主线程。

## 项目结构

- `fibonacci.go` - Go语言编写的斐波那契算法，用于编译为WebAssembly
- `wasm-worker.js` - Web Worker脚本，用于在后台线程加载和执行WebAssembly
- `go-wasm-demo.html` - 主页面，包含用户界面和演示功能
- `wasm_exec.js` - Go语言WebAssembly运行时支持文件（需从Go安装目录复制）

## 准备工作

1. **安装Go语言**
   如果你还没有安装Go，请从[官方网站](https://golang.org/dl/)下载并安装。

2. **编译Go代码为WebAssembly**
   ```bash
   # 编译fibonacci.go为WebAssembly模块
   GOOS=js GOARCH=wasm go build -o fibonacci.wasm fibonacci.go
   ```

3. **获取Go的WebAssembly运行时支持文件**
   ```bash
   # 复制wasm_exec.js文件到当前目录
   cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .
   ```

4. **启动HTTP服务器**
   由于浏览器安全限制，WebAssembly模块必须通过HTTP服务器加载，而不能直接从文件系统加载。
   ```bash
   # 使用Python的SimpleHTTPServer
   python -m http.server
   # 或者使用Python 2
   # python -m SimpleHTTPServer
   ```

5. **访问演示页面**
   打开浏览器，访问 http://localhost:8000/go-wasm-demo.html

## 演示功能

1. **UI响应性测试** - 通过动画观察主线程是否被阻塞
2. **性能对比** - 比较在主线程和Worker线程中计算大斐波那契数的性能差异
3. **WebAssembly加载状态** - 显示Go WebAssembly模块的加载和运行状态

## Go和WebAssembly的关键概念

### Go WebAssembly编译

Go从1.11版本开始支持将代码编译为WebAssembly。与C/Rust等语言不同，Go在编译为WebAssembly时会包含整个Go运行时，因此文件较大，但使用更简单。

### syscall/js包

Go提供了`syscall/js`包，用于与JavaScript环境交互：
- `js.Global()` - 获取JavaScript全局对象
- `js.FuncOf()` - 将Go函数转换为JavaScript可调用的形式
- `js.ValueOf()` - 在Go和JavaScript值之间转换

### Web Worker

Web Worker允许在浏览器中创建后台线程执行JavaScript代码：
- 不会阻塞UI渲染
- 通过消息传递(`postMessage`/`onmessage`)与主线程通信
- 可以加载和执行WebAssembly模块

## 学习资源

- [Go WebAssembly官方文档](https://github.com/golang/go/wiki/WebAssembly)
- [MDN Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [MDN WebAssembly](https://developer.mozilla.org/zh-CN/docs/WebAssembly)

## 疑难解答

### WebAssembly加载失败

- 确保`wasm_exec.js`文件存在且与Go编译器版本匹配
- 确保使用HTTP服务器而不是直接打开HTML文件
- 检查浏览器控制台是否有错误信息

### Worker内部加载WebAssembly失败

- 确保在Worker中正确使用`importScripts`加载`wasm_exec.js`
- 创建Go实例并使用正确的导入对象(`go.importObject`)
- 使用`go.run()`启动Go程序 