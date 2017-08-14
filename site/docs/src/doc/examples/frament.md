---
title: 复合组件
description: 基础教程
author: imink
group: EXAMPLES
index: [2, 5]
---

## 什么是复合组件
符合 React Lego 规范的组件，通常是复用性非常高的常规组件，比如输入框，按钮，日期组件。我们把常用的功能写成组件之后，尽可能的维护一个数量在合理范围内的组件库，方便随时调用。比如构建在 antdesign 组件之上的 [react lego antd](https://github.com/cicada-team/react-lego-antd)

但是随着使用场景的增多，我们会遇到单一基础组件无法处理的场景，比如一个模态框需要按钮和输入框的配合使用。这就涉及到了多个基础组件。用户会更希望组件提供者尽可能多的提供多种多样的组件，供他们直接使用。但是对于组件开发者来说，未必是件好事，之前一直依赖的组件最小够用原则就无法遵循。以至于将来组件库会成千上百的增加。

如果说，我们定义规范，降低组件的开发难度，然后让用户自己去开发这样的组件，效率会高很多。这就是复合组件的初衷：
复合组件提供由一些基础组件封装成一个高级组件的能力，用户开发的优秀的复合组件，也会被其他用户使用。

备注：本文的组件写法均为 config 配置方式。

## 使用方法
源码在 pages/fragment/index.js

```js
import convertFragment from '@cicada/render/lib/convertFragment'

const fragments = {
  FullName: {
    linkState: {
      name: {
        from({ stateTree }) {
          return `${stateTree.get('first.value', '')}-${stateTree.get('second.value', '')}`
        },
        to({ value, stateTree }) {
          const [firstValue, secondValue] = value.split('-')
          stateTree.merge('first', { value: firstValue })
          stateTree.merge('second', { value: secondValue })
        },
        stateType: 'string',
        defaultValue: 'Jane-Doe',
      },
    },
    exposeListener: {
      onFirstNameChange: {
        source: 'children.0',
        listener: 'onChange',
      },
    },
    didMount() {
      console.log('component did mount')
    },
    getInitialState: () => ({
      first: {
        value: 'defaultFirst',
      },
      second: {
        value: 'defaultSecond',
      },
    }),
    config: {
      children: [{
        type: 'Input',
        bind: 'first',
        getInitialState: () => ({
          label: 'first name',
        }),
      }, {
        type: 'Input',
        bind: 'second',
        getInitialState: () => ({
          label: 'second name',
        }),
      }],
    },
  },
}

const baseComponents = mapValues({ Input, Button }, connect)
const fragmentComponents = mapValues(fragments,
  (fragment, name) => connect(
    convertFragment(
      fragment,
      applyStateTreeSubscriber(createStateTree),
      createAppearance,
      createBackground,
      backgroundDef,
    ), name,
  ),
)

ReactDom.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    components={{ ...baseComponents, ...fragmentComponents }}
    background={createBackground(backgroundDef, stateTree, appearance)}
    config={config}
  />,
  document.getElementById('root'),
)
```
如上，我们会发现复合组件的结构和普通组件结构不同，多了 linkState 和 exposedListener 两个属性。

### linkState
```js
const fragment = FullName: {
  linkState: {
    name: {
      from({ stateTree }) {
        return `${stateTree.get('first.value', '')}-${stateTree.get('second.value', '')}`
      },
      to({ value, stateTree }) {
        const [firstValue, secondValue] = value.split('-')
        stateTree.merge('first', { value: firstValue })
        stateTree.merge('second', { value: secondValue })
      },
      stateType: 'string',
      defaultValue: 'Jane-Doe',
    },
  },
```
linkState 是用来完成组件状态映射的。通常我们需要将 m 个基础组件的属性通过映射关系，最终只暴露出 n < m 个属性，这里面的映射关系就是在 linkState 里面完成的。`name` 里面包含了 `from` 和 `to` 两个函数，其中 `from` 代表内部映射属性到外部属性，如图例子，我们把 first name 和 last name 组合在一起。 `to` 代表外部属性映射到内部属性，我们把 full name 拆分成 first name 和 last name。其中暴露到外部的属性是 string 类型，默认值为 Jane-Doe。

### exposedListener
```js
exposeListener: {
  onFirstNameChange: {
    source: 'children.0',
    listener: 'onChange',
  },
},
```
`exposedListener` 是复合组件唯一暴露的监听事件，你可以添加多个监听事件实现更多交互。如例所示，当前组件下暴露了一个 onChange 事件 `onFirstNameChange`，其中包含了2个属性：`source` 和 `listener`，source 指的是原基础组件，这里的 children.0 就是该组件下的第一个输入框组件，listener 代表该输入框组件的监听事件 onChange。

### 其他属性
复合组件的其他属性和写一般组件一样，比如 config 用来定义组件的结构，getInitialState 用来获取初始状态。

### 作为 component 传入 Render 函数
复合组件和其他基础组件一样，也需要经过 conect 封装才能被 Render 函数正常使用。但在此之前，我们需要调用 createFragment 来封装写好的复合组件。