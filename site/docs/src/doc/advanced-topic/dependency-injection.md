---
title: 控制反转和依赖注入
description: 基础教程
author: imink
group: ADVANCED
index: [3, 0]
---

```js
// a.js
export init() {
  return {
    register: function(args){},
    cancel: function(args){},
    run: this.run(args)
  }
}
// container.js
import A from 'a.js'
import B from 'b.js'
const A = A.init()
const instanceOfB = B.init()
const instanceOfA = A.register(instanceOfB)
```

a.js 的 register 需要参数，这就是[依赖注入（Dependency Injection）](https://en.wikipedia.org/wiki/Dependency_injection)的设计模式，其背后的思想是控制反转（Inverse of Control）。不论是 Utility 当中的 `validation.js` 还是 Job 当中的 `mapBackgroundToState.js`，其代码结构都保持高度的统一性，即返回一个对象，该对象具备了一系列方法，但是自己本身不会运行这些暴露的方法。只有在上一层，比如 `createBackground.js` 当中，这些对象的方法才会被调用。把对象的控制权交给第三方容器，第三方容器统一管理对象的创建和销毁。

## 控制反转的好处

如图所示，在没有第三方容器的情况下，对象 A 的 run 方法用到了 对象 B 的实例，如果对象 A 要继续运行，必须自己实例化对象B，或者引用对象 B的实例。同样的，对象 C 的 cancel 方法用到了对象 A 的实例，也必须创立或者引用对象 C。对象 A、C 在各自的方法都需要其他对象的参与，正常情况下，如果没有统一的容器来管理，那么对象 A、C 就会实例化其他对象，造成冗余（对象 B 被实例化2次）。如果这个时候，涉及到更多的对象，就会造成代码逻辑混乱，难以管理。如果抽象出一层第三方容器，来统一管理每个对象的依赖关系，由该容器来实例化每个对象，我们就可以通过对象引用的方式，方便地运行对象的方法。每个对象只是声明了自己的依赖，并未真正运行，而真正的控制权则交给了第三方容器。因而实现了具有依赖关系的对象之间的解耦。

## 在 Cicada 当中的应用
Cicada 源码中，这个容器就是 `connect`，每一个被 connect 封装后的组件，都完成了组件方法和属性的复写，有以下4个步骤：

* setupLifeCycle() // 处理注入的声明周期函数
* setupIntercepters() //  处理注入的 interceptor
* setupDefaultListeners() //  处理注入的事件
* registerToContext() //  注册组件状态，包括 background、appearance、stateTree 的注册

封装后的组件，依然可以无缝配合 React 框架来完成页面的渲染和声明周期的管理，但是具备了更多更负责的能力。
