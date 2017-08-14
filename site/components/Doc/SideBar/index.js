import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './style.less'

const SideBar = ({ catalog, onTitleClick, selectedTitle }) =>
  <div className={styles.sidebar}>
    <ul>
      {Object.keys(catalog).map(group =>
        <div key={group} >
          <div className={styles.group}> {group} </div>
          <div className={styles.section}>
            {catalog[group].map((item) => {
              let itemStyles = ''
              if (item.meta.title === selectedTitle) {
                itemStyles = `${styles.item} ${styles.active}`
              } else {
                itemStyles = styles.item
              }
              return (
                <div
                  onClick={() => onTitleClick({ url: item.meta.url })}
                  key={item.meta.title}
                  className={itemStyles}
                >
                  <Link to={`/docs/${item.meta.url}`}>
                    {item.meta.title}
                  </Link>
                </div>
              )
            },
            )}
          </div>
        </div>,
      )}
    </ul>
  </div>

SideBar.propTypes = {
  catalog: PropTypes.object.isRequired,
  onTitleClick: PropTypes.func.isRequired,
  selectedTitle: PropTypes.string.isRequired,
}

export default SideBar

