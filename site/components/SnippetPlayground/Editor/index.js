import React, { Component } from 'react'
import Codemirror from 'react-codemirror'
import PropTypes from 'prop-types'
import 'codemirror/mode/javascript/javascript'
// import 'codemirror/theme/solarized.css'
import styles from './style.less'


export default class Editor extends Component {

  constructor(props) {
    super()
    this.state = {
      code: props.code,
    }
  }

  static defaultProps = {

  }

  static propTypes = {
    code: PropTypes.string.isRequired,
    onUpdateCode: PropTypes.func.isRequired,
  }
  componentDidMount() {
  }

  componentWillReceiveProps() {
  }

  componentDidUpdate() {
  }

  render() {
    const options = {
      lineNumbers: true,
      autoSave: true,
      theme: 'solarized light',
      lineWrapping: false,
      tabSize: 2,
      fixedGutter: true,
      mode: 'javascript',
    }

    return (
      <div className={styles.editor} >
        <Codemirror
          value={this.props.code}
          onChange={this.props.onUpdateCode}
          options={options}
        />
      </div>
    )
  }
}
