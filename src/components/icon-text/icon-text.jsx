import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import InlineSvg from '../inline-svg/inline-svg.jsx'

import styles from './icon-text.css'

const IconWithText = (props) => {
  const { iconSrc, IconSvg, className, children, ...componentProps } = props

  const icon = IconSvg ? (
    <InlineSvg Svg={IconSvg} className={styles.icon} />
  ) : (
    iconSrc && <img className={styles.icon} draggable={false} src={iconSrc} />
  )
  return (
    <div className={classNames(className, styles.wrapper)} {...componentProps}>
      {icon}
      {children}
    </div>
  )
}

IconWithText.propTypes = {
  className: PropTypes.string,
  iconSrc: PropTypes.string,
  IconSvg: PropTypes.func,
  children: PropTypes.node,
}

export default IconWithText
