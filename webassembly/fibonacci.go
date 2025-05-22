// fibonacci.go
// Go实现的WebAssembly斐波那契计算器

package main

import (
	"syscall/js"
)

// 递归计算斐波那契数列
func fibonacci(n int) int {
	if n <= 1 {
		return n
	}
	return fibonacci(n-1) + fibonacci(n-2)
}

// 迭代计算斐波那契数列(更高效)
func fibonacciIterative(n int) int {
	if n <= 1 {
		return n
	}
	
	a, b := 0, 1
	for i := 2; i <= n; i++ {
		a, b = b, a+b
	}
	return b
}

// 将fibonacci函数导出到JavaScript
func fibonacciWrapper() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 1 {
			return 0
		}
		n := args[0].Int()
		
		// 使用迭代方法避免大数值的递归栈溢出
		result := fibonacciIterative(n)
		return result
	})
}

// 主函数
func main() {
	// 创建一个channel用于保持程序运行
	c := make(chan struct{}, 0)
	
	// 注册JavaScript函数
	js.Global().Set("goFibonacci", fibonacciWrapper())
	
	println("Go WebAssembly初始化完成")
	
	// 阻塞以保持程序运行
	<-c
}

// 编译命令:
// GOOS=js GOARCH=wasm go build -o fibonacci.wasm fibonacci.go 