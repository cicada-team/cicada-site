---
title: 如何开发自定义插件
description: 基础教程
author: imink
group: ADVANCED
index: [3, 1]
---

我们已经为 Cicada 提供了自建的一些 Background 插件，既可以作为工具方便用户开发应用，也可以作为案例，便于开发者根据需求开发自己的 Background 插件。整个 Background 分为2种类型，Utility 和 Job。接下来的教程我们将告诉你如何开发自己的 Background 插件。

## Background Utility

### 代码结构
一个 Background Utility 必须暴露以下2个方法：
* initialize 用来初始化 Utility，被上层 background 调用 
* check 用来确认当前组件是否需要 Cicada 提供对 Utility 的支持，其返回结果是 boolean 类型

#### initialize 方法
initialize 是 Utility 实例化的方法，每一个 Utility 的 initialize 方法都有局部变量来保存 stateId 到 Utility 方法的映射关系。这样方便通过 stateId 来获取对应组件的 Utility 方法。此外，register 方法（可选）也可以写在 initialize 当中，方便 Utility 直接获取组件的状态（register 方法的参数和组件自身相关），Utility 如果存在 register 函数，则该函数返回一个 cancelRegister 的函数，用来做一些变量的销毁和清空操作。



## Background Job

我们之前提到过，Background Job 可以理解为根据 Background Utility 自动触发的动作，是用户间接操作导致触发，比如用户点击了勾选框，从而间接导致输入框出现。所以通常来说，Background Job 用来处理更改组件状态（比如显隐，文本显示，样式变化）。目前 Cicada 已经提供的有 visibility （控制显隐）、mapBackgroundToState（更改组件状态）以及 interpolation （控制文本显示）。当然还有更多的使用场景待开发，比如操作日志记录，用户操作收集。接下来的教程会告诉你如何开发一个 Background Job。

### 代码结构

一个 Background Job 应该暴露如下方法（不可或缺）：
* `initialize` 用来初始化当前 Job，同时返回三个方法供外层的 BackgroundContainer 调用：`register`, `run`, `handle`
* `check` 用来确认当前组件是否需要 Cicada 提供对 Job 的支持，其返回结果应该是 boolean 类型，需要注意的是 `check` 方法的参数即 Job 的名称，例如如果我们需要某个组件使用显影的 Job，就需要在组件的 prop 上添加对应的属性，通常是函数数组。

```js
<Input visible={[({ stateTree }) => { return stateTree.get('other.flag')}]} ...otherProps />
```

### initialize 方法
我们重点关注 Job 的初始化方法， 它包含了一个局部变量 stateIdToXXXJob 用来保存 stateId 和 Job 方法的映射关系，同时返回了3个函数：`register`、`run`、`handle`。
initialize 方法接受的参数为 Backgroun Utility 的实例集合 utilInstances（比如 business，validation）以及 stateTree 和 appearance。这些参数来自上层的 BackgroundContainer。

#### register 
register 用来初始化之前提到的局部变量 stateIdToXXXJob，对于一个 Cicada 应用，我们通常只有一个实例化的 Job 或者 Utility，而它们与组件之间的联系是通过 stateId 完成的。同样以 visible Job 为例，
```js
function register(stateId, { visible = [] }) {
  stateIdToVisibleFns[stateId] = visible
}
```
register 接受2个参数，均来自组件本身，`stateIdToVisibleFns` 只是存贮了 visible 方法而已。真正的运行在 run 函数

#### run
run 只接受一个参数 stateId，用来找到对应的 Job 函数以及组件状态，然后运行 Job 函数，返回处理结果。

#### handle
handle 接受2个参数，分别是 stateId 和 result，result 即 run 函数的运行结果，这里我们可以完成组件的状态更新，通过比如 stateTree 或者 appearance 的 set 方法。

## 小结