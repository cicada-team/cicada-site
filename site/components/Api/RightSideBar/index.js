import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './style.less'

export default class RightSideBar extends Component {
  static propTypes = {
    docToc: PropTypes.array,
  }

  static defaultProps = {
    docToc: [],
  }
/* eslint-disable */
  handleClick(item) {
    const id = `#${item}`
    const el = document.querySelector(id)
    el.scrollIntoView()
  }

  render() {
    const docToc = this.props.docToc
    return (
      <div className={styles.sidebar}>
        <ul>
          {docToc.map(item =>
            <li key={item.id} >
              <a href={`#${item.id}`}>{item.value}</a>
            </li>,
          )}
        </ul>
      </div>
    )
  }
}

