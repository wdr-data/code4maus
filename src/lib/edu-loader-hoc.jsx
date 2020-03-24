import { connect } from 'react-redux'
import React from 'react'
import { omit } from 'lodash'
import PropTypes from 'prop-types'
import { loadGame } from '../reducers/edu-layer'
import { Views } from './routing'

const EduLoaderHOC = (WrappedComponent) => {
  class EduLoaderComponent extends React.Component {
    componentDidMount() {
      if (
        this.props.router.view === Views.edu &&
        this.props.router.params.eduId
      ) {
        this.loadGame(this.props.router.params.eduId)
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.router.view === Views.edu &&
        this.props.router.params.eduId &&
        prevProps.router.params.eduId !== this.props.router.params.eduId
      ) {
        this.loadGame(this.props.router.params.eduId)
      }
    }

    componentWillUnmount() {
      this.props.dispatch(loadGame(null))
    }

    loadGame(id) {
      this.props.dispatch(loadGame(id))
    }

    render() {
      const componentProps = omit(this.props, [
        'projectId',
        'enabled',
        'router',
        'dispatch',
      ])

      return <WrappedComponent {...componentProps} />
    }
  }

  EduLoaderComponent.propTypes = {
    router: PropTypes.object,
    dispatch: PropTypes.func,
  }

  return connect((state) => ({
    projectId: state.scratchGui.project.id,
    enabled: state.scratchGui.eduLayer.enabled,
    router: {
      view: state.router.result ? state.router.result.view : '',
      params: state.router.params || {},
    },
  }))(EduLoaderComponent)
}

export default EduLoaderHOC
