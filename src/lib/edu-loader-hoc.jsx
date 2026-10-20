import { connect } from 'react-redux'
import React from 'react'
import { omit } from 'lodash'
import PropTypes from 'prop-types'
import { loadGame } from '../reducers/edu-layer'

const isEduView = (a) => !!a && a.includes('/lernspiel/')

const EduLoaderHOC = (WrappedComponent) => {
  class EduLoaderComponent extends React.Component {
    componentDidMount() {
      if (isEduView(this.props.match.path) && this.props.match.params.eduId) {
        this.loadGame(this.props.match.params.eduId)
      }
    }

    componentDidUpdate(prevProps) {
      if (
        isEduView(this.props.match.path) &&
        this.props.match.params.eduId &&
        prevProps.match.params.eduId !== this.props.match.params.eduId
      ) {
        this.loadGame(this.props.match.params.eduId)
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
    match: PropTypes.object,
    dispatch: PropTypes.func,
  }

  return connect((state) => ({
    projectId: state.scratchGui.project.id,
    enabled: state.scratchGui.eduLayer.enabled,
    // router: {
    //   view: state.router.result ? state.router.result.view : '',
    //   params: state.router.params || {},
    // },
  }))(EduLoaderComponent)
}

export default EduLoaderHOC
