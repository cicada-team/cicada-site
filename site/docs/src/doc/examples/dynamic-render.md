---
title: 动态渲染
description: 基础教程
author: imink
group: EXAMPLES
index: [2, 3]
---


Cicada 的动态渲染是针对通过 config 配置方式写的组件而言的。由于所有配置组件本质上都是一个 JavaScript 对象，只是描述了组件的内部结构和属性，不具备任何渲染的能力。必须要存在一种方法能够检测到配置组件中潜在的新的组件。例如用户想在一个点击一个按钮之后，生成一个新的输入框，如果是配置组件，会写成下面这种形式。

```js
const config = {
  children: [{
    type: 'Button',
    getInitialState: () => ({
      text: '1 click to render a dynamic Input',
    }),
    listeners: {
      onClick: {
        fns: [{
          fn({ stateTree }) {
            stateTree.merge('dynamic.config', { type: 'Input' })
          },
        }],
      },
    },
  }, {
    type: 'DynamicRender',
    bind: 'dynamic',
  }],
}
```

`DynamicRender` 是我们定义好的动态渲染组件，专门用来处理不确定的组件变化。`stateTree.merge('dynamic.config', { type: 'Input' }` 这里用到了 merge 操作，会在 bind 为 dynamic 的组件上生成输入框。由于 config 是用来定义组件结构的，所有 config 当中一旦定义了新组件，就会对应的生成改组件。

我们再看看 DynamicRender 是如何定义的。

```js
import createDynamicRender from '@cicada/render/lib/createDynamicRender'
...
const DynamicRender = connect(createDynamicRender(
  applyStateTreeSubscriber(createStateTree),
  createAppearance,
  createBackground,
  backgroundDef,
), 'DynamicRender')
```
经过 `createDynamicRender` 定义的组件是不具有展示效果的组件，同理，经过 connect 封装后，依然是一个非展示性的组件。我们可以把 dynamicRender 理解成用来生成组件的组件。

