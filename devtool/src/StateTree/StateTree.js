import React from 'react'

// 1. 能查找，快速展开
// 2. 能标记变化(用户直接 set 的 和 set 里面有变化的)
// 3. 前进和后退



export default class StateTree extends React.Component {
  constructor() {
    super()
  }
  shouldComponentUpdate() {
    // CAUTION 始终使用局部刷新优化性能
    return false
  }
  register(path, update) {

  }
  createFlatTree(stateTree, path = '') {

  }
  render() {
    return this.createFlatTree(this.props.stateTree.get())
  }
}