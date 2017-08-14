/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
// import { Link } from 'react-router-dom'
// import PropTypes from 'prop-types'
// import styles from './style.less'

const Pagination = ({ offset = 0, limit = 5, postCatalog = [] }) => {
  return (
    <div>
      {postCatalog.map(post => <div>{post}</div>)}
    </div>
  )
}

Pagination.propTypes = {
  limit: PropTypes.number.isRequired,
  postCatalog: PropTypes.array.isRequired,
  offsset: PropTypes.number,
}

export default Pagination
