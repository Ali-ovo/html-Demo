// Web Worker 脚本
// 这个代码在一个独立的线程中运行，不会阻塞主UI线程

// 工作状态标志
let shouldStop = false;

// 监听来自主线程的消息
self.addEventListener('message', function(event) {
    const message = event.data;
    
    // 根据命令类型执行不同的操作
    switch (message.command) {
        case 'start':
            shouldStop = false;
            performHeavyCalculation(message.iterations || 10);
            break;
            
        case 'stop':
            shouldStop = true;
            break;
            
        case 'processData':
            processComplexData(message.data);
            break;
            
        default:
            // 未知命令，发送错误
            self.postMessage({
                type: 'error',
                message: `未知命令: ${message.command}`
            });
    }
});

/**
 * 执行计算密集型任务
 * @param {number} totalIterations - 要执行的迭代次数
 */
function performHeavyCalculation(totalIterations) {
    // 重置停止标志
    shouldStop = false;
    
    // 每个迭代的函数
    function runIteration(iteration) {
        // 检查是否应该停止
        if (shouldStop) {
            self.postMessage({
                type: 'result',
                message: '计算已停止',
                iteration: iteration,
                total: totalIterations,
                duration: 0
            });
            return;
        }
        
        // 执行一些计算密集型操作
        const start = performance.now();
        
        // 模拟大量计算
        let result = 0;
        for (let i = 0; i < 200000000; i++) {
            result += Math.sqrt(i);
        }
        
        const end = performance.now();
        const duration = Math.round(end - start);
        
        // 发送进度更新
        self.postMessage({
            type: 'progress',
            progress: (iteration / totalIterations) * 100
        });
        
        // 发送结果
        self.postMessage({
            type: 'result',
            iteration: iteration,
            total: totalIterations,
            duration: duration
        });
        
        // 如果还有更多迭代要做，则安排下一个
        if (iteration < totalIterations && !shouldStop) {
            // 使用超时来允许其他消息处理
            setTimeout(function() {
                runIteration(iteration + 1);
            }, 0);
        }
    }
    
    // 开始第一次迭代
    runIteration(1);
}

/**
 * 处理复杂数据结构
 * @param {Object} data - 要处理的数据对象
 */
function processComplexData(data) {
    // 确保数据存在
    if (!data) {
        self.postMessage({
            type: 'error',
            message: '没有提供数据'
        });
        return;
    }
    
    try {
        // 使用setTimeout使处理异步进行，不会阻止其他消息
        setTimeout(() => {
            // 处理数字数组
            const numbers = data.numbers || [];
            const sum = numbers.reduce((total, num) => total + num, 0);
            const average = numbers.length > 0 ? sum / numbers.length : 0;
            
            // 处理文本
            const text = data.text || '';
            let textSummary = '';
            
            if (text) {
                if (text.length > 20) {
                    textSummary = text.substring(0, 20) + '... (长度: ' + text.length + ')';
                } else {
                    textSummary = text + ' (长度: ' + text.length + ')';
                }
            }
            
            // 处理配置
            const config = data.config || {};
            const algorithmType = config.useFastAlgorithm ? '快速' : '标准';
            
            // 从配置中提取过滤器
            const filters = config.filters || [];
            
            // 发送处理结果
            self.postMessage({
                type: 'dataResult',
                summary: {
                    numberCount: numbers.length,
                    sum: sum,
                    average: average.toFixed(2),
                    textSummary: textSummary,
                    algorithmType: algorithmType,
                    processingLevel: config.processingLevel,
                    filters: filters
                }
            });
        }, 500); // 添加一点延迟以模拟处理时间
    } catch (error) {
        self.postMessage({
            type: 'error',
            message: '处理数据时出错: ' + error.message
        });
    }
}

// 错误处理
self.addEventListener('error', function(event) {
    self.postMessage({
        type: 'error',
        message: 'Worker错误: ' + event.message
    });
});

// 通知主线程Worker已加载
self.postMessage({
    type: 'info',
    message: 'Worker已加载并准备好'
}); 