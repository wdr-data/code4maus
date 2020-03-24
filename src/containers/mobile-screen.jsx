import React from 'react'
import ReactDOM from 'react-dom'
import debounce from 'lodash.debounce'

import indexStyles from '../css/index.css'
import LazyRender from './lazy-render.jsx'

class MobileScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMobile: window.innerWidth < 600
    }

    this.el = document.createElement('div')
    this.el.className = indexStyles.mobileOverlayRoot

    this.detectMobileSizeDebounce = debounce(
      this.detectMobileSize.bind(this),
      500
    )
  }

  componentDidMount() {
    document.body.appendChild(this.el)
    window.addEventListener('resize', this.detectMobileSizeDebounce)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.detectMobileSizeDebounce)
    document.body.removeChild(this.el)
  }

  detectMobileSize(ev) {
    const isMobile = window.innerWidth < 600
    if (this.state.isMobile !== isMobile) {
      this.setState({ isMobile })
    }
  }

  render() {
    if (!this.state.isMobile) {
      return null
    }

    return ReactDOM.createPortal(
      <LazyRender
        promise={import(
          '../components/mobile-screen/mobile-screen.jsx' /* webpackChunkName: "mobile-screen" */
        )}
      />,
      this.el
    )
  }
}

export default MobileScreen
