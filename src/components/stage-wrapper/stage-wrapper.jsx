import PropTypes from 'prop-types';
import React from 'react';
import VM from '@wdr-data/scratch-vm';

import Box from '../box/box.jsx';
import Stage from '../../containers/stage.jsx';

import styles from './stage-wrapper.css';

const StageWrapperComponent = function(props) {
    const {
        isRendererSupported,
        stageSize,
        vm,
    } = props;

    return (
        <Box className={styles.stageWrapper}>
            <Box className={styles.stageCanvasWrapper}>
                <Stage
                    height={stageSize.height}
                    shrink={0}
                    vm={vm}
                    width={stageSize.width}
                />
            </Box>
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isRendererSupported: PropTypes.bool.isRequired,
    stageSize: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
    }).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default StageWrapperComponent;
