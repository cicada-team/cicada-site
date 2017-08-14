import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Editor from './Editor'
import Preview from './Preview'

import styles from './style.less'

export default class SnippetPlayground extends Component {
  constructor(props) {
    super()
    this.state = {
      code: props.code,
      mountNode: props.mountNode,
    }
  }

  static propTypes = {
    code: PropTypes.string,
    mountNode: PropTypes.string,
  }
  static defaultProps = {
    code: '',
    mountNode: '',
  }

  componentDidMount() {
  }

  onUpdateCode = (code) => {
    this.setState({
      code,
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.editor}>
          <Editor code={this.state.code} onUpdateCode={this.onUpdateCode} />
        </div>
        <div className={styles.preview}>
          <Preview code={this.state.code} mountNode={this.state.mountNode} />
        </div>
      </div>
    )
  }
}

