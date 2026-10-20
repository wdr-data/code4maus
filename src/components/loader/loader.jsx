import React from 'react'

import InlineSVG from '../inline-svg/inline-svg.jsx'
import LogoOverlay from '../logo-overlay/logo-overlay.jsx'

import styles from './loader.css'
import Loader from '../../../assets/img/loader.svg?component'

export const Spinner = () => (
  <InlineSVG className={styles.loader} Svg={Loader} />
)

const LoaderComponent = () => (
  <LogoOverlay>
    <Spinner />
  </LogoOverlay>
)

export default LoaderComponent
