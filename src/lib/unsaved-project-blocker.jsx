import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { history } from './app-state-hoc.jsx'

const LEAVE_MESSAGE =
  'Möchtest du die Seite wirklich verlassen? Dein Projekt geht ohne Speichern verloren!'

const UnsavedProjectBlockerHOC = (WrappedComponent) => {
  class UnsavedProjectBlocker extends React.Component {
    constructor(props) {
      super(props)
      this.unblockRouter = null
    }
    stopBrowserNavigation(event) {
      event.preventDefault()
      event.returnValue = ''
    }
    block() {
      if (this.unblockRouter) {
        return
      }
      window.addEventListener('beforeunload', this.stopBrowserNavigation)
      // history v4 shows a string prompt via window.confirm
      this.unblockRouter = history.block(LEAVE_MESSAGE)
    }
    unblock() {
      window.removeEventListener('beforeunload', this.stopBrowserNavigation)
      if (this.unblockRouter) {
        this.unblockRouter()
        this.unblockRouter = null
      }
    }
    syncBlocker() {
      if (process.env.NODE_ENV !== 'production' || typeof window !== 'object') {
        return
      }
      if (this.props.isProjectUnsaved) {
        this.block()
      } else {
        this.unblock()
      }
    }
    componentDidMount() {
      this.syncBlocker()
    }
    componentDidUpdate(oldProps) {
      if (this.props.isProjectUnsaved !== oldProps.isProjectUnsaved) {
        this.syncBlocker()
      }
    }
    componentWillUnmount() {
      if (typeof window === 'object') {
        this.unblock()
      }
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
