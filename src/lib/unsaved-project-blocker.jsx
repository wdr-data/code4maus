import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { history } from './app-state-hoc.jsx'

const UnsavedProjectBlockerHOC = (WrappedComponent) => {
  class UnsavedProjectBlocker extends React.Component {
    stopBrowserNavigation(event) {
      event.preventDefault()
      event.returnValue = ''
    }
    routerBlock() {
      const unblock = history.block(() => {
        return window.confirm(
          'Möchtest du die Seite wirklich verlassen? Dein Projekt geht ohne Speichern verloren!'
        )
      })

      return () => {
        unblock()
      }
    }
    componentDidUpdate(oldProps) {
      if (this.props.isProjectUnsaved !== oldProps.isProjectUnsaved) {
        if (
          process.env.NODE_ENV === 'production' &&
          typeof window === 'object'
        ) {
          if (this.props.isProjectUnsaved) {
            // Warn before navigating away
            window.addEventListener('beforeunload', this.stopBrowserNavigation)
            this.routerBlock()
          } else {
            window.removeEventListener(
              'beforeunload',
              this.stopBrowserNavigation
            )
          }
        }
      }
    }
    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.stopBrowserNavigation)
    }
    render() {
      const {
        /* eslint-disable no-unused-vars */
        isProjectUnsaved,
        /* eslint-enable */
        ...props
      } = this.props
      return <WrappedComponent {...props} />
    }
  }

  UnsavedProjectBlocker.propTypes = {
    isProjectUnsaved: PropTypes.bool,
  }

  return connect((state) => ({
    isProjectUnsaved: state.scratchGui.projectChanged,
  }))(UnsavedProjectBlocker)
}

export default UnsavedProjectBlockerHOC
