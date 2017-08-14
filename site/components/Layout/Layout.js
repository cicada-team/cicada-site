import React, { Component } from 'react'
import styles from './style.less'
import Header from './../Header'
import Footer from './../Footer'


export default class Layout extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.main}>
          {this.props.children}
        </div>
        <Footer />
      </div>
    )
  }
}

