import PropTypes from 'prop-types';
import React from 'react';
import MediaQuery from 'react-responsive';
import VM from '@wdr-data/scratch-vm';

import Box from '../box/box.jsx';
import layout from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';

import styles from './stage-wrapper.css';

const StageWrapperComponent = function(props) {
    const {
        isRendererSupported,
        vm,
    } = props;

    const height = (window.innerHeight - layout.topBarHeight - layout.stageHeaderHeight - 8) / 2;

    const width = height * 4 / 3;

    return (
        <Box className={styles.stageWrapper}>
            <Box className={styles.stageCanvasWrapper}>
                <Stage
                    height={height}
                    shrink={0}
                    vm={vm}
                    width={width}
                />
            </Box>
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isRendererSupported: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default StageWrapperComponent;
