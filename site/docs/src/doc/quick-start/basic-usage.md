---
title: 基本使用方法
description: 基础教程
author: imink
index: [0, 3]
group: QUICK START  
---


## Demo

<div class='demo' id='demo-1' demo-name='helloWorldConfig' mount-name='helloWorldConfig'></div>

<div class='demo' id='demo-2' demo-name='helloWorldDefault' mount-name='helloWorldDefault'></div>

## 传统组件写法 VS 配置JSON的方式撰写组件
如上 Demo，我们提供了2种方式去打印用户输入，一种是传统的方式写组件，比如 `export default class Component extend React.Component {}` 或者 `const MyComp = () => (<div>MyComp</div>)`，第二种为 Cicada 特有，采用 JavaScript 对象的方式写组件。我们知道，一个 HTML 页面是由树型 DOM 组成的。对于一个有经验的前端开发者，我们更喜欢手动编写页面的逻辑和样式，包括（HTML tag 的嵌套，增加监听事件），因为开发者了解具体每个组件或者说 HTML tag 的用法。而对于非前端开发者，去了解每一个组件或者 tag 的用法的成本是很高的，用户会倾向于所见即所得的方式去构建页面，对于简单的页面，这实现起来非常简单，但是对于复杂页面（不仅仅是展示页面，同时也需要一定的交互能力和数据操作能力），更具灵活性的配置方式会更受用户青睐。

一个典型的例子如下，我们定义了一个 Button 组件：
```json
{
  type: 'div',
  children: [{
    type: 'Button',
    getInitialState: () => ({
      text: '测试按钮'
    }）,
    children: []
  }]
}
```


 ### config
config是一个普通的js对象，页面组件的每一项功能都对应一项配置，下面讲解config的结构。
```javascript
{
  type: 'div',
  children: []
}
```
最简单的config结构如上所示，type代表组件类型，children表示这个组件的孩子节点，也就是这个组件的子组件，页面通过以div组件为根节点形成一颗组件树。
```javascript
{
  type: 'div',
  children: [{
    type: 'Button',
    children: []
  }]
}
```
如上所示，div下面有个Button组件，这样递归的方式就可以形成一颗完整的组件树，其中type可以是我们提供的任何组件，这里就是组件名。
```javascript
{
  type: 'div',
  children: [{
    type: 'Button',
    getInitialState: () => ({
      text: '测试按钮'
    }),
    children: []
  }]
}
```
如上所示，组件的属性配置就是在一个props对象上面，直接配置即可，没有bind值的是在props上配置，如果组件有bind值，则是在initialState上配置，如下所示
```javascript
{
  type: 'div',
  children: [{
    type: 'Button',
    initialState: {
      text: '测试按钮'
    },
    bind: 'btn',
    children: []
  }]
}
```
组件的事件配置如下所示
```javascript
{
  type: 'div',
  children: [{
    type: 'Button',
    initialState: {
      text: '测试按钮'
    },
    listeners: {
      onClick: {
        fns: [{
          fn({ store }) {
            console.log(store)
          }
        }]
      }
    },
    bind: 'btn',
    children: []
  }]
}
```
组件事件配置都在listeners配置项里，onClick是这个组件支持的事件类型，fns代表组件绑定的事件响应逻辑数组，因为能够绑定多个逻辑，所以这里是个数组，多个逻辑按照数组顺序串行执行。每个数组元素是个带有fn键的对象，其中fn是个函数，表示事件触发执行的真正逻辑

### 写法不同，但本质相同
关于用 config 配置的方式写组件的原因，我们会在[这里]()具体说明。但是就具体实现的效果，其实两种方式都可以实现同样的页面。你会发现，可能你更倾向使用传统的方式，因为写具有嵌套的配置 config 没有默认写法直观，代码量也更多些。接下来，本文不会继续讨论关于这两种写法的探究，而是重点介绍，Cicada 究竟能做什么，或者说，擅长做什么。
## 添加监听事件
 


## 表单验证

## 控制组件显影
组件的显影和组件的数据操作完全不同。数据操作逻辑是主动式的代码, 通过 stateTree.set 来进行设置。显影的逻辑是被动式的, 根据数据来 return true 或者 false, 由框架自动刷新。 
### 设计原因
* 增强代码可维护性
大部分显隐场景都是联动状态, 比如 select 选中了某个选项, 下面的另一个组件就隐藏或者显示。试想如果我们的代码是主动式的, 在 select 的 onChange 事件中去主动设置下面组件的显隐, 当我们将业务转交给其他人, 或者很久之后自己再来维护个页面而忘记了这个逻辑的时候。我们要一个一个逻辑去找看哪个里面触发了显隐。 而且还要立即其中的逻辑代码, 才能知道为什么要显示或者隐藏。
相反,用被动式的逻辑, 我们可以很肯定的直接找到显隐组件的显隐逻辑。可以很直观的了解到这个组件在什么样的数据下就显示或者隐藏。绝大部分情况下和我们的业务逻辑也是贴合的。
* 更易于使用组合显隐规则
试想一个组件的显隐是由多个组件的数据控制的, 那么用主动式的代码我们需要在相关组件的 onChange 事件中都去控制该组件。而用被动式 的规则则始终只用关注数据, 逻辑写在该组件中就够了。
### 使用
Cicada 提供了 visibility 的 job 来根据用户需求自动实现显影，只要在组件上加入 visible 的属性，通过判断返回 true/false 实现显影。也就是说，我们可以在 visible 属性加入含有 stateTree 的逻辑代码，就可以和页面的其他组件产生联系。从而实现复杂的显影规则。具体可以参考 EXAMPLE 当中的。。。
