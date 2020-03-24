import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'

import { getStageSize } from './screen-utils'

const initialStageSize = getStageSize()
const StageSizeContext = React.createContext(initialStageSize)
const StageSizeRequest = React.createContext(() => {})

export const StageSizeProviderHOC = (WrappedComponent) => {
  class StageSizeState extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        height: initialStageSize.height,
        width: initialStageSize.width,
        forced: false,
      }
      this.handleScreenSizeChanged = this.handleScreenSizeChanged.bind(this)
      this.handleScreenSizeChangedDebounced = debounce(
        this.handleScreenSizeChanged,
        300
      )
      this.requestStageSize = this.requestStageSize.bind(this)
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleScreenSizeChangedDebounced)
    }

    componentWillUnmount() {
      window.removeEventListener(
        'resize',
        this.handleScreenSizeChangedDebounced
      )
    }

    componentDidUpdate(prevProps) {
      if (prevProps.isFullScreen !== this.props.isFullScreen) {
        this.handleScreenSizeChanged()
      }
    }

    handleScreenSizeChanged(_event) {
      if (this.state.forced) {
        return
      }
      const { height, width } = getStageSize(this.props.isFullScreen)
      this.setState({ height, width })
    }

    requestStageSize({ width, height } = {}) {
      return new Promise((res) => {
        if (!width && !height) {
          const { height, width } = getStageSize(this.props.isFullScreen)
          this.setState({ height, width, forced: false }, res)
          return
        }
        this.setState({ width, height, forced: true }, res)
      })
    }

    render() {
      const {
        dispatch, // eslint-disable-line no-unused-vars
        isFullScreen, // eslint-disable-line no-unused-vars
        ...componentProps
      } = this.props

      return (
        <StageSizeContext.Provider value={this.state}>
          <StageSizeRequest.Provider value={this.requestStageSize}>
            <WrappedComponent {...componentProps} />
          </StageSizeRequest.Provider>
        </StageSizeContext.Provider>
      )
    }
  }

  StageSizeState.propTypes = {
    dispatch: PropTypes.func,
    isFullScreen: PropTypes.bool.isRequired,
  }

  return connect((state) => ({
    isFullScreen: state.scratchGui.mode.isFullScreen,
  }))(StageSizeState)
}

export const StageSizeConsumer = StageSizeContext.Consumer
export const StageSizeRequester = StageSizeRequest.Consumer
