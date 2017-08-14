---
title: '路由'
description: 基础教程
author: imink
group: EXAMPLES
index: [2, 1]
---

Cicada 支持配合使用 [react-router-dom](https://github.com/ReactTraining/react-router) 来完成路由操作。
我们推荐使用 browserRouter 作为默认的 Router，以便完全利用到 HTML5 的 history API。
需要注意的是，Cicada 的 Render 组件需要嵌套在 Router 组件内部。


## 使用

```js
import {
  HashRouter as Router,
  Route,
  Link,
} from 'react-router-dom'
...
ReactDom.render(
  <Router>
    <Render
      stateTree={stateTree}
      appearance={appearance}
      background={createBackground({}, stateTree, appearance)}
    >
      <div>
        <ul>
          <li><Link to="/">Input</Link></li>
          <li><Link to="/button">Button</Link></li>
        </ul>
        <hr />
        <Route exact path="/" component={Input} />
        <Route path="/button" component={Button} />
      </div>
    </Render>
  </Router>,
    document.getElementById('root'),
)

```