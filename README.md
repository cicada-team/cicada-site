# APP 目录结构
```bash
├── LICENSE
├── README.md
├── devtool
├── package.json
├── public
├── site
│   ├── antd.min.css
│   ├── components // 官网的声明式组件, 采用 react-lego 规范编写
│   │   ├── Doc
│   │   ├── Footer
│   │   ├── Header
│   │   ├── Homepage
│   │   └── SnippetPlayground // 给用户提供所见即所得的 widget 平台，即可体会 cicada engine 特性
│   ├── config // 相关配置文件
│   ├── docs // 文档页在此编写，output 为编译后的 json 格式，用来作为 props 传给 components/Docs
│   │   ├── index.js
│   │   ├── output
│   │   ├── parser.js
│   │   └── util.js
│   ├── form // engine 用例代码
│   │   ├── Button
│   │   ├── Checkbox
│   │   ├── Input
│   │   ├── Repeat
│   │   ├── common.js
│   │   ├── index.html
│   │   ├── index.js
│   │   └── util.js
│   ├── index.html
│   ├── index.js
│   └── ui-components // UI 公共组件存放处
│       ├── Button
│       ├── Collapse
│       ├── Navbar
│       ├── common.js
│       └── util.js
└── webpack.config.js
```
  

# 文档结构
```
├── advanced-topic
│   └── develop-your-own-playground.md // 如何开发属于自己的 playground
├── api // 存放 API 文档
├── examples // repo自带 example 用法介绍
│   ├── control-the-visibility.md // mapBackgroundToState 的用法
│   ├── counter.md // 计数器
│   ├── form-validation.md // 表单验证 demo
│   └── todo-app.md // TODO list 应用
├── how-it-works // 阐述引擎如何工作
│   ├── background.md // 重点描述 playground 下 job 和 utility 的工作原理
│   ├── intro.md // 整体介绍引擎的原理，包括和 redux 的区别，方法之间的调用和依赖关系，避免过度细节
│   └── state-tree-design.md // 介绍引擎当中状态树的设计
└── quick-start
├── before-you-start.md // 开始之前，需要了解 react, react-redux, mobx 的用法和原理
├── get-started.md // 简单的 hello world 应用，以及如何 debug 和调试
├── installation.md // 安装
└── react-lego.md // 介绍声明式组件的写法规范, 在 how it works 重点介绍这种写法的原因以及如何被引擎利用
```