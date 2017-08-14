import React, { Component } from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import styles from './style.less'
import RightSideBar from '../RightSideBar'
import SnippetPlayground from './../../SnippetPlayground/SnippetPlayground'

import grid from '../../../styles/layout.less'
import demos from './../../../config/demos'

export default class Main extends Component {
  static propTypes = {
    main: PropTypes.object,
  };
  static defaultProps = {
    main: {},
  };

  componentDidMount() {}

  componentDidUpdate() {
    if (ReactDom.findDOMNode(document.getElementById('demo-1'))) {
      ReactDom.render(
        <SnippetPlayground code={demos.EchoInput} />,
        document.getElementById('demo-1'),
      )
    }
  }

  /*eslint-disable */
  render() {
    return (
      <div className={styles.container}>
        <div className={grid["pure-u-lg-4-5"]}>
          <div
            className={styles.main}
            dangerouslySetInnerHTML={{ __html: this.props.main.content }}
          />
        </div>
        <div className={grid["pure-u-lg-1-5"]}>
          <RightSideBar className={styles.toc} docToc={this.props.main.toc} />
        </div>
      </div>
    );
  }
}

