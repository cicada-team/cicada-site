---
title: 表单验证
description: 基础教程
author: imink
group: EXAMPLES
index: [2, 1]
---

## 在线编辑器

<div class='demo' id='demo-2' demo-name='helloWorld' mount-name='helloWorld'></div>

我们为 Cicada 独立开发了表单验证的扩展功能，以应对复杂的验证场景。在开始之前，我们需要了解 Cicada Render 的使用方法：
```js
// 声明全局状态树
const stateTree = applyStateTreeSubscriber(createStateTree)()
// 声明样式管理器
const appearance = createAppearance()
window.stateTree = stateTree

// 声明 background 扩展
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
  // 使用 Cicada Render
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={background}
  >
  // React Lego 组件
  ...
  </ Render>, document.getElementById('root')),
```

一个标准的 Cicada 程序包含了上面几个部分。接下来我们会根据 Cicada 提供的 Validation 扩展，处理常见的表单验证场景。

## 非空验证
```js
const validators = {
  notEmpty({ state }) {
    const isValid = state.value.trim() !== ''
    return {
      type: isValid ? 'success' : 'error',
      help: isValid ? '' : '不能为空',
    }
  }
}
...
<div>
  <h3>自校验</h3>
  <C.Input bind="name" getInitialState={() => ({ label: '姓名' })} validator={ { onChange: [{ fn: validators.notEmpty }] } } />
</div>
```
由于 Input 是受控组件，即组件的状态由外部引发改变。我们通过组件的默认事件 onChange 来判断是否当前输入框为空。注意到 `validator` 这个 prop 传入的数据结构。

再看 notEmpty 这个函数，state 作为默认参数可以直接访问。这里的 state 即为 Input 组件的状态树，它的完整结构如下
```json
```
同样的，notEmpty 返回的是发生改变的组件状态，Validation 扩展会判断当前状态是否发生改变，然后显示相应的判断结果。

对于用户而言，只需要关注验证的规则，而不需要关心验证的原理。

## 联合校验

```js
const validators = {
  notDotaAndLoL({ stateTree: innerStateTree }) {
  const isValid = !(innerStateTree.get('hobby1.value') === 'Dota' && innerStateTree.get('hobby2.value') === 'LOL')
  return {
    type: isValid ? 'success' : 'error',
    help: isValid ? '' : '不能同时喜欢 Dota 和 LOL',
  }
}
...
<div>
  <h3>联合校验</h3>
  <p>爱好一写Dota，爱好二写LOL就会出错</p>
  <C.Input bind="hobby1" getInitialState={() => ({ label: '爱好一' })} validator={{ onChange: [{ fn: validators.notDotaAndLoL, group: 'hobby' }] }} />
  <C.Input bind="hobby2" getInitialState={() => ({ label: '爱好二' })} validator={{ onChange: [{ fn: validators.notDotaAndLoL, group: 'hobby' }] }} />
</div>
```
由于我们可以通过 stateTree 获取任意组件的状态，我们可以通过关联2个组件的状态来实现联合校验。确保需要关联的组件具备同样的 validator，比如例子中的 notDotaAndLoL，同时确保 group 一致。TODO 

## 异步校验
```js
const validators = {
  notExist({ state }) {
    return new Promise((resolve) => {
      const isValid = state.value !== '万万没想到'
      setTimeout(() => {
        resolve({
          type: isValid ? 'success' : 'error',
          help: isValid ? '' : '数据库里已有',
        })
      }, 300)
    })
  },
}
...
<div>
  <h3>异步校验</h3>
  <p>输入 万万没想到 会出错</p>
  <C.Input bind="nickName" getInitialState={() => ({ label: '昵称' })} validator={{ onChange: [{ fn: validators.notExist }] }} />
</div>
```
notExist 直接返回一个 promise  交给后台 validation 使用。用户无需再定义处理异步的流程。

## 组件显隐

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
  <h3>隐藏部分</h3>
  <C.Checkbox getInitialState={() => ({ text: '点我显示下面Input框' })} bind="showAdvance" />
  <C.Input bind="advance" getInitialState={() => ({ label: '高级选项' })} visible={[({ stateTree: stateTreeUtil }) => {
    return stateTreeUtil.get('showAdvance.checked') === true
  }]} validator={{ onChange: [{ fn: validators.notEmpty }] }}
  />
</div>

```
这个例子当中，我们通过 visibility 这个 utility 扩展控制了输入框的显隐规则。visible 作为 props 被赋值到输入框组件上，visible 本身是一个数组结构，第一个元素返回了 true/false，来告知输入框组件是否需要显隐。我们通过 `stateTreeUtil.get('showAdvance.checked')` 拿到了勾选框的勾选状态，以此作为显隐规则。


## 重置
```js
...
<div>
  <C.Button getInitialState={() => ({ text: '重置' })} listeners={{ onClick: { fns: [{ fn({ validation }) { validation.reset('') } }] } }} />
</div>
```
validation 作为参数传入到 onClick 方法中，通过 `validation.reset('')` 我们重置了所有表单验证组件的状态。事实上，validation 作为 utility 扩展，自身维护了一份当前所有验证组件的状态，并提供了基本的数据操作例如 reset，get，merge 供用户使用。

## 源码
完整的代码请移步 `pages/form/` 下
