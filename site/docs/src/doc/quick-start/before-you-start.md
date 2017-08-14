---
title: 开始之前
description: 基础教程
author: imink
index: [0, 1]
group: QUICK START  
---


Cicada.js 不是一个凭空制造的基于 React 的框架，虽然你完全可以按照 React 的写法去写 Cicada 程序，但是我们赋予了 Cicada 应对更复杂的应用场景的能力。

## React, Redux 以及 Mobx
在正式使用 Cicada 之前，我们建议你已经掌握了 React 的基本用法，包括组件的写法，state 和 props 的概念。
对于 [Redux](http://redux.js.org/)，我们希望你已经了解单向数据流的概念，以及全局 state tree 的优势和好处。
对于 [Mobx](https://github.com/mobxjs/mobx)，我们希望你可以了解 mobx 的[消息订阅者模式](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)，Cicada.js 也采用了消息订阅者模式来完成事件的监听和触发，我们也实现了精确定位和更新，同时最大程度的减少了额外的开销。

## JSX 语法 
[JSX](https://facebook.github.io/react/docs/introducing-jsx.html) 是 React 提出的一种基于 JavaScript 的语法，它能够混写 JS 和 HTML，灵活方便的实现一些复杂的页面结构。

## ES6 语法
项目基于 JavaScript ES2015 版本开发，我们建议使用 Babel 来编译 JSX 和 ES6 语法。