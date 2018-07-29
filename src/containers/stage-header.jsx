import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';

import { setFullScreen } from '../reducers/mode';
import { openSaveProject } from '../reducers/modals';
import StageHeaderComponent from '../components/stage-header/stage-header.jsx';

class StageHeader extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [ 'handleKeyPress' ]);
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress(event) {
        if (event.key === 'Escape' && this.props.isFullScreen) {
            this.props.onSetStageUnFull(false);
        }
    }
    render() {
        const {
            onSetStageUnFull, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <StageHeaderComponent
                {...props}
            />
        );
    }
}

StageHeader.propTypes = {
    ...StageHeaderComponent.propTypes,
    onSetStageUnFull: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    stageSize: state.scratchGui.stageSize.stageSize,
    isFullScreen: state.scratchGui.mode.isFullScreen,
});

const mapDispatchToProps = (dispatch) => ({
    onOpenMenu: () => dispatch(push('/')),
    onSaveProject: () => dispatch(openSaveProject()),
    onSetStageUnFull: () => dispatch(setFullScreen(false)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageHeader);
