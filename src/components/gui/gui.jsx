import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from '@wdr-data/scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';

import PreviewModal from '../../containers/preview-modal.jsx';
import ImportModal from '../../containers/import-modal.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import Cards from '../../containers/cards.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ModalComponent from '../modal/modal.jsx';
import Input from '../forms/input.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import EduStage from '../edu-stage/edu-stage.jsx';
import StageHeader from '../../containers/stage-header.jsx';
import ButtonWithIcon from '../../components/button-with-icon/button-with-icon.jsx';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';
import Button from '../button/button.jsx';
import fullScreenIcon from '../stage-header/icon--fullscreen.svg';
import arrowIcon from './arrow.svg';
import wdrLogo from '../../../assets/img/wdr_logo.svg';
import headLogo from '../../../assets/img/head_logo.png';
import menuIcon from './menue.svg';
import expandIcon from './expand_right@2x.svg';

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
        onSaveProject,
        soundsTabVisible,
        vm,
        onProjectNameChange,
        onSaveModalClose,
        saveProjectError,
        projectName,
        eduLayerActive,
        ...componentProps
    } = props;
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

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
                            <Input placeholder="Name deines Projektes" onChange={e => onProjectNameChange(e.target.value)} value={projectName} />
                            <Box className={styles.saveModalActions}>
                                <p>{saveProjectError}</p>
                                <Button className={styles.saveModalButton} onClick={() => onSaveProject().then(() => onSaveModalClose())}>Speichern</Button>
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
                <Box className={styles.header}>
                    <Box className={styles.column}>
                        <img
                            alt="WDR"
                            className={styles.logo}
                            draggable={false}
                            src={wdrLogo}
                        />
                        <Tabs
                            forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
                            selectedIndex={activeTabIndex}
                            selectedTabClassName={tabClassNames.tabSelected}
                            selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                            onSelect={onActivateTab}
                        >
                            <TabList className={tabClassNames.tabList}>
                                <Tab className={tabClassNames.tab}>
                                    <Box className={styles.tabContent}>
                                        <img
                                            draggable={false}
                                            src={codeIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Code"
                                            description="Button to get to the code panel"
                                            id="gui.gui.codeTab"
                                        />
                                    </Box>
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateCostumesTab}
                                >
                                    <Box className={styles.tabContent}>
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
                                                    defaultMessage="Kostüme"
                                                    description="Button to get to the costumes panel"
                                                    id="gui.gui.costumesTab"
                                                />
                                            )}
                                    </Box>
                                </Tab>
                                <Tab
                                    className={tabClassNames.tab}
                                    onClick={onActivateSoundsTab}
                                >
                                    <Box className={styles.tabContent}>
                                        <img
                                            draggable={false}
                                            src={soundsIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Töne"
                                            description="Button to get to the sounds panel"
                                            id="gui.gui.soundsTab"
                                        />
                                    </Box>
                                </Tab>
                            </TabList>
                        </Tabs>
                    </Box>
                    <Box className={styles.column}>
                        <img
                            alt="head"
                            className={styles.logoCenter}
                            draggable={false}
                            src={headLogo}
                        />
                    </Box>
                    <Box className={styles.column}>
                        <ButtonWithIcon
                            className={styles.menuButton}
                            iconSrc={menuIcon}
                            children={'Übersicht'}
                        />
                        <Box className={styles.stageMenuWrapper}>
                            <StageHeader vm={vm} />
                        </Box>
                    </Box>
                </Box>

                <Box className={styles.bodyWrapper}>
                    <Box className={styles.editorWrapper}>
                        <Tabs
                            className={tabClassNames.tabs}
                            forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
                            selectedIndex={activeTabIndex}
                            selectedTabClassName={tabClassNames.tabSelected}
                            selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                            onSelect={onActivateTab}
                        >
                            <TabPanel className={[tabClassNames.tabPanel, styles.codePanelWrapper]}>
                                <Box className={styles.codeTopRow}>
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            grow={1}
                                            isVisible={blocksTabVisible}
                                            options={{
                                                media: `${basePath}static/blocks-media/`,
                                                gridOptions: false,
                                            }}
                                            vm={vm}
                                        />
                                        {!props.eduLayerActive ? null : <TargetPane vm={vm} />}
                                        <Button onClick={onLayoutModeClick} className={styles.layoutSwitcher}>
                                            <img
                                                alt="WDR"
                                                className={styles.layoutSwitcherIcon}
                                                draggable={false}
                                                src={expandIcon}
                                            />
                                        </Button>
                                    </Box>
                                    <Box className={styles.stageAndTargetWrapper}>
                                        <StageWrapper
                                            isRendererSupported={isRendererSupported}
                                            vm={vm}
                                        />
                                        <EduStage />
                                    </Box>
                                </Box>
                                {props.eduLayerActive ? null : <TargetPane vm={vm} />}
                            </TabPanel>
                            <TabPanel className={tabClassNames.tabPanel}>
                                {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                            </TabPanel>
                            <TabPanel className={tabClassNames.tabPanel}>
                                {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                            </TabPanel>
                        </Tabs>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
};
GUIComponent.propTypes = {
    activeTabIndex: PropTypes.number,
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
    projectName: PropTypes.string,
    eduLayerActive: PropTypes.bool.isRequired,
};
GUIComponent.defaultProps = {
    basePath: '/'
};
export default injectIntl(GUIComponent);
