---
title: convertFragment
description: 基础教程
author: imink
group: CORE
index: [0, 999]
---

## convertFragment(fragment, ...args)
用于将用户自定义的 config 对象转化成 Cicada 组件, 即复合组件

### 参数/props 
#### fragment - 用户自定义的 config 对象

`...args` 包括
#### createStateTree
#### createAppearance
#### createBackground
#### backgroundDef
#### components

### 返回值
返回一个符合 React Lego 规范的组件

### 用法
```js

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
```
更多参见 /pages/fragment/index.js