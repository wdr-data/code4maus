import React from 'react'

import InlineSVG from '../inline-svg/inline-svg.jsx'
import LogoOverlay from '../logo-overlay/logo-overlay.jsx'

import loader from '!raw-loader!../../../assets/img/loader.svg'

import styles from './loader.css'

export const Spinner = () => (
  <InlineSVG className={styles.loader} svg={loader} />
)

const LoaderComponent = () => (
  <LogoOverlay>
    <Spinner />
  </LogoOverlay>
)

export default LoaderComponent
