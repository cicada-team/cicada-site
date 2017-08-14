import React, { Component } from 'react'
import styles from './style.less'
import grid from '../../styles/layout.less'
/*
 state
 */

export default class Footer extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <footer className={styles.default}>
        <div className={grid['pure-u-lg-1-3']}>
          <div className={styles.item}>
            this is footer
          </div>
        </div>
        <div className={grid['pure-u-lg-1-3']}>
          <div className={styles.item}>
            <a href="#">Github Repo</a>
          </div>
        </div>
        <div className={grid['pure-u-lg-1-3']}>
          <div className={styles.item}>
            Copyright@2017 Cicada Team. All Right Reserved.
          </div>
        </div>
      </footer>
    )
  }
}

