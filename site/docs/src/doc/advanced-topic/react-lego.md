---
title: React lego 组件规范
description: react lego specification
author: imink
group: ADVANCED
index: [3, 2]
---

## 安装

仓库中提供了 examples。可直接通过以下命令启动查看:

```bash
npm install
npm start
// visit 127.0.0.1/examples/basic 或者 127.0.0.1/examples/wrapper
```

仓库中提供的 wrap 函数可以直接将 react-lego 组件打包成普通 react 组件进行使用。使用方法参考 example 中的代码。

## 概览

React Lego 组件规范是 Cicada 框架中非常重要的一环。我们认为一个复杂的前端页面是由无数组件构成，这里的组件，可以是 React 写法的组件，也可以是 React Lego 组件。前端引擎通过用户组织的组件，去构建具备了复杂交互、完整状态的页面。与传统后端通过模板渲染前端页面不一样，前端渲染啊的组件化的页面提供了更多的功能来应对各种各样的场景，比如获取一个下拉框的选取状态、触发勾选框的勾选状态来更改另一个勾选框的勾选状态。 React Lego 正是后者中的一种写法规范。

## 案例

相比于传统的 React 组件，React Lego 最主要的特点在于: 直接将组件的 state, listener, render 暴露到外部，由外部框架负责创建成 React 组件。一个典型的 Lego 组件例子如下:

```javascript
  export const defaultStateTypes = {/* state 的类型声明 */}

  export const defaultState = {/* 默认的 state */}

  export function initialize() {
    // 返回一个对象，改对象将作为 instance 参数注入到所有函数中。可将 instance 作为数据缓存
    return {}
  }

  export const interceptors = [/* 声明外部传入的函数类型的属性 */]

  export const defaultListeners = {
    // 第一参数为外部框架注入。后面的参数即调用 listener 时传入的参数。
    onClick({ state, instance }, ...args) {
      // const changedStateValues = ...
      // changedStateValues 只包含变化了的 state 字段
      return changedStateValues
    }
  }

  export defaultWrappers = {
    // 可由外部传入的语义化的子组件
    Text: 'span'
  }

  export const identifiers = {
    // 例如 Tabs 下的 TabPane。Input 的 Prefix 这种占位符式的组件需要在这里声明
  }

  export function render({state, children, instance, listeners, wrappers, interceptors}) {
    return <div></div>
  }
 ```

## defaultStateTypes

声明的方式和 react 的 defaultPropTypes 一样。可以直接使用 `prop-types` 来声明。例如:

```javascript
export const defaultStateTypes = {
  value: PropTypes.string.isRequired
}
```

## defaultState

在 lego 中不再区别 state 和 props，所有会影响到组件渲染的数据，都应该写成 state。state 即可由内部 listener 修改，也可由外部传入。在设计 state 时，应该遵循一下原则:

 - state 的各个值之间尽量不要存在依赖关系。如果存在，应该拆成更原子的多个值。或者合并成一个值。
 - 优化性能的缓存数据应该存在 instance 上。

注意，state 中不应该包含函数，要由外部传如的函数应该使用 interceptors。

## initialize

组件初始化时调用，放回的对象会贯穿组件的整个生命周期。可以在对象上存放缓存数据。

## interceptors

当组件需要获取外部传入函数，并且根据函数的返回值再进行渲染或者运算时，应该声明需要的 interceptors 的名字。例如 Upload 组件通常会一个 `beforeUpload` 函数来判断是否要上传。那么再组件中就应该声明:

 ```javascript
 export const interceptors = ['beforeUpload']
 ```

## defaultListeners

组件默认的 state 处理函数。参数的第一参数是由外部注入的，一定会包含 state/instance 两个值。剩下的参数即是调用 listener 是传入的参数。返回值应该是变化的 state 键值对。注意，listener 应该为纯函数，其中不应该有 ajax 和其他副作用。例如 Input:

 ```javascript
  export const listeners = {
    onChange(_, e) {
      return {  value: e.target.value }
    }
  }

  export render({state, listeners}) {
    return <input value={state.value} onChange={listeners.onChange} />
  }
 ```

## defaultWrappers

组件用来包装自身内容的语义化的标签。可以用来做外部样式的复写，或者多语言支持等。声明的 wrapper 必须是一个标准的 react 组件。以一个简单的文字展示组件为例:

```javascript
export defaultWrappers = {
  Text: 'span'
}

export render({ state, wrappers }) {
  return <div><Text>name: </Text><input value={state.name}/></div>
}
```

在传统的组件库中，要支持样式的复写，通常是与外部约定 className。要支持多语言通常是在组件内判断外部是否有要传入复写的文字。而通过这种方式，外部框架就能通过传入定制的 Wrapper 来覆盖掉默认的样式甚至文字内容。同时又不需要组件内部了解具体的方案，也不需要繁琐的判断。

## identifiers

很多组件都需要对外部传入的子组件进行位置的调整，或者根据数据来进行复制。例如 Tabs，通常会把内容包装在 Tabs.TabPane 中。在 lego 中统一将这样的内容包装在声明的 identifier 中。例如 Tabs:

```javascript
export const identifiers = {
  Pane() { return null }
}

export const render({ state, identifiers, children }) = {
  const paneChildren = children.find(child => child.type.__base === identifiers.Pane)
  const panes = state.list.map(/*根据数据复制 pane*/)
  return <div>{panes}</div>
}
```

## render

与 react 的 render 函数不同的是，lego 的 render 是个纯函数。它的第一参数应该包含 `state children instance listeners wrappers interceptors`。

## 总结