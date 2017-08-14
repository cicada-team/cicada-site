---
title: dynamicRender
description: 基础教程
author: imink
group: CORE
index: [0, 999]
---

## createDynamicRender(..args)

有些情况下，组件是需要动态生成的（无法在页面访问前定义），比如用户点击一个按钮触发一个模态框生成。createDynamicRender 可以通过用户定义的 config 配置文件来动态生成组件

### 参数/props 
`..args` 包括
#### createStateTree - stateTree 实例
#### createAppearance - Appearance 实例
#### createBackground - Background 容器实例 
#### backgroundDef - Background 插件集合

### 返回值
返回一个具有 Render 方法的组件，与传统 React Lego 组件不同，该组件支持渲染 config 配置的子组件。通过添加属性 config，我们可以动态生成任意组件。

### 用法
```js
import createDynamicRender from '@cicada/render/lib/createDynamicRender'
import connect from '@cicada/render/lib/connect'

const DynamicRender = connect(createDynamicRender(
  applyStateTreeSubscriber(createStateTree),
  createAppearance,
  createBackground,
  backgroundDef,
), 'DynamicRender')
```