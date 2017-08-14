---
title: Todo List
description: 基础教程
author: imink
group: EXAMPLES
index: [2, 5]
---

我们接下来通过一个简单的 todo 应用来了解如何实现组件的动态创建，以及如何利用 appearance 和 visibility job 来控制筛选和样式的变化。


## 入口文件 index.js

加载相关组件，注意这里有我们自己写好的复合组件，TodoList 和 Todo

```js
const C = mapValues({ Input, Checkbox, TodoList, Todo, Button }, connect)

const background = createBackground({
  utilities: {
    validation: validationBackground,
    stateTree: stateTreeBackground,
    appearance: appearanceBackground,
    listener: listenerBackground,
    business: businessBackground,
  },
  jobs: {
    mapBackgroundToState: mapBackgroundToStateJob,
    visible: visibleJob,
  },
}, stateTree, appearance)

``` 

Unique key 用作循环生成的子组件的 key

```js
let globalKey = 0

function createUniqueKey() {
  return String(globalKey++)
}
```

接下来是一系列 stateTree 和 business 操作的方法

```js
// 新增一个 todo 
function addOne({ stateTree: innerStateTree, business }) {
  // reset showFlag
  business.set('showFlag', 'All')
  const items = innerStateTree.get('todoList.items').slice()
  const key = createUniqueKey()
  const todoInput = stateTree.get('todoInput.value')
  items.push({ key, todo: { text: todoInput } })
  stateTree.merge('todoList.items', items)
}
// 完成某个 todo，注意这里用到了 merge，局部修改组件的某个属性
function markCompleted({ state, stateTree: innerStateTree, statePath }) {
  innerStateTree.merge(statePath, { completed: state.completed !== true })
}
// todo 的显隐规则，判断全局的 showFlag
function showVisible({ state, business }) {
  const flag = business.get('showFlag')
  if (flag === 'All') return true
  if (flag === 'Completed') {
    if (state.completed === true) return true
  }
  if (flag === 'NotCompleted') {
    if (state.completed === false) return true
  }
  return false
}
// 标记所有的 todo 已完成
function toggleAllCompleted({ stateTree: innerStateTree, business }) {
  const items = innerStateTree.get('todoList.items').slice()
  const newItems = items.map((item) => {
    const todo = item.todo
    todo.completed = true
    return {
      todo,
      key: item.key,
    }
  })
  innerStateTree.merge('todoList.items', newItems)
  // reset showFlag
  business.set('showFlag', 'All')
}
// 下面三个方法分别对应显隐按钮
function showCompleted({ business }) {
  business.set('showFlag', 'Completed')
}
function showNotCompleted({ business }) {
  business.set('showFlag', 'NotCompleted')
}

function showAll({ business }) {
  business.set('showFlag', 'All')
}

```

接下来就是整个页面的结构，首先一个输入框用来输入 todo，下方是 todo list 展示区，最后一排是操作区。

```js
ReactDom.render(
  <Render
    stateTree={stateTree}
    appearance={appearance}
    background={background}
  >
    <div>
      <C.Input bind="todoInput" getInitialState={() => ({ label: '任务' })} />
      <C.Button getInitialState={() => ({ text: '添加' })} listeners={ { onClick: { fns: [{ fn: addOne }] } } } />
      <C.TodoList bind="todoList">
        <C.Todo
          bind="todo"
          getInitialState={() => ({
            text: 'task',
            completed: false,
          })}
          listeners={ {
            onTodoClick: {
              fns: [{
                fn: markCompleted,
              }],
            },
          } }
          visible={[showVisible]}
        />
      </C.TodoList>
      <C.Button getInitialState={() => ({ text: '已完成' })} listeners={ { onClick: { fns: [{ fn: showCompleted }] } } } />
      <C.Button getInitialState={() => ({ text: '未完成' })} listeners={ { onClick: { fns: [{ fn: showNotCompleted }] } } } />
      <C.Button getInitialState={() => ({ text: '全部' })} listeners={ { onClick: { fns: [{ fn: showAll }] } } } />
      <C.Button bind="show" getInitialState={() => ({ text: '标记全部已完成' })} listeners={ { onClick: { fns: [{ fn: toggleAllCompleted }] } } } />
    </div>
  </Render>,
  document.getElementById('root'),
)
```

### business 和 stateTree
有人会发现，上面的代码中，我们有时候会用到 stateTree，有时候会用到 business。在 Cicada 中，这两个状态容器都具备了消息订阅的功能，但是 stateTree 只能存储组件的状态，对于非组件状态/非 UI 数据，例如逻辑数据或者业务相关的数据，我们就需要用到了 business 来承担原本是 stateTree 的工作。这么做是为了保证 stateTree 数据的纯洁度，避免和业务数据产生污染。

## Scope 的应用 - TodoList 组件

直接看 TodoList/index.js 的 render 方法，这里我们用到了 Cicada 自带的 Scope 组件，用来子组件动态创建， Scope 组件的属性 relativeChildStatePath 定义了如何对组件的 statePath 命名，子组件通过 `React.cloneElement` 来生成。 

```js
import Scope from '@cicada/render/lib/component/Scope'
...
export function render({ state, children }) {
  const style = {
    display: state.inline ? 'inline-block' : 'block',
  }

  return (
    <div className="repeat-wrapper">
      {state.items.map((_, index) => (
        <Scope relativeChildStatePath={`items.${index}`} key={index}>
          <div className="repeat-item" style={style}>
            {Children.map(children, child => React.cloneElement(child, {}))}
          </div>
        </Scope>
      ))}
    </div>
  )
}
```

我们再回过头来看 `addOne()` 这个方法, 首先拿到所有组件items，再 push 新的 todo 到 items。注意我们这里用到了 merge 方法，因为我们只是新增了 todo 的属性，其他属性例如 completed 会被自动添加。

```js
// 新增一个 todo 
function addOne({ stateTree: innerStateTree, business }) {
  // reset showFlag
  business.set('showFlag', 'All')
  const items = innerStateTree.get('todoList.items').slice()
  const key = createUniqueKey()
  const todoInput = stateTree.get('todoInput.value')
  items.push({ key, todo: { text: todoInput } })
  stateTree.merge('todoList.items', items)
}
```


## Todo 组件

Todo 组件就相对简单了。只需要将父级传过来的 prop 展示出来就可以。加上一些逻辑判断，比如 text decoration。需要注意的是，不要忘记定义默认值。

```js
const Todo = ({ onTodoClick, completed, text }) => (
  <div
    onClick={onTodoClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none',
    }}
  >
    {text}
  </div>
)
```

