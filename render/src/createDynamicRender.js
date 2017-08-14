import React from 'react'
import PropTypes from 'prop-types'
import Render from './Render'
import { CHANGE_STATETREE } from './constant'
import exist from './exist'

function startWith(str, toTest) {
  return str.slice(0, toTest.length) === toTest
}

function isConfigChanged(changes) {
  return changes.some(({ valuePath }) => {
    return startWith(valuePath, 'config')
  })
}

export default function createDynamicRender(createStateTree, createAppearance, createBackground, backgroundDef) {
  const getDefaultState = () => ({
    config: {},
    value: {},
  })

  const stateTypes = {
    config: PropTypes.object.isRequired,
    value: PropTypes.object,
  }

  const shouldComponentUpdate = (_, type, changes) => {
    // 收到 config 变化才 return true
    return type === CHANGE_STATETREE && isConfigChanged(changes)
  }

  const componentWillReceiveState = ({ instance, state }, changes) => {
    // CAUTION 如果 config 数据变化了，那么肯定会进入重新渲染的流程。
    if (isConfigChanged(changes)) return

    // 收到数据变化，那么对 stateTree 进行操作
    const valuePathsToChange = changes.reduce((last, { valuePath, inputStatePath }) => {
      // inputStatePath 为 undefined 的是内部变化，所以忽略掉
      if (inputStatePath === undefined) return last
      // 如果改的不是 value
      if (!startWith(valuePath, 'value')) return last

      // 去掉前面的 'value.' 就得到了 value 下的改变的 path
      const inputValuePath = valuePath.slice(6)
      const isParentSaved = last.some((parent) => {
        return inputValuePath.slice(0, parent.length) === parent
      })
      return isParentSaved ? last : last.concat(inputValuePath)
    }, [])

    valuePathsToChange.forEach((inputValuePath) => {
      instance.stateTree.merge(inputValuePath, exist.get(state.value, inputValuePath))
    })
  }

  return {
    getDefaultState,
    stateTypes,
    shouldComponentUpdate,
    componentWillReceiveState,
    render({ state, instance }) {
      const { config, value } = state
      instance.stateTree = createStateTree(value)
      const appearance = createAppearance()
      return (
        <Render
          config={config}
          stateTree={instance.stateTree}
          appearance={appearance}
          background={createBackground(backgroundDef, instance.stateTree, appearance)}
        />
      )
    },
  }
}
