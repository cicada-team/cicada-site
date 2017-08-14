/**
 * 这个 background 只是 stateTree 的代理，让用户在 mapBackgroundToState
 * 中也能使用 stateTree.get 来获取值，并有依赖效果
 */
import { some, ensure } from '../../util'
import createStatePathCollector from '../createStatePathCollector'
import { escapeDot } from '../common'

export function test(dep, changesGroupById) {
  return some(changesGroupById, (changes) => {
    return changes.some(({ statePath, valuePath }) => {
      if (dep[statePath] === undefined) return false
      return dep[statePath].some((depValuePath) => {
        // 表示直接读取的是根节点
        if (depValuePath === undefined) return true

        const exp = new RegExp(`^${escapeDot(depValuePath)}${depValuePath === '' ? '' : '\\.'}`)
        return valuePath === depValuePath || exp.test(valuePath)
      })
    })
  })
}

export function initialize(stateTree) {
  const collector = createStatePathCollector()

  function get(inputStatePath) {
    const { value, statePath, valuePath } = stateTree.getWithDetail(inputStatePath)
    // 更新引用
    collector.update(statePath, (originValuePaths = []) => {
      // CAUTION 直接操作了引用
      ensure(originValuePaths, valuePath)
      return originValuePaths
    })
    return value
  }

  return {
    get,
    // 下面这四个是 bg 要求 utility 实现的，用于做 job 的依赖计算
    collect: collector.collect,
    extract: collector.extract,
    subscribe: (...arg) => stateTree.subscribe(...arg),
    merge: (...arg) => stateTree.merge(...arg),
    set: (...arg) => stateTree.set(...arg),
    test,
  }
}

export function check() {
  return false
}

