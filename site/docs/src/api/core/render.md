---
title: render
description: 基础教程
author: imink
group: CORE
index: [0, 0]
---

## Render
Render 是整个金蝉渲染的根节点组件。内部机制和 Redux Provider 差不多，在 context
提供了 stateTree 等"全局数据"。它有两种使用方式:
1. 接受 object 形式的 config。例如: `<Render components={{}} config={{}} stateTree={{}} />`
2. 传统的手动组件的方式。例如:
```js
  <Render>
    <Button bind="button1"/>
    <Button bind="button2"/>
  </Render>
```
手动模式下任何子组件都应该是一个已经使用 connect 链接过的 container。
无论哪种方式，Render 都支持受控和非受控两种形式。支持受控主要是因为内部实现了一个 fragment
机制，即把部分片段封装起来也变成一个金蝉组件，片段中也使用 Render。由于金蝉组件必须是受控组件，
所以 Render 必须实现受控模式。受控模式标记属性是 onChange，传入了 onChange 就会让其编程受控态。
Render 除了负责提供 context 外，剩下的工作主要是创建扁平树。当然，如果是第二种手动方式，扁平树
是用户自己创建的。

### 参数/props 
#### stateTree - 声明过的 stateTree 对象
#### appearance - 声明过的 appearance 对象
#### background - 包含了 utility 以及 job 的对象集合
#### config - 通过配置方式写的组件对象
#### components - 经过 connect 封装后的组件, 所有在 config 当中使用到的组件必须在这里提供
#### didMount - 组件加载完毕后运行的方法
#### onChange 用来判断当前 Render 是否受控

### 返回值
Cicada 程序的根节点组件

### 用法
```js

ReactDom.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={createBackground({
      utilities: {
        listener: listenerBackground,
        stateTree: stateTreeBackground,
      },
    }, stateTree)}
  >
  <Input getInitialState={() => ({ value: 'input' })}>
  </Render>, document.getElementById('root'),
```