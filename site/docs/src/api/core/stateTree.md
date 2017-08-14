---
title: stateTree
description: 基础教程
author: imink
group: CORE
index: [0, 3]
---

## createStateTree(initialStateTree)
用于创建不具备事件订阅的状态树，但是包含了基本的数据操作

### 参数/props 
* initialStateTree - 一个包含状态树初始值的对象

### 返回值
返回一个具有基本数据操作的对象，该对象返回方法有：
#### get 获取组件状态
####  getById 根据 stateId 获取组件状态
#### getWithDetail 获取包含路径信息的状态
####  set 设置状态（原子操作，会直接覆盖原数据）
#### merge 合并状态 （局部操作，更新已有的状态）
#### reset 重置到节点的初始状态
#### resetHard 重置到组件的初始状态

> 以下 XXXById 提供给 Utility 和 Job 使用
#### setById
#### mergeById
#### resetById
#### resetHardById
#### defaults 注册组件的初始值
#### register 注册状态树
#### getTypeById: 获取组件类型
#### getVersion: 获取组件版本

### 用法
```js
const stateTree = createStateTree({{}})
```

## applyStateTreeSubscriber(stateTree)
赋予状态树具备消息订阅的能力, 包括 pub 发布和 sub 订阅能力，实现了对组件的精确更新，通过劫持参数 stateTree 的 register 方法，可以精确把组件的 subscriber 和 组件的 stateId 对应起来。
### 参数
#### stateTree 经过 createStateTree 生成的状态树对象

### 返回值
返回一个具有事件订阅机制的状态树， 该对象具备以下方法：
#### origin 
#### set
#### merge
#### resetHard
#### setById
#### mergeById
#### resetById
#### resetHardById
#### subscribe 
#### forceSubscribe
#### subscribeByStateId
#### cache - 标记允许多次改变合并成一次更新
#### flush - 强制每次更新

### 用法

```js
const stateTree = applyStateTreeSubscriber(createStateTree)()
```