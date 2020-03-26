import React from 'react'
import PropTypes from 'prop-types'
import { useWindowWidth } from '@react-hook/window-size'

import indexStyles from '../css/index.css'
import LazyRender from './lazy-render.jsx'

function MobileScreenFallback(props) {
  const width = useWindowWidth()
  const isMobile = width < 600

  return (
    <>
      {isMobile && (
        <div className={indexStyles.mobileOverlayRoot}>
          <LazyRender promise={loadMobileScreen()} />
        </div>
      )}
      {props.children}
    </>
  )
}

MobileScreenFallback.propTypes = {
  children: PropTypes.node,
}

function loadMobileScreen() {
  return import(
    '../components/mobile-screen/mobile-screen.jsx' /* webpackChunkName: "mobile-screen" */
  )
}

export default MobileScreenFallback
