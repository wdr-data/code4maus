import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import { Fragment, Link } from 'redux-little-router';
import VM from '@wdr-data/scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import StageHeader from '../../containers/stage-header.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import ProjectSaver from '../../containers/project-saver.jsx';
import SBFileUploader from '../../containers/sb-file-uploader.jsx';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import EduStage from '../edu-stage/edu-stage.jsx';
import Input from '../forms/input.jsx';
import Loader, { Spinner } from '../loader/loader.jsx';
import ModalComponent from '../modal/modal.jsx';

import wdrLogo from '../../../assets/img/wdr_logo.svg';
import headLogo from '../../../assets/img/logo_text.png';
import soundsIcon from '../../../assets/icons/tab_sound.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import expandIcon from './expand_right@2x.svg';

import styles from './gui.css';
import { StageSizeConsumer } from '../../lib/stage-size-provider.jsx';

// Cache this value to only retreive it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = (props) => {
    /* eslint-disable no-unused-vars */
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
        closeSaveModal,
        saveProjectError,
        isSaving,
        projectName,
        eduLayerActive,
        eduId,
        ...componentProps
    } = props;
    /* eslint-enable */
    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected),
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (
        <Box
            className={styles.pageWrapper}
            {...componentProps}
        >
            {loading ? <Loader /> : null}
            {saveProjectVisible ?
                <ModalComponent
                    className={styles.saveModal}
                    contentLabel="Wie soll dein Spiel heißen?"
                    onRequestClose={onSaveModalClose}
                >
                    <Box className={styles.savingOverlay} hidden={!isSaving}>
                        <Spinner />
                    </Box>
                    <Input placeholder="Hier eintippen, wie dein Spiel heißen soll" onChange={(e) => onProjectNameChange(e.target.value)} value={projectName} />
                    <Box className={styles.saveModalActions}>
                        <p>{saveProjectError}</p>
                        <Button
                            onClick={() => onSaveProject().then(() => closeSaveModal())}
                            disabled={isSaving}
                        >
                            Speichern
                        </Button>
                    </Box>
                    <Box direction="row" justifyContent="center" style={{ display: 'flex' }}>
                        <ProjectSaver>{(downloadProject) =>
                            <Button className={styles.saveModalDownload} onClick={downloadProject}>
                                Projekt herunterladen
                            </Button>
                        }</ProjectSaver>
                        <SBFileUploader onSuccess={closeSaveModal}>{(_, renderFileInput, handleClick) => (
                            <Button className={styles.saveModalDownload} onClick={handleClick}>
                                Projekt hochladen
                                {renderFileInput()}
                            </Button>
                        )}</SBFileUploader>
                    </Box>
                </ModalComponent>
                : null
            }
            {isRendererSupported ? null : <WebGlModal />}
            <Box className={styles.header} role="header">
                <Box className={styles.column}>
                    <img
                        alt="Logo WDR"
                        title="Logo WDR"
                        className={styles.logo}
                        draggable={false}
                        src={wdrLogo}
                    />
                    <span
                        className={styles.breadcrumb}
                        aria-label="Brotkrümel Navigation"
                        role="navigation"
                    >
                        <Link href="/">Übersicht</Link>
                        <Fragment forRoute="/lernspiel/"><span>Lernspiel {eduId}</span></Fragment>
                        <Fragment forRoute="/projekt/"><span>Projekt {projectName}</span></Fragment>
                    </span>
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
                                    {targetIsStage ?
                                        <FormattedMessage
                                            defaultMessage="Backdrops"
                                            description="Button to get to the backdrops panel"
                                            id="gui.gui.backdropsTab"
                                        />
                                        :
                                        <FormattedMessage
                                            defaultMessage="Kostüme"
                                            description="Button to get to the costumes panel"
                                            id="gui.gui.costumesTab"
                                        />
                                    }
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
                        <TabPanel />
                        <TabPanel />
                        <TabPanel />
                    </Tabs>
                </Box>
                <Box className={styles.column}>
                    <img
                        role="heading"
                        alt="Programmieren mit der Maus"
                        title="Logo Programmieren mit der Maus"
                        className={styles.logoCenter}
                        draggable={false}
                        src={headLogo}
                    />
                </Box>
                <Box className={classNames(styles.column, styles.columnButtons)}>
                    <StageHeader vm={vm} />
                </Box>
            </Box>

            <Box className={styles.bodyWrapper} role="main">
                <Box className={styles.editorWrapper}>
                    <Tabs
                        className={tabClassNames.tabs}
                        forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
                        selectedIndex={activeTabIndex}
                        selectedTabClassName={tabClassNames.tabSelected}
                        selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                        onSelect={onActivateTab}
                    >
                        <TabList style={{ display: 'none' }}>
                            <Tab />
                            <Tab />
                            <Tab />
                        </TabList>
                        <TabPanel className={[ tabClassNames.tabPanel, styles.codePanelWrapper ]}>
                            <Box className={styles.codeTopRow}>
                                <Box className={styles.blocksWrapper} aria-label="Scratch Blocks">
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
                                    <Button
                                        onClick={onLayoutModeClick}
                                        className={styles.layoutSwitcher}
                                        outlined
                                    >
                                        <img
                                            alt="Coding Area vergrößern"
                                            className={styles.layoutSwitcherIcon}
                                            draggable={false}
                                            src={expandIcon}
                                        />
                                    </Button>
                                </Box>
                                <StageSizeConsumer>
                                    {(stageSize) => (
                                        <Box
                                            className={styles.stageAndTargetWrapper}
                                            style={{ width: stageSize.width }}
                                        >
                                            <StageWrapper
                                                isRendererSupported={isRendererSupported}
                                                stageSize={stageSize}
                                                vm={vm}
                                            />
                                            <EduStage />
                                        </Box>
                                    )}
                                </StageSizeConsumer>
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
    closeSaveModal: PropTypes.func.isRequired,
    onSaveModalClose: PropTypes.func,
    onNameInputChange: PropTypes.func,
    projectName: PropTypes.string,
    eduLayerActive: PropTypes.bool.isRequired,
    onSaveProject: PropTypes.func.isRequired,
    isSaving: PropTypes.bool,
    onProjectNameChange: PropTypes.func.isRequired,
    saveProjectError: PropTypes.string,
};
GUIComponent.defaultProps = {
    basePath: '/',
};
export default injectIntl(GUIComponent);
