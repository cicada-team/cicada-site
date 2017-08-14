---
title: Cicada 的扩展机制
author: 
index: [1, 5]
group: HOW IT WORKS
---
## 概念和背景

在框架的开发过程中，我们对常见的业务场景总结和抽象，提炼出了两个概念：Utility 和 Job。Utility 是工具类插件，让用户在开发的时候，可以借助某类 Utility 来更有效的专注于业务功能的开发，常见的工具类插件，比如验证模块 validation，提供了一整套方法来满足不同场景的需求，包括但不限于：

* 支持多个组件联合校验
* 支持异步校验
* 支持校验数据的重置

而 Job 是任务类插件，支持监听依赖，并且根据依赖变化自动执行任务。一旦使用了 Job，用户只需在最开始定义依赖，剩下的就交给了框架，去收集依赖，监听依赖，最后根据变化的结果，渲染页面。一个常见的使用场景是组件的显隐规则。我们只要在组件的 prop 上加入 
`visible={() => {return validation.isValid('xxx') }}`，组件的显隐与否就直接与表单验证的结果形成了强关联。只有验证通过，组件才会显示。


同样的我们之前介绍过 stateTree 和 appearance 的概念，Utility 和 Job 可以在内部操作 stateTree 或者 appearance，随时获取和操作组件状态以及修改组件的样式。

## Cicada 当中的 Uitilities 和 Jobs 
我们在源码中，已经提供了如下的工具类和任务类插件，其中 Utility 包括：
* validation 提供了一系列表单验证的方法
* appearance 控制组件的显隐
* business 用来存储和组件状态无关的数据，通常是业务相关的数据，可以脱离组件存在，具备数据的增删减改操作
* form 只提供了对表单组件数据的快速集合操作，和 validation 不同，内部不保存其他状态
* listener 通用型的事件监听容器，用户自定义的事件和组件的默认事件都在这里被记录，具有依赖收集和监听的功能
* stateTree 是全局 stateTree 的代理，用来配合 mapBackgroundToState

Job 包括：
* interpolation 用于子组件的替换
* mapBackgroundToState 自动修改组件状态
* visibility 自动运行组件的显隐规则




## 使用 Utility 
Utility 是为了解决某个具体问题而存在的扩展，我们以 Validation Utility 为例，看它是如何实现表单验证的(源码在 pages/form/index.js)

```js
const validators = {
  notEmpty({ state }) {
    const isValid = state.value.trim() !== ''
    return {
      type: isValid ? 'success' : 'error',
      help: isValid ? '' : '不能为空',
    }
  },
}
...

<div>
  <h3>自校验</h3>
  <C.Input bind="name" getInitialState={() => ({ label: '姓名' })} validator={ { onChange: [{ fn: validators.notEmpty }] } } />
</div>
```
如上，这是一个验证输入框非空的例子。首先我们看到 Input 组件包含了一个 validator 的 prop，这是我们事先定义好的 prop，在初始化组件的时候，如果发现存在一个 validator prop，Cicada 就意识到这是一个 Validation Utility，那么相应的，就会采取 Validation 的扩展机制来处理当前组件。

我们看到 validator prop 实际上是一个 JS 对象，key 为 onChange（这是 Input 自带的监听事件），value 为一个函数对象数组，数组当中的第一个对象 key 为 fn，value 是一个用户定义的纯函数，用来判断输入框是否为空。之所以写成这种形式，是考虑到了表单组件存在多个验证规则的情况，比如同时非空和字符串长度限制。

在了解了组件的写法规则后我们来看用户定义的纯函数 notEmpty()，参数 state 是当前组件的状态，state.value 即为 Input 输入框的当前值，经过逻辑判断后，notEmpty() 返回了一个纯对象，该对象的结构与组件的状态保持一致（即输入框组件本身也具有 type，help 的 keys）。

当用户按照 Utility 暴露的接口写好组件之后，就不需要关心剩下的操作了。被注册的 Utility 会自动判断用户输入是否为空，然后报错或者提示成功。
 


## 使用 Job
同 Utility 类似，Job 也是自动运行的扩展，但和 Utility 不同的是，Job 监听的依赖可以是 Utility 本身。仍然以表单验证为例，我们看下 Job 是如何工作的。

```js
function looseValidation({ validation }) {
  const isValid = validation.isValid('', true)
  return { disabled: !isValid }
}

<C.Button getInitialState={() => ({ text: '弱校验', type: 'primary', disabled: false })} mapBackgroundToState={[looseValidation]} />
```

上面是一个弱校验的案例， `mapBackgroundToState` 是我们引入的一个 Job 扩展，顾名思义，它通过监听 Background 的变化，最终返回相应的组件状态。同 Utility 不同，在 Button 组件中，prop mapBackgroundToState 是一个函数数组，该数组的第一个元素是用户定义的 looseValidation 函数。looseValidation() 接受 Utility validation 作为参数，validation 是实例化的 Utility，它存在一个 isValid 的属性来判断是否当前所有表单组件验证通过。假设通过，则返回对象 {disable: false}，该对象与 Button 组件的状态一致，同时 Button 组件的 disable 值也被设置为了 false。

可以看到，Job 是根据监听某一个依赖而自动运行的函数。这个依赖是我们添加的 Utility 的实例化对象。

## 探究 Utility 和 Job 内部
Utility 和 Job 扩展具备了统一的数据结构，我们深入源码来探讨它们的具体作用。依然以 pages/validation/index.js 为例，直接跳到它的返回值。
```js
export function initialize() {
  ...
  return {
    register() {},
    collect: collector.collect,
    extract: collector.extract,
    subscribe: (...arg) => listeners.insert(...arg),
  }
}
export function initialize() {}
export function test() {}
export function check({validation}) {}
```
每一个 Utility 扩展都提供了如上的接口：
* register() 用来注册该 Utility，把组件和该 Utility 关联起来
* collect/extract 提供依赖计算的支持
* subscribe() 用来添加依赖
* initialize() 初始化独立的数据结构和实例，保证 Utility 内部能够保存每个组件的验证状态和验证结果
* test() 用来判断当前组件状态是否发生变化
* check() 用来判断当前组件是否需要启动相应的 Utility 扩展

再来看 Job 扩展，以 mapBackgroundToState 为例。
```js
export function initialize() {
  ...
  return {
    register,
    run,
    handle
  }
}

export function check({mapBackgroundToState}) {}
```
每个 Job 扩展都提供了如上的接口：
* register() 注册该 Job 扩展
* run() 运行所有注册的依赖
* handle() 更新状态树
* check() 用来判断当前组件是否需要启动相应的 Job 扩展

需要注意的是，不论 Utility 或者 Job 扩展，只有 check 返回为 true 的时候，才会调用相应扩展，进行初始化。所以如果观察之前的组件，我们会发现组件上的 prop 名称就是 check 里面的参数，比如 validation 和 mapBackgroundToState。


## Background  
我们可以理解 Background 是作为 Utility 和 Job 的容器而存在的。
Utility 和 Job 暴露了统一的接口供 Background 使用。通过阅读 `createBackground.js` 源码可以发现，

1. 它对外提供了统一的 register 函数，这个函数是 connect 中对每个组件自动调用的。在 register 函数中在调用相关 Utility 和 Job 的 register，这样就建立了 Background 和组件的联系。
2. 提供了统一的接口来实现 Utility 和 Job 的 cancel register 等操作。
3. 当 Background 发生变化的时候，调用用户写的 mapBackgroundToState，更新状态树。

总的来说，就是 Background 确保了 Utility 和 Job 与组件之间的联系。


``` js
const background = createBackground({
  utilities: {
    validation: validationBackground,
    stateTree: stateTreeBackground,
    appearance: appearanceBackground,
    listener: listenerBackground,
  },
  jobs: {
    mapBackgroundToState: mapBackgroundToStateJob,
    visible: visibleJob,
  },
}, stateTree, appearance)

ReactDom.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={background}
  >
  <Demo />
  </Render>,
  document.getElementById('root')
)
```



## 更多
如果觉得 Cicada 自带的 Background 插件仍不能满足需求，你可以点击[这里]()了解如何开发自定义 Background 插件
