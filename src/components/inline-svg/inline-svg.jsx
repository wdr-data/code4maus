import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './inline-svg.css'

const InlineSVG = (props) => {
  const { Svg, svg, className, color, ...componentProps } = props

  if (color !== '') {
    componentProps.style = {
      color,
    }
  }

  const svgUrl = (
    <span
      dangerouslySetInnerHTML={{ __html: svg }}
      className={classNames(styles.wrapper, className)}
      {...componentProps}
    />
  )

  return Svg ? (
    <span className={classNames(styles.wrapper, className)} {...componentProps}>
      <Svg />
    </span>
  ) : (
    svgUrl
  )
}

InlineSVG.propTypes = {
  svg: (props, propName, componentName) => {
    if (!props.Svg && !props[propName]) {
      return new Error(
        `One of props 'Svg' or 'svg' was not specified in '${componentName}'.`
      )
    }
    return null
  },
  Svg: (props, propName, componentName) => {
    if (!props.svg && !props[propName]) {
      return new Error(
        `One of props 'Svg' or 'svg' was not specified in '${componentName}'.`
      )
    }
    return null
  },
  className: PropTypes.string,
  color: PropTypes.string,
}

InlineSVG.defaultProps = {
  className: '',
  color: '',
}

export default InlineSVG
