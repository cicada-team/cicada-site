import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import Pagination from './Pagination'
import styles from './style.less'

export default class Blog extends Component {
  constructor(prop) {
    super()
    this.state = {
      limit: 5,
      posts: prop.posts,
    }
  }
  static propTypes = {
    posts: PropTypes.object,
  };

  static defaultProps = {
    posts: {},
  };

  formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toDateString()
  }
  createMarkup = (string) => {
    const substr = string.substring(0, 100)
    return {
      __html: `${substr}...`,
    }
  }

  /*eslint-disable */
  render() {
    const posts = this.state.posts
    return (
      <div className={styles.container}>
        <Helmet title={`Cicada 博客`}/>
        {Object.keys(posts).map(postUrl =>
          <div key={postUrl}>
            <div className={styles.header} >
            <div className={styles.title}>
              {posts[postUrl].title}
            </div>
            <div className={styles.date} >
              {this.formatDate(posts[postUrl].date)}
            </div>
            </div>
            <div
              className={styles.post}
              dangerouslySetInnerHTML={this.createMarkup(posts[postUrl].content)}
            />
          </div>
        )}
        <Pagination />
      </div>
    );
  }
}

