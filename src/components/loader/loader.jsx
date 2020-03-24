import React from 'react'

import InlineSVG from '../inline-svg/inline-svg.jsx'
import LogoOverlay from '../logo-overlay/logo-overlay.jsx'

import styles from './loader.css'
import loader from '!raw-loader!../../../assets/img/loader.svg'

export const Spinner = () => (
  <InlineSVG className={styles.loader} svg={loader} />
)

const LoaderComponent = () => (
  <LogoOverlay>
    <Spinner />
  </LogoOverlay>
)

export default LoaderComponent
