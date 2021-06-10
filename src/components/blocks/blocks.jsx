import PropTypes from 'prop-types'
import React from 'react'
import styles from './blocks.css'

const BlocksComponent = (props) => {
  const { componentRef, ...componentProps } = props
  return (
    <div className={styles.blocks} ref={componentRef} {...componentProps} />
  )
}
BlocksComponent.propTypes = {
  componentRef: PropTypes.func,
}
export default BlocksComponent
