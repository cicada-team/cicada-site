---
title: 项目开始
description: 基础教程
author: imink
index: [0, 2]
group: QUICK START 
---

## 安装 Cicada
安装之前确保系统已经安装了最新的 Node.js 以及 NPM，如果你还没有安装，请前往[这里](https://www.npmjs.com/get-npm)。

接下来，打开命令行工具，输入：

`npm install --save @cicada/render`

安装核心的引擎模块。你就可以写一些简单的程序了。因为 Cicada 应用于 React Lego 组件，你可以来[这里]() 找到我们提供的 antd UI 组件，或者也可以按照 [React Lego 规范](https://github.com/cicada-team/react-lego) 来根据需求编写组件。

如果想直接动手把玩，可以查阅 pages 下更多 demo 源码。

## 写一个 Hello Word 程序


在安装完 cicada 之后，我们可以通过一个 Hello World 程序，来认识一下常用的代码结构。因为 cicada 构建在 React 之上，我们完全可以按照 React 的方式来写 Hello Word 程序。
```js
import ReactDom form 'react-dom'
ReactDOM.render( <div>Hello World!</div>, document.getElementById('root'))
```
没错，这可以说是最简单的 React 用法了。接下来我们把 Cicada  的相关依赖导入，认识一下标准的 Cicada 程序写法。
```js
import React from 'react'
import ReactDOM from 'react-dom'
import connect from '@cicada/render/lib/connect'
import { mapValues } from '@cicada/render/lib/util'
import Render from '@cicada/render/lib/Render'
import createStateTree from '@cicada/render/lib/createStateTree'
import createAppearance from '@cicada/render/lib/createAppearance'
import createBackground from '@cicada/render/lib/createBackground'
import applyStateTreeSubscriber from '@cicada/render/lib/applyStateTreeSubscriber'
import * as validationBackground from '@cicada/render/lib/background/utility/validation'
import * as stateTreeBackground from '@cicada/render/lib/background/utility/stateTree'
import * as appearanceBackground from '@cicada/render/lib/background/utility/appearance'
import * as mapBackgroundToStateJob from '@cicada/render/lib/background/job/mapBackgroundToState'
import * as visibleJob from '@cicada/render/lib/background/job/visibility'
// 引入 React Lego 组件
import * as Input from './Input' 
import * as Button from './Button'


const C = mapValues({ Input, Button }, connect)
const stateTree = applyStateTreeSubscriber(createStateTree)()
const appearance = createAppearance()
const background = createBackground()

window.stateTree = stateTree
ReactDOM.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={background}
  >
  <C.Input />
  <C.Button />
  </Render>,
  document.getElementById('mount'),
)
```
<!--<div id="demo-1">这里挂载 snippet playground</div>-->

代码变多了起来是不是？当然，Cicada 本身不是用来处理的简单的页面渲染，我们在组件的基础之上，通过 Cicada 引擎赋予了组件更多的能力，通过组件本身暴露的状态的事件，让用户实现更多复杂的效果和需求。

## 我们引入了哪些变量，他们分别有什么作用
```js
const C = mapValues({ Input, Button }, connect)
```
首先我们看第一句，这里的 connect 实际上是用来封装我们的组件 Input, Button，赋予了组件一系列的特性，我们稍后会提到 connect 的具体原理。mapValues(object, function) 是一个 utility 方法， 第一个参数是组件对象，第二个参数是 connect 方法，轮询组件对象里面的每一个组件，同时运行一次 connect(component) 方法，最后返回一个封装过的组件对象。之后可以通过 `<C.Input />` 来声明一个组件。

```js
const stateTree = applyStateTreeSubscriber(createStateTree)()
const appearance = createAppearance() // 页面状态相关
const background = createBackground() // 页面监听事件
```
stateTree 是全局唯一的状态树，程序的状态数据（组件 UI 状态比如勾选框的 check 属性，组件的内部状态比如 a 标签的 href 值）都是通过 stateTree 来操作。

```js
window.stateTree = stateTree
ReactDOM.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={background}
  >
  <C.Input />
  <C.Button />
  </Render>,
  document.getElementById('mount'),
)
```
我们在组件的父级加上了自定义的 Render 方法（根节点），同时传入了 stateTree、appearance、background 作为 props。这里是改写了 React 的 Render 方法，把组件的 Render 控制权交给引擎。这么做的好处是可以配合之前 connect 过的组件，在渲染的时候，真正利用到 connect 过的组件的特性（之前 connect 只是声明了必要的方法，而 Render 才是真正执行渲染）

一个简单的 Cicada 程序至少包括了以上几个部分。但是 Cicada 本身可以做更多。接下来我们会简单介绍构建 Cicada 程序的基石：**React Lego 组件**

## 什么是 React Lego 组件规范

React Lego 组件规范是我们用来写适用于 Cicada 程序所共同遵循的一种方法。例如一个 Input 输入框，传统的 React 写法可以以 `const Input = () => {}` 的形式或者 `export default class Input extends Component` 的标准形式来写，其中包含了组件需要的 state 以及 props 还有一系列监听事件和生命周期函数，最后通过 Render 函数来完成组件的渲染。 React Lego 组件规范构建于传统的写法之上，暴露了更多的 state 和 props 以及更多可能用到的监听事件，通过 `export const` 提供给父级组件，通过父级组件来完成对内部状态的更新和操作。我们把内部状态暴露出来的组件称之为受控组件，把内部状态未暴露出来的组件称之为非受控组件。在一个较为复杂的应用场景下（比如联级验证），组件之间的状态是相互影响的。我们希望可以把对组件的控制权在一个统一的地方来管理，所以我们用到了全局的状态树，配合 React Lego 组件，使得组件与状态树绑定，我们就可以尽可能得细粒度来掌控组件。 

## 了解更多


## 未来

我们在不久的未来会推出基于 Cicada.js 的在线编辑器 Cicada IDE。Cicada.js 所具备的种种特性，包括 React Lego 组件规范，通过配置的方式编写组件，以及具备可扩展性的 Background 插件市场，使得不具备前端开发经验的用户也能够构建高度定制化的 CMS 页面，这就是我们孕育了很久的 Cicada IDE。敬请期待。