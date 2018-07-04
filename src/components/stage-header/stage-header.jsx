import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import VM from '@wdr-data/scratch-vm';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {ComingSoonTooltip} from '../coming-soon/coming-soon.jsx';
import Controls from '../../containers/controls.jsx';
import {getStageSize} from '../../lib/screen-utils.js';
import layout from '../../lib/layout-constants.js';
import Fullscreen from '../../containers/fullscreen.jsx';
import ButtonWithIcon from '../../components/button-with-icon/button-with-icon.jsx';
import saveButton from './download@2x.png';

import styles from './stage-header.css';

const messages = defineMessages({
    largeStageSizeMessage: {
        defaultMessage: 'Switch to large stage',
        description: 'Button to change stage size to large',
        id: 'gui.stageHeader.stageSizeLarge'
    },
    smallStageSizeMessage: {
        defaultMessage: 'Switch to small stage',
        description: 'Button to change stage size to small',
        id: 'gui.stageHeader.stageSizeSmall'
    },
    fullStageSizeMessage: {
        defaultMessage: 'Enter full screen mode',
        description: 'Button to change stage size to full screen',
        id: 'gui.stageHeader.stageSizeFull'
    },
    unFullStageSizeMessage: {
        defaultMessage: 'Exit full screen mode',
        description: 'Button to get out of full screen mode',
        id: 'gui.stageHeader.stageSizeUnFull'
    },
    fullscreenControl: {
        defaultMessage: 'Full Screen Control',
        description: 'Button to enter/exit full screen mode',
        id: 'gui.stageHeader.fullscreenControl'
    }
});

const StageHeaderComponent = function (props) {
    const {
        isFullScreen,
        isPlayerOnly,
        onKeyPress,
        onSaveProject,
        onSetStageLarge,
        onSetStageFull,
        onSetStageUnFull,
        vm
    } = props;

    const height = (window.innerHeight - layout.topBarHeight - layout.stageHeaderHeight - 8) / 2;

    const width = height * 4 / 3;

    let header = null;
    const stageSize = getStageSize(isFullScreen, height, width);

    if (isFullScreen) {
        header = (
            <Box className={styles.stageHeaderWrapperOverlay}>
                <Box
                    className={styles.stageMenuWrapper}
                    style={{width: stageSize.width}}
                >
                    <Controls
                        vm={vm}
                        className={styles.controlsFullscreen}
                    />
                    <Fullscreen />
                </Box>
            </Box>
        );
    } else {
            header = (
            <Box className={styles.stageHeaderWrapper} style={{width: stageSize.width}}>
                <Box className={styles.stageMenuWrapper}>
                    <Controls vm={vm} />
                    <ButtonWithIcon
                        className={styles.saveButton}
                        iconSrc={saveButton}
                        children={'Speichern'}
                        onClick={onSaveProject}
                    />
                </Box>
            </Box>
        );
    }

    return header;
};

StageHeaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool.isRequired,
    isPlayerOnly: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onSetStageFull: PropTypes.func.isRequired,
    onSetStageLarge: PropTypes.func.isRequired,
    onSetStageUnFull: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(StageHeaderComponent);
