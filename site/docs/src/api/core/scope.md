---
title: Scope
description: 基础教程
author: imink
group: CORE
index: [0, 999]
---

## Scope
<Scope /> 组件用来动态生成列表或者表格类型的组件，用户可以通过在重复组件的外层嵌套 <Scope /> 组件，从而避免对每个子组件都写上唯一的 bind。Scope 会对每个同样的子组件自动生成唯一的 statePath，e.g. `todoList.items.0.todo, todoList.items.1.todo`。

### 参数/props 
#### relativeChildStatePath - 相对的 statePath，e.g. `items.${index}` 
#### key - 重复组件的 index

### 返回值


### 用法
```js

```