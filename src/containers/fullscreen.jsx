import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import {setStageSize, STAGE_SIZES} from '../reducers/stage-size';
import {setFullScreen} from '../reducers/mode';

import FullscreenComponent from '../components/fullscreen/fullscreen.jsx';

class Fullscreen extends React.Component {
  constructor (props) {
      super(props);
      bindAll(this, [
        'handleKeyPress'
      ]);
  }
  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  handleKeyPress (event) {
    if (event.key === 'Escape' && this.props.isFullScreen) {
      this.props.onSetStageUnFull(false);
    }
  }
  render () {
    return (
      <FullscreenComponent
        onKeyPress={this.handleKeyPress}
        {...this.props}
      />
    );
  }
}

Fullscreen.propTypes = {
  onSetStageUnFull: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isFullScreen: state.scratchGui.mode.isFullScreen
});

const mapDispatchToProps = dispatch => ({
  onSetStageFull: () => dispatch(setFullScreen(true)),
  onSetStageUnFull: () => dispatch(setFullScreen(false))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fullscreen);