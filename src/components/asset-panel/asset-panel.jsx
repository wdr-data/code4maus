import React from 'react'

import Selector from './selector.jsx'
import styles from './asset-panel.css'

const AssetPanel = (props) => (
  <div className={styles.wrapper}>
    <Selector className={styles.selector} {...props} />
    <div className={styles.detailArea}>{props.children}</div>
  </div>
)
AssetPanel.propTypes = {
  ...Selector.propTypes,
}

export default AssetPanel
