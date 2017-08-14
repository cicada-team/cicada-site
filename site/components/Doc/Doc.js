import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Sidebar from './SideBar'
import Main from './Main'
import styles from './style.less'
import grid from './../../styles/layout.less'

export default class Doc extends Component {
  constructor(props) {
    super()
    this.state = {
      catalog: props.sideBar || {},
    }
  }

  static PropTypes = {
    main: PropTypes.object,
    sideBar: PropTypes.object,
    selectedTitle: PropTypes.string,
  };

  componentDidUpdate() {
  }
  componentDidMount() {
  }

  render() {
    console.log(this.props)
    return (
      <div className={styles.container}>
        <div className={grid['pure-u-md-1-5']}>
          <Sidebar
            catalog={this.state.catalog}
            selectedTitle={this.props.main.title}
            onTitleClick={this.props.onTitleClick}
          />
        </div>
        <div className={grid['pure-u-md-4-5']}>
          <Main main={this.props.main} />
        </div>
      </div>
    )
  }
}

