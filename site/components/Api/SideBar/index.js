import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './style.less'

const SideBar = ({ catalog, onTitleClick }) =>
  <div className={styles.sidebar}>
    <ul>
      {Object.keys(catalog).map(group =>
        <div key={group} >
          <div className={styles.group}> {group} </div>
          {catalog[group].map(item =>
            <div
              onClick={() => onTitleClick({ url: item.meta.url })}
              key={item.meta.title}
              className={styles.item}
            >
              <Link to={`/api/${item.meta.url}`}>
                {item.meta.title}
              </Link>
            </div>,
          )}
        </div>,
    )}
    </ul>
  </div>

SideBar.propTypes = {
  catalog: PropTypes.object.isRequired,
  onTitleClick: PropTypes.func.isRequired,
}
export default SideBar
