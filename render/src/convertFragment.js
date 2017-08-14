/**
 * convertFragment 负责将 config 片段转换为金蝉组件。
 * 这里的重点问题有两个：
 *
 * 1. 由于金蝉组件都是受控，所以我们转换出的组件也必须是受控的。由于之前
 * Render 的设计已经考虑了受控形式，所以这里只要遵照 Render 的规则给其传入
 * onChange 函数即可变为受控。
 *
 * 2. 转换为受控形式之后, 组件的渲染都是由外部传入新数据来控制的。如果包装后
 * 的组件也采取这种获取新值后重新渲染的方式，那么在内部结构变大后，可能会产
 * 生性能问题。例如组件中的某一个 input 一直输入，每次都要从外部全部刷新，会
 * 感觉卡顿。问了解决这个问题，首先，转换后的组件声明了 shouldComponentUpdate
 * 为 false，永远不重新渲染。然后，我们让内部 Render 在发生变化先用 stateTree 的
 * cache 缓存住变化，不通知组件更新，仍然往外跑一边流程，然后在外部通知要重渲染时
 * flush 内部的 stateTree，继续使用 Render 内部的精确更新。
 */

/* eslint-disable no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import ReactDomServer from 'react-dom/server'
import { mapValues, each, findIndex, every, isObject, createUniqueIdGenerator } from './util'
import Render from './Render'
import { REASON_DEFAULT_LISTENER } from './constant'
import applyLazyInitializeToStateTree from './applyStateTreeLazyInitialize'

export const INNER_STATE_TREE_KEY = '__inner__'

function noop() {}

function strictType(a) {
  return typeof a !== 'object' ? (typeof a) : (Array.isArray(a) ? 'array' : 'object')
}

function partialDeepEqual(a, b) {
  if (strictType(a) !== strictType(b)) return false
  if (!isObject(a)) return a === b

  return every(a, (v, k) => partialDeepEqual(v, b[k]))
}

function computeFrom(linkState, utilInstances) {
  return mapValues(linkState, ({ from }) => {
    return from(utilInstances)
  })
}

function computeTo(linkState, state, utilInstances) {
  let recomputed = {}
  each(linkState, ({ to }, name) => {
    recomputed = { ...to({ value: state[name], state, ...utilInstances }) }
  })
  return recomputed
}

function mockRender(config, components, stateTree, background) {
  // TODO 非常hack，准备更好地方法
  ReactDomServer.renderToStaticMarkup(<Render config={config} stateTree={stateTree} components={components} background={background} />)
  return stateTree
}

function createListenerDelegator(exposeListener, listeners) {
  return function onChange(changeFn, triggerListener, configPathArr, originInjectedArg, ...runtimeArgs) {
    const configPath = configPathArr.join('.')
    const exposeName = findIndex(exposeListener, ({ source, listener: triggerListenerToMatch }) => source === configPath && triggerListener === triggerListenerToMatch)
    if (exposeName === undefined) {
      listeners.onChange({ ...originInjectedArg, changeFn }, ...runtimeArgs)
    } else {
      listeners[exposeName]({ ...originInjectedArg, changeFn }, ...runtimeArgs)
    }
  }
}

function applyStateTreeSilencer(createStateTree) {
  return function (initialState) {
    const stateTree = createStateTree(initialState)
    return {
      ...stateTree,
      subscribe: noop,
      forceSubscribe: noop,
      subscribeByStateId: noop,
    }
  }
}

const defaultValueMap = {
  string: () => '',
  number: () => 0,
  array: () => [],
  object: () => ({}),
}

export default function convertFragment(fragment, createStateTree, createAppearance, createBackground, backgroundDef = {}) {
  const { linkState = {}, exposeListener = {}, getInitialState = () => ({}), didMount, config } = fragment
  const createMockId = createUniqueIdGenerator('mock')

  const stateTypes = {
    ...mapValues(linkState, ({ stateType }) => PropTypes[stateType]),
  }

  const getDefaultState = () => ({
    // CAUTION 不再自动计算，必须用户填入初始值
    ...mapValues(linkState, ({ getDefaultValue, stateType }) => {
      /* eslint-disable no-prototype-builtins */
      return getDefaultValue !== undefined ? getDefaultValue() : defaultValueMap[stateType]()
      /* eslint-enable no-prototype-builtins */
    }),
  })

  const commonListener = ({ instance, state }, { changeFn }, ...runtimeArgs) => {
    if (changeFn === undefined) return state
    // instance.stateTree.cache()
    changeFn(...runtimeArgs)
    // 由于注册了 computeFrom 这个 job，如果 from 需要重新计算， 那么自然会在 instance 上得到 nextFrom
    // stateTree 没变并且 nextFrom 也没变, 那么直接 return 原来 state
    if (instance.stateTree.getVersion() === instance.stateTreeVersion && instance.currentFrom === instance.nextFrom) return state
    instance.currentFrom = instance.nextFrom
    instance.stateTreeVersion = instance.stateTree.getVersion()
    // 返回新对象表示必须重新进入 render 流程
    return {
      ...instance.currentFrom,
      // 暴露到外面只是为了调试，真正的 stateTree 在 instance 上
      // [INNER_STATE_TREE_KEY]: instance.stateTree.get(),
    }
  }

  const defaultListeners = {
    // 所有 listener 都是同一个函数， 详情看 createListenerDelegator 函数
    ...mapValues(exposeListener || {}, () => commonListener),
    onChange: commonListener,
  }

  // CAUTION shouldComponentUpdate 起作用完全是因为 lego 在收到数据的变化的时候
  // 支持了这个函数。这样就不会受未来 react 变化的影响
  const shouldComponentUpdate = () => {
    return false
  }

  const componentWillReceiveProps = ({ state, instance }) => {
    // CAUTION 注意，这里只针对外部引起的变化进行来重新内部render
    const stateTree = instance.stateTree
    const newInner = computeTo(linkState, state, instance.background.instances)
    each(newInner, (newState, statePath) => {
      if (!partialDeepEqual(newState, stateTree.get(statePath))) {
        stateTree.merge(statePath, newState)
      }
    })
  }

  const componentWillReceiveState = ({ state, instance }, changes) => {
    // 如果改变是完全来自内部，那么就不用再计算 to 了
    // 如果有一个改变时来自外部，那么要重新计算 to
    if (changes.some(({ reason }) => reason !== REASON_DEFAULT_LISTENER)) {
      // instance.stateTree.cache()
      const stateTree = instance.stateTree
      // CAUTION 这里通过 background.pause 来阻止 job 触发 from 重新计算
      instance.background.pause()
      computeTo(linkState, state, instance.background.instances)
      instance.background.resume()
      // CAUTION，只要是从外部接受过值，那么内外数据就一定一致，所以这里修正一下
      instance.currentFrom = state
      instance.nextFrom = state
      instance.stateTreeVersion = stateTree.getVersion()
    }

    // instance.stateTree.flush()
  }

  const createComputeFromJob = (instance) => {
    return {
      initialize(utilInstances) {
        return {
          register() {},
          run() {
            return computeFrom(linkState, utilInstances)
          },
          handle(_, result) {
            instance.nextFrom = result
          },
        }
      },
      check({ mockBackgroundJob }) {
        return mockBackgroundJob === true
      },
    }
  }

  return {
    defaultListeners,
    stateTypes,
    getDefaultState,
    shouldComponentUpdate,
    componentWillReceiveProps,
    componentWillReceiveState,
    render({ listeners, instance, state, context }) {
      // CAUTION 始终只 render 一次，更新是依靠 componentWillReceiveState 实现的
      if (instance.rendered === true) throw new Error('fragment should never re-render')
      instance.rendered = true

      // 1. 要通过 preRender 的方式来得到完整的 stateTree
      const mockStateTree = applyStateTreeSilencer(createStateTree)(getInitialState())
      const mockBackground = createBackground(backgroundDef, mockStateTree, createAppearance())
      mockRender(fragment.config, context.components, mockStateTree, mockBackground)

      // 2. 这个时候已经得到了完整的的 stateTree，接下来尝试通过 computeTo 来把 state 上的值合并进去，
      const stateTree = applyLazyInitializeToStateTree(createStateTree)(mockStateTree)
      const appearance = createAppearance()
      const { utilities = {}, jobs = {} } = backgroundDef
      const background = createBackground({
        utilities,
        jobs: {
          ...jobs,
          computeFrom: createComputeFromJob(instance),
        },
      }, stateTree, appearance)

      // 启动的时候 computeTo 一次, 得到初始化好的 stateTree 和 background
      computeTo(linkState, state, background.instances)
      // 这个时候 stateTree 的初始值才真正设置进去
      stateTree.unwrap()

      // 用来 computeFromJob
      background.register(createMockId(), { mockBackgroundJob: true }, {})

      Object.assign(instance, {
        stateTree,
        background,
      })

      return (
        <Render
          stateTree={instance.stateTree}
          appearance={createAppearance()}
          background={instance.background}
          config={config}
          didMount={didMount}
          components={context.components}
          onChange={createListenerDelegator(exposeListener, listeners, config)}
        />
      )
    },
  }
}
