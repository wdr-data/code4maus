import React from 'react'
import { connect } from 'react-redux'
import { block, unblock } from 'redux-little-router'
import PropTypes from 'prop-types'

const UnsavedProjectBlockerHOC = (WrappedComponent) => {
  class UnsavedProjectBlocker extends React.Component {
    stopBrowserNavigation(event) {
      event.preventDefault()
      event.returnValue = ''
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
            this.props.routerBlock()
          } else {
            window.removeEventListener(
              'beforeunload',
              this.stopBrowserNavigation
            )
            this.props.routerUnBlock()
          }
        }
      }
    }
    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.stopBrowserNavigation)
      this.props.routerUnBlock()
    }
    render() {
      const {
        /* eslint-disable no-unused-vars */
        isProjectUnsaved,
        routerBlock,
        routerUnBlock,
        /* eslint-enable */
        ...props
      } = this.props
      return <WrappedComponent {...props} />
    }
  }

  UnsavedProjectBlocker.propTypes = {
    isProjectUnsaved: PropTypes.bool,
    routerBlock: PropTypes.func.isRequired,
    routerUnBlock: PropTypes.func.isRequired,
  }

  return connect(
    (state) => ({
      isProjectUnsaved: state.scratchGui.projectChanged,
    }),
    (dispatch) => ({
      routerBlock: () =>
        dispatch(
          block(
            () =>
              'Möchtest du die Seite wirklich verlassen? Dein Projekt geht ohne Speichern verloren!'
          )
        ),
      routerUnBlock: () => dispatch(unblock()),
    })
  )(UnsavedProjectBlocker)
}

export default UnsavedProjectBlockerHOC
