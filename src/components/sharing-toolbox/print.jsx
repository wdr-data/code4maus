import React from 'react'
import PropTypes from 'prop-types'
import styles from './print.css'
import buttonBorder from './buttonBorder.svg'

const PrintLayout = ({ stage, userHandle, layoutRef = React.createRef() }) => {
  return (
    <div className={styles.button} ref={layoutRef}>
      <img className={styles.stage} src={stage} />
      <img className={styles.buttonBorder} src={buttonBorder} />
      <div className={styles.textWrapper}>
        <div className={styles.userHandle}>{userHandle}</div>
      </div>
    </div>
  )
}

PrintLayout.propTypes = {
  stage: PropTypes.string.isRequired,
  userHandle: PropTypes.string,
  layoutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
}

export default PrintLayout
