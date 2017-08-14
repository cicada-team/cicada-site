---
title: connect
description: 基础教程
author: imink
group: CORE
index: [0, 1]
---

## connect(declarativeComponent, displayName)
connect 用于封装 React Lego 组件，主要完成了3件事情
1. 处理组件的数据。包括首次 render 时把数据注册到 stateTree 中，收到变化时从 stateTree 上取数据传给组件
2. 处理组件的交互行为。包括包装 listener，intercepter 等。其中比较重要的是包装过成中还要考虑到组件的受控态和非受控态。在受控状态下修改数据的部分被包装成一个一个 changeFn ，留给外部调用。这个机制在复合组件中用到了
3. 和 Render 一起，提供了 Background 机制。将 Background 作为注入参数供用户使用。
### 参数/props 
#### declarativeComponent React Lego 组件，组件本身返回多个方法和属性提供 connect 封装和利用
#### dispalyName string 组件名称

### 返回值
返回一个经过 connect() 封装后的组件

### 用法

```js
import * as Input from './Input'
import * as Checkbox from './Checkbox'
import * as Repeat from './Repeat'
import * as Button from './Button'
import * as Box from './Box'

// mapValue 用来循环遍历 React Lego 规范的组件，返回经过 connect 过的组件集合
const components = mapValues({ Input, Checkbox, Repeat, Button, Box }, connect)

```