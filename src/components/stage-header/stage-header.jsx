import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import VM from '@wdr-data/scratch-vm';
import { Link } from 'redux-little-router';

import Controls from '../../containers/controls.jsx';
import Fullscreen from '../../containers/fullscreen.jsx';
import Box from '../box/box.jsx';
import ButtonWithIcon from '../button-with-icon/button-with-icon.jsx';
import MenuButton from '../menu-button/menu-button.jsx';

import saveIcon from '!raw-loader!../../../assets/icons/header_save.svg';
import menuIcon from '!raw-loader!../../../assets/icons/header_menu.svg';
import mailIcon from '!raw-loader!../../../assets/icons/menu_impressum.svg';
import styles from './stage-header.css';
import { StageSizeConsumer } from '../../lib/stage-size-provider.jsx';

const StageHeaderComponent = function(props) {
    const {
        isFullScreen,
        onSaveProject,
        vm,
    } = props;

    return (
        <StageSizeConsumer>
            {(stageSize) => (
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
                            :
                            <div className={styles.flexWrapper}>
                                <div className={styles.copyrightWrapper}>
                                    <Link href="/inhalte/impressum/" className={styles.copyright}>
                                        <span>&#9400; WDR {(new Date().getFullYear())}</span>
                                    </Link>
                                </div>
                                <div
                                    className={styles.menuWrapper}
                                    role="navigation"
                                >
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
                                        linkTo='/'
                                        className={styles.headerIcon}
                                        iconSvg={menuIcon}
                                    >
                                        Übersicht
                                    </MenuButton>
                                </div>
                            </div>
                        }
                    </Box>
                </Box>
            )}
        </StageSizeConsumer>
    );
};

StageHeaderComponent.propTypes = {
    intl: intlShape,
    isFullScreen: PropTypes.bool.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(StageHeaderComponent);
