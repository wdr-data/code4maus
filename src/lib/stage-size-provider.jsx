import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import { getStageSize } from './screen-utils';
import { connect } from 'react-redux';

const initialStageSize = getStageSize();
const StageSizeContext = React.createContext(initialStageSize);

export const StageSizeProviderHOC = (WrappedComponent) => {
    class StageSizeState extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                height: initialStageSize.height,
                width: initialStageSize.width,
            };
            this.handleScreenSizeChanged = debounce(this.handleScreenSizeChanged.bind(this), 300);
        }

        componentDidMount() {
            window.addEventListener('resize', this.handleScreenSizeChanged);
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.handleScreenSizeChanged);
        }

        handleScreenSizeChanged() {
            const { height, width } = getStageSize(this.props.isFullScreen);
            this.setState({ height, width });
        }

        render() {
            const {
                dispatch, // eslint-disable-line no-unused-vars
                isFullScreen, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;

            return (
                <StageSizeContext.Provider value={this.state}>
                    <WrappedComponent {...componentProps} />
                </StageSizeContext.Provider>
            );
        }
    }

    StageSizeState.propTypes = {
        dispatch: PropTypes.func,
        isFullScreen: PropTypes.bool.isRequired,
    };

    return connect(
        (state) => ({
            isFullScreen: state.scratchGui.mode.isFullScreen,
        }),
    )(StageSizeState);
};

export const StageSizeConsumer = StageSizeContext.Consumer;
