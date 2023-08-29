import bindAll from 'lodash.bindall'
import PropTypes from 'prop-types'
import React from 'react'
import VM from 'scratch-vm'

import ControlsComponent from '../components/controls/controls.jsx'

class Controls extends React.Component {
  constructor(props) {
    super(props)
    bindAll(this, [
      'handleGreenFlagClick',
      'handleStopAllClick',
      'onProjectRunStart',
      'onProjectRunStop',
    ])
    this.state = {
      projectRunning: false,
      turbo: false,
    }
  }
  componentDidMount() {
    this.props.vm.addListener('PROJECT_RUN_START', this.onProjectRunStart)
    this.props.vm.addListener('PROJECT_RUN_STOP', this.onProjectRunStop)
  }
  componentWillUnmount() {
    this.props.vm.removeListener('PROJECT_RUN_START', this.onProjectRunStart)
    this.props.vm.removeListener('PROJECT_RUN_STOP', this.onProjectRunStop)
  }
  onProjectRunStart() {
    this.setState({ projectRunning: true })
  }
  onProjectRunStop() {
    this.setState({ projectRunning: false })
  }
  handleGreenFlagClick(e) {
    e.preventDefault()

    if (this.props.onGreenFlagClick) {
      this.props.onGreenFlagClick()
    }
    if (e.shiftKey) {
      this.setState({ turbo: !this.state.turbo })
      this.props.vm.setTurboMode(!this.state.turbo)
    } else {
      this.props.vm.greenFlag()
    }
  }
  handleStopAllClick(e) {
    e.preventDefault()

    if (this.props.onStopAllClick) {
      this.props.onStopAllClick()
    }
    this.props.vm.stopAll()
  }
  render() {
    const {
      vm, // eslint-disable-line no-unused-vars
      ...props
    } = this.props
    return (
      <ControlsComponent
        {...props}
        active={this.state.projectRunning}
        turbo={this.state.turbo}
        onGreenFlagClick={this.handleGreenFlagClick}
        onStopAllClick={this.handleStopAllClick}
      />
    )
  }
}

Controls.propTypes = {
  vm: PropTypes.instanceOf(VM),
  onGreenFlagClick: PropTypes.func,
  onStopAllClick: PropTypes.func,
}

export default Controls
