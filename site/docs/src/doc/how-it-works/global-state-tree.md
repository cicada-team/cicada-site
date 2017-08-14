---
title: 数据流和全局状态树
description: Nothing to see here
group: HOW IT WORKS
index: [1, 4]
---

如何管理网页的状态（包括 UI 状态以及逻辑数据）一直以来是很多前端框架非常关注的部分。React Flux 提出的单向数据流或者 Angular 以及 Vuejs 提出的双向绑定本质上也是为了更好的管理网页的状态。一个常见的例子是，用户点击 Check 勾选框，页面会展现新的组件。这里页面的 UI 状态和内部逻辑产生了联系，假如这个勾选框和页面上的另外一个勾选框相关联，只有同时满足这两个勾选框同时勾选，才能展现新的组件，那么我们就必须考虑到新的勾选框的状态。以此类推，这种涉及到多个组件状态的更新触发新的组件的显隐规则的场景是非常常见的。这种情况下，状态树必须全局地意识到每个组件状态的变化，才能保证彼此状态的关联性。所以 Cicada 采用了一个全局的状态树 stateTree 来统一管理页面每一个组件的状态变化，换句话说，每个组件的数据结构决定了全局状态树的结构。


## 如何保证简洁有效的状态树结构
我们既然让状态树和组件紧密关联，那么这个事先定义好的全局状态树的数据结构自然由 Cicada 引擎来定义和实现了。用户无需关心如何定义状态树，而只需要关注到组件与组件之间如何实现关联就可以了。这听起来似乎非常难懂，有人会问到如果连用户都不知道状态树的数据结构，那又怎么能够触发相应的变化呢？这要归功于 React Lego 的组件规范。符合 [React Lego 规范](https://github.com/cicada-team/react-lego)的组件在声明以及渲染的时候，保证了一致的数据结构。框架层面的引擎能够完全感知组件的每一个状态属性和暴露的监听事件，并通过状态树来初始化和管理。了解 React Lego 规范的用户，也就知道如何通过框架提供的 API 来实现组件状态的更新和变化。

## 状态树如何实现更新和变化的
状态树 stateTree 在代码当中，通过 `
 const stateTree = applyStateTreeSubscriber(createStateTree)()
` 来声明，这是一个高阶函数，createStateTree() 的返回结果作为参数被 applyStateTreeSubscriber 来执行。

我们先看 createStateTree() 这个方法。它主要完成了2个操作：
1. 提供一个树状的数据保存功能。这个树状的数据理论上应该和 Render 渲染的组件数据结构保持一致。但是这个保障是需要由组件和正确的用户代码来保障，也就是 [React Lego 规范]()
2. 提供深度合并，自动修复，重置等数据功能。它在其中注册了组件渲染时的初始值(这个值里包含了用户设置的值)和组件的真实初始值，所以能提供重置功能。

第二个操作实现了类似数据库的基本操作方法，为用户省下大量数据处理的操作，比如 getStateById(), 通过组件 ID 来获取组件状态。我们在组件初始化的时候，为组件赋予了一个全局唯一标识符 unique state id，来关联组件和与之对应的状态数据。

最后，createStateTree() 会返回一个对象，这个对象包含了具备数据库基本操作方法以及一个注册函数。到此为止，这个全局状态树只是具备了数据的储存和读写功能，依然不具备最关键的事件监听机制。我们回过头来再看`
 const stateTree = applyStateTreeSubscriber(createStateTree)()
`，这里的 applyStateTreeSubscriber 实际上封装了 createStateTree 返回的对象，使最终的状态树具备了了精确监听组件的的能力。和绝大多数前端框架所具备的数据监听能力一样，Cicada 内部实现了一个消息订阅者模式，被应用在了 applyStateTreeSubscriber 里面。每当状态树发生数据操作的时候（比如 set，merge，reset 等），状态树会首先检查和当前状态相关联的事件（比如某个组件的显隐），如果找到相应的事件，就先运行相应事件。那么 Cicada 是如何知道某个状态和关联事件呢：通过状态树的注册函数。

要注意到整个` const stateTree = applyStateTreeSubscriber(createStateTree)() ` 仅仅是状态树的声明，使状态树具备了以上这些能力。真正实现把组件和状态树关联起来的，是在渲染函数 Render 里完成的。

## 通过数据路径 statePath 获取数据
我们知道存在一个全局的树型数据，保存了所有组件的数据，数据路径 statePath 就是用来标识当前数据是在全局状态树上的哪一个位置。每个 React Lego 组件都有 bind 的属性，用来唯一标示当前组件，例如 `<Input bind="userInput" />`，那么当前 Input 组件的所有数据/状态可以通过 `stateTree.get('userInput')` 获取，Input 输入框的值可以通过 `stateTree.get(userInput.value)` 获取。如果用户没有写 bind，Cicada 会默认给用户生成唯一标识符。

需要注意的是， 当组件写在 Table/Collapse/Repeat/Tabs 等会根据数据进行循环渲染的组件下时, 这些组件会产生一个 Scope， 使得它下面所有组件的数据都是绑在这个组件的数据的某一个字段上，而不再是 stateTree 的根上。例如
```js
<Table bind='userTable' >
  <Table.Column>
    <Input bind='userInput' />
  </ Table.Column>
</ Table>
```
那么 Input 组件的 statePath 为 `userTable.list.0.userInput`, 其中0是 Input 组件的顺序，我们在 EXAMPLE 中会有更详细的解释，以及具体 Scope 该如何使用。