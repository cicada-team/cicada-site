import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import { transform } from 'babel-standalone'
import loadScript from 'load-script'
// import dependences
import connect from '@cicada/render/lib/connect'
import { mapValues } from '@cicada/render/lib/util'
import Render from '@cicada/render/lib/Render'
import NaiveRender from '@cicada/render/lib/NaiveRender'
import createStateTree from '@cicada/render/lib/createStateTree'
import createAppearance from '@cicada/render/lib/createAppearance'
import createBackground from '@cicada/render/lib/createBackground'
import applyStateTreeSubscriber from '@cicada/render/lib/applyStateTreeSubscriber'
import * as validationBackground from '@cicada/render/lib/background/utility/validation'
import * as stateTreeBackground from '@cicada/render/lib/background/utility/stateTree'
import * as appearanceBackground from '@cicada/render/lib/background/utility/appearance'
import * as listenerBackground from '@cicada/render/lib/background/utility/listener'
import * as mapBackgroundToStateJob from '@cicada/render/lib/background/job/mapBackgroundToState'
import * as visibleJob from '@cicada/render/lib/background/job/visibility'

import * as Input from './component/Input'
import * as Checkbox from './component/Checkbox'
import * as Button from './component/Button'
import * as Box from './component/Box'

import styles from './style.less'

const ReactDOM = ReactDom

class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deps: {},
      mountNode: props.mountNode,
    }
  }
  compile = () => {
    const compiled = transform(this.props.code, { presets: ['es2015', 'react', 'stage-0'] }).code
    return `
      (function (require, mountNode) {
        ${compiled}
      })(); 
    `
  }
  loadScript = (moduleName = 'react-dom.js') => {
    const base = 'https://a.alipayobjects.com/g/component/react/15.4.1/'
    const url = base + moduleName
    if (document.getElementById(`npmcdn-${moduleName}`)) {
      return
    }
    loadScript(url, {
      attrs: {
        id: `npmcdn-${moduleName}`,
        async: false,
      },
    }, (_error) => {
      if (_error) throw _error
      else {
        this.onScriptLoad(moduleName)
      }
    })
  }

  onScriptLoad = (dep) => {
    const deps = { ...this.state.deps }
    deps[dep] = true
    this.setState({ deps })
  }

  npmRequired = (moduleName) => {
    const deps = { ...this.state.deps }
    if (!(moduleName in deps)) {
      this.setState({ deps })
    } else {
      return window[moduleName]
    }
  }

  componentDidMount() {
    this.componentDidUpdate()
  }

  shouldComponentUpdate(nextProps) {
    return this.props.code !== nextProps.code
  }

  gatherDeps = () => {
    const components = mapValues({ Button, Input, Checkbox, Box }, connect)
    const argList = [React, ReactDOM, components, NaiveRender]
    const argNames = ['React', 'ReactDOM', 'components', 'NaiveRender']
    return {
      argNames,
      argList,
    }
  }

  executeCode = () => {
    const compiled = this.compile()
    setTimeout(() => {
      try {
        const argMeta = this.gatherDeps()
        const argNames = argMeta.argNames
        const argList = argMeta.argList
        /* eslint-disable */
        const executed = new Function(...argNames, compiled)
        executed.apply(null, argList)
      } catch (e) {
        throw e
      }
    }, 0)
  }

  // load scripts for
  componentDidUpdate() {
    this.executeCode()
  }

  render() {
    console.log(this.props.mountNode)
    return (
      <div>
        <div id={this.state.mountNode} ref="mount" className={styles.preview} />
      </div>
    )
  }
}

Preview.propTypes = {
  code: PropTypes.string,
  mountNode: PropTypes.string,
}
Preview.defaultProps = {
  code: '',
  mountNode: '',
}
export default Preview

