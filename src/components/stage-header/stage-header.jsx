import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import VM from '@wdr-data/scratch-vm';

import Controls from '../../containers/controls.jsx';
import Fullscreen from '../../containers/fullscreen.jsx';
import { getStageSize } from '../../lib/screen-utils.js';
import layout from '../../lib/layout-constants.js';
import Box from '../box/box.jsx';
import ButtonWithIcon from '../button-with-icon/button-with-icon.jsx';
import MenuButton from '../menu-button/menu-button.jsx';

import saveIcon from '!raw-loader!../../../assets/icons/header_save.svg';
import menuIcon from '!raw-loader!../../../assets/icons/header_menu.svg';
import mailIcon from '!raw-loader!../../../assets/icons/menu_impressum.svg';
import styles from './stage-header.css';

const StageHeaderComponent = function(props) {
    /* eslint-disable no-unused-vars */
    const {
        isFullScreen,
        onOpenMenu,
        onSaveProject,
        vm,
    } = props;
    /* eslint-enable */

    const height = (window.innerHeight - layout.topBarHeight - layout.stageHeaderHeight - 8) / 2;
    const width = height * 4 / 3;
    const stageSize = getStageSize(isFullScreen, height, width);

    return (
        <Box className={isFullScreen ? styles.stageHeaderWrapperOverlay : styles.stageHeaderWrapper}>
            <Box
                className={styles.stageMenuWrapper}
                style={{ width: stageSize.width }}
            >
                <Controls
                    className={styles.controls}
                    vm={vm}
                    isFullScreen={isFullScreen}
                />
                {isFullScreen
                    ? <Fullscreen />
                    : <div
                        className={styles.menuWrapper}
                        role="navigation">
                        <MenuButton
                            orientation='vertical'
                            iconSvg={mailIcon}
                            external
                            linkTo="mailto:maus@wdr.de">
                            Feedback
                        </MenuButton>
                        <MenuButton
                            orientation='vertical'
                            iconSvg={saveIcon}
                            onClick={onSaveProject}
                        >
                            Speichern
                        </MenuButton>
                        <MenuButton
                            orientation='vertical'
                            className={styles.headerIcon}
                            iconSvg={menuIcon}
                            onClick={onOpenMenu}
                        >
                            Übersicht
                        </MenuButton>
                    </div>
                }
            </Box>
        </Box>
    );
};

StageHeaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool.isRequired,
    onOpenMenu: PropTypes.func.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(StageHeaderComponent);
