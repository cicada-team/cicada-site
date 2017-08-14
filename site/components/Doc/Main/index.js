import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'
import styles from './style.less'
import RightSideBar from '../RightSideBar'
import SnippetPlayground from './../../SnippetPlayground/SnippetPlayground'

import grid from '../../../styles/layout.less'
import demos from '../../../config/demos'

export default class Main extends Component {
  static propTypes = {
    main: PropTypes.object,
  };
  static defaultProps = {
    main: {},
  };

  loadDemoCode = () => {

  }

  loadSp = () => {
    const demoNodes = document.querySelectorAll('div.demo')
    if (!demoNodes) return
    demoNodes.forEach((node) => {
      const nodeId = node.attributes.id.value
      const nodeDemoName = node.attributes['demo-name'].value
      const nodeMountName = node.attributes['mount-name'].value
      ReactDOM.render(
        <SnippetPlayground key={nodeId} code={demos[nodeDemoName]} mountNode={nodeMountName} />,
        document.getElementById(nodeId),
      )
    })
  }

  changeHeaderColor = () => {
    const header = document.querySelector('header')
    header.style.backgroundColor = '#2B549E'
  }

  componentDidMount() {
    this.loadSp()
    this.changeHeaderColor()
  }
  componentDidUpdate() {
    this.loadSp()
  }

  /*eslint-disable */
  render() {
    return (
      <div className={styles.container}>
        <Helmet title={`文档-${this.props.main.title}`} />
        <div className={grid["pure-u-md-4-5"]}>
          <div className={styles.githubLink}>
            <a href={this.props.main.githubLink} target="_blank">点击此编辑</a>
          </div>
          <div className={styles.title}>{this.props.main.title}</div>

          <div
            className={styles.main}
            dangerouslySetInnerHTML={{ __html: this.props.main.content }}
          />
        </div>
        <div className={grid["pure-u-md-1-5"]}>
          <RightSideBar className={styles.toc} docToc={this.props.main.toc} />
        </div>
      </div>
    );
  }
}

