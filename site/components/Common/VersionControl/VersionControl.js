import React from 'react'
import styles from './style.less'

const VersionControl = () => {
  return (
    <div>
      <span>版本</span>
      <select className={styles.select} name="version" id="">
        <option value="1.0" selected>1.0</option>
        <option value="2.0">2.0</option>
      </select>
    </div>
  )
}
VersionControl.propTypes = {

}
export default VersionControl
