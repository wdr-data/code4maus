import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';

import Backpack from '../../containers/backpack.jsx';
import PreviewModal from '../../containers/preview-modal.jsx';
import ImportModal from '../../containers/import-modal.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import Cards from '../../containers/cards.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ModalComponent from '../modal/modal.jsx';
import Input from '../forms/input.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import EduStage from '../edu-stage/edu-stage.jsx';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';
import Button from '../button/button.jsx';
import fullScreenIcon from '../stage-header/icon--fullscreen.svg';
import arrowIcon from './arrow.svg'

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

// Cache this value to only retreive it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        activeTabIndex,
        basePath,
        backpackOptions,
        blocksTabVisible,
        cardsVisible,
        children,
        costumesTabVisible,
        enableCommunity,
        importInfoVisible,
        saveProjectVisible,
        intl,
        isPlayerOnly,
        loading,
        onExtensionButtonClick,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onLayoutModeClick,
        previewInfoVisible,
        targetIsStage,
        saveProject,
        soundsTabVisible,
        vm,
        onNameInputChange,
        onSaveModalClose,
        onSaveModalError,
        saveModalError,
        projectName,
        ...componentProps
    } = props;
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const calcHeight = () =>
        (window.innerHeight - layout.topBarHeight - layout.stageHeaderHeight - 8) / 2;
    const calcWidth = () =>
        window.innerWidth / 3 - (8 * 2);

    const saveAction = () => {
        onSaveModalError("");
        saveProject().then(() => onSaveModalClose()).catch(e => onSaveModalError(e.message));
    };

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return isPlayerOnly ? (
        <StageWrapper
            isRendererSupported={isRendererSupported}
            vm={vm}
        />
    ) : (
        <Box
            className={styles.pageWrapper}
            {...componentProps}
        >
            {loading ? (
                <Loader />
            ) : null}
            {saveProjectVisible ? (
                <ModalComponent
                    className={styles.saveModal}
                    contentLabel="Lege einen Namen fest"
                    onRequestClose={onSaveModalClose}
                >
                    <Box className={styles.saveModalBox}>
                        <Input placeholder="Name deines Projektes" onChange={onNameInputChange} value={projectName} />
                        <Box className={styles.saveModalActions}>
                            <p>{saveModalError}</p>
                            <Button className={styles.saveModalButton} onClick={saveAction}>Speichern</Button>
                        </Box>
                        <ProjectSaver>{downloadProject => (
                            <Button className={styles.saveModalDownload} onClick={downloadProject}>
                                Projekt herunterladen
                            </Button>
                        )}</ProjectSaver>
                    </Box>
                </ModalComponent>
            ) : null}
            {isRendererSupported ? null : (
                <WebGlModal />
            )}
            <MenuBar />
            <Box className={styles.bodyWrapper}>
                <Box className={styles.flexWrapper}>
                    <Box className={styles.editorWrapper}>
                        <Tabs
                            className={tabClassNames.tabs}
                            forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
                            selectedIndex={activeTabIndex}
                            selectedTabClassName={tabClassNames.tabSelected}
                            selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                            onSelect={onActivateTab}
                        >
                            <TabList className={tabClassNames.tabList}>
                                <Tab className={tabClassNames.tab}>
                                    <img
                                        draggable={false}
                                        src={codeIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="Code"
                                        description="Button to get to the code panel"
                                        id="gui.gui.codeTab"
                                    />
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateCostumesTab}
                                >
                                    <img
                                        draggable={false}
                                        src={costumesIcon}
                                    />
                                    {targetIsStage ? (
                                        <FormattedMessage
                                            defaultMessage="Backdrops"
                                            description="Button to get to the backdrops panel"
                                            id="gui.gui.backdropsTab"
                                        />
                                    ) : (
                                        <FormattedMessage
                                            defaultMessage="Costumes"
                                            description="Button to get to the costumes panel"
                                            id="gui.gui.costumesTab"
                                        />
                                    )}
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateSoundsTab}
                                >
                                    <img
                                        draggable={false}
                                        src={soundsIcon}
                                    />
                                    <FormattedMessage
                                        defaultMessage="Sounds"
                                        description="Button to get to the sounds panel"
                                        id="gui.gui.soundsTab"
                                    />
                                </Tab>
                            </TabList>
                            <TabPanel className={tabClassNames.tabPanel}>
                                <Box className={styles.blocksWrapper}>
                                    <Blocks
                                        grow={1}
                                        isVisible={blocksTabVisible}
                                        options={{
                                            media: `${basePath}static/blocks-media/`
                                        }}
                                        vm={vm}
                                    />
                                    <Box className={styles.targetWrapper}>
                                        <TargetPane
                                            vm={vm}
                                        />
                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel className={tabClassNames.tabPanel}>
                                {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                            </TabPanel>
                            <TabPanel className={tabClassNames.tabPanel}>
                                {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                            </TabPanel>
                        </Tabs>
                        {backpackOptions.visible ? (
                            <Backpack host={backpackOptions.host} />
                        ) : null}
                        <Button onClick={onLayoutModeClick} className={styles.layoutSwitcher}>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 438.533 438.533" xmlSpace="preserve">
                                <g><path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0   c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267   c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407   s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062   C438.533,179.485,428.732,142.795,409.133,109.203z M288.646,306.913c3.621,3.614,5.435,7.901,5.435,12.847   c0,4.948-1.813,9.236-5.435,12.847l-29.126,29.13c-3.61,3.617-7.891,5.428-12.84,5.421c-4.951,0-9.232-1.811-12.854-5.421   L104.21,232.111c-3.617-3.62-5.424-7.898-5.424-12.848c0-4.949,1.807-9.233,5.424-12.847L233.826,76.795   c3.621-3.615,7.902-5.424,12.854-5.424c4.949,0,9.229,1.809,12.84,5.424l29.126,29.13c3.621,3.615,5.435,7.898,5.435,12.847   c0,4.946-1.813,9.233-5.435,12.845l-87.646,87.65L288.646,306.913z" fill="#c7821a"/></g>
                            </svg>
                        </Button>
                    </Box>

                    <Box className={styles.stageAndTargetWrapper}>
                        <StageWrapper
                            isRendererSupported={isRendererSupported}
                            vm={vm}
                        />
                        <Box className={styles.targetWrapper}>
                            <TargetPane vm={vm} />
                        </Box>
                        <EduStage />
                    </Box>
                </Box>
            </Box>
            <DragLayer />
        </Box>
    );
};
GUIComponent.propTypes = {
    activeTabIndex: PropTypes.number,
    backpackOptions: PropTypes.shape({
        host: PropTypes.string,
        visible: PropTypes.bool
    }),
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    importInfoVisible: PropTypes.bool,
    saveProjectVisible: PropTypes.bool,
    intl: intlShape.isRequired,
    isPlayerOnly: PropTypes.bool,
    loading: PropTypes.bool,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLayoutModeClick: PropTypes.func,
    onTabSelect: PropTypes.func,
    previewInfoVisible: PropTypes.bool,
    saveProject: PropTypes.func,
    soundsTabVisible: PropTypes.bool,
    targetIsStage: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    onSaveModalClose: PropTypes.func,
    onNameInputChange: PropTypes.func,
    projectName: PropTypes.string
};
GUIComponent.defaultProps = {
    backpackOptions: {
        host: null,
        visible: false
    },
    basePath: './'
};
export default injectIntl(GUIComponent);
