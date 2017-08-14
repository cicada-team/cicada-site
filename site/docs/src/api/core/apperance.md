---
title: apperance
description: 基础教程
author: imink
group: CORE
index: [0, 999]
---

## createAppearance(stateTree, externalProps = {})
Appearcance 专门用来处理组件的样式问题，比如显隐样式，以及加入用户自定义的属性。


### 参数/props 
#### stateTree - 声明的状态树对象
#### externalProps - 外部属性对象

### 返回值
返回一个 appearance 对象，提供如下的方法
#### register() - 注册方法 
#### isVisibleById() - 获取组件的显隐状态
#### setVisibleById() - 设置组件的显隐状态
#### replaceChildrenById() - 用来替换组件的子组件
#### subscribe() - 全局的组件消息订阅
#### subscribeById() - 精确的组件消息订阅
#### mergeStyleById() - 局部更新组件样式

### 用法
```js
// 声明
const appearance = createAppearance()
```