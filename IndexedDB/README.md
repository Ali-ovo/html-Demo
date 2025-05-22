# IndexedDB 任务管理器演示

这是一个使用 IndexedDB 构建的简单任务管理应用，用于展示 IndexedDB 的基本操作和用法。

## 功能特点

- 创建、读取、更新和删除任务（CRUD 操作）
- 标记任务为已完成/未完成
- 过滤显示全部/已完成/未完成任务
- 实时统计任务数量
- 持久化存储数据（即使关闭浏览器后再打开，数据依然存在）

## 如何运行

1. 打开 `demo.html` 文件在现代浏览器中运行（Chrome, Firefox, Edge 等）
2. 无需安装任何依赖，所有功能都使用原生浏览器 API

## IndexedDB 知识点

此演示包含以下 IndexedDB 核心概念：

1. **数据库连接和初始化**：
   - 使用 `indexedDB.open()` 打开数据库连接
   - 通过 `onupgradeneeded` 事件处理数据库版本升级
   - 创建对象存储（object store）和索引

2. **事务和操作**：
   - 创建读写事务 (`readwrite`) 和只读事务 (`readonly`)
   - 添加数据：`store.add()`
   - 读取数据：`store.get()` 和 `store.getAll()`
   - 更新数据：`store.put()`
   - 删除数据：`store.delete()`

3. **索引和查询**：
   - 创建索引以便于检索：`store.createIndex()`
   - 通过索引查询数据：`store.index('completed').getAll()`

4. **异步操作处理**：
   - 使用 Promise 包装 IndexedDB 的事件回调
   - 使用 async/await 使异步代码更可读

5. **事件处理**：
   - `onsuccess`：操作成功完成
   - `onerror`：操作出错
   - `oncomplete`：事务完成

## 代码结构

- **数据库操作函数**：
  - `getDB()`: 获取数据库连接
  - `addTask()`: 添加新任务
  - `getAllTasks()`: 获取所有任务
  - `getTask()`: 获取单个任务
  - `updateTask()`: 更新任务
  - `deleteTask()`: 删除任务
  - `findTasksByStatus()`: 按完成状态查询任务

- **UI交互函数**：
  - `loadTasks()`: 加载并显示任务
  - `updateStats()`: 更新统计信息
  - 各种事件监听器处理用户交互

## 浏览器支持

IndexedDB 在所有现代浏览器中都得到支持，包括：
- Chrome 23+
- Firefox 16+
- Safari 10+
- Edge 12+

## 了解更多

- [MDN IndexedDB API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [IndexedDB 基本概念](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Basic_Concepts_Behind_IndexedDB) 