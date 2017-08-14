import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Menu from './DropdownMenu'
import styles from './style.less'

export default class Header extends Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <header className={styles.header} >
        <div className={styles.logo} >
          <img src="https://gw.alipayobjects.com/zos/rmsportal/nGaiVXyUTiJdCwOuuXQI.png" alt="cicada logo" />
        </div>
        <nav className={styles.nav}>
          <div className={styles.link}>
            <NavLink exact to="/" >主页</NavLink>
          </div>
          <div className={styles.link}>
            <NavLink exact to="/docs" >开始</NavLink>
          </div>
          <div className={styles.link}>
            <NavLink exact to="/api" >API</NavLink>
          </div>
          <div className={styles.link}>
            <NavLink exact to="/blog" >博客</NavLink>
          </div>
          <div className={styles.link}>
            <NavLink exact to="/contribution" >参与社区</NavLink>
          </div>
          <div className={styles.link}>
            <NavLink exact to="/something-exciting" >更多</NavLink>
          </div>
          <div className={styles.link}>
            <NavLink exact to="/test" >Test</NavLink>
          </div>
          <div className={styles.setting}>
            <Menu lists={['1.0', '2.0']} toggle={'1.0'} />
          </div>
          <div className={styles.setting}>
            <Menu lists={['中文', 'EN']} toggle={'中文'} />
          </div>
        </nav>
      </header>
    )
  }
}
