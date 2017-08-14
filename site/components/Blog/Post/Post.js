import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
import styles from './style.less'

const Post = ({ content, title, date }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{title}</div>
        <div>{date}</div>
      </div>
      <div className={styles.content}>{content}</div>
    </div>
  )
}

Post.propTypes = {
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
}
export default Post

