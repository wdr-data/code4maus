import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import tabStyles from 'react-tabs/style/react-tabs.css'
import { Fragment as RouterFragment, Link } from 'redux-little-router'
import VM from 'scratch-vm'
import Renderer from 'scratch-render'
import AudioEngine from 'scratch-audio'

import Blocks from '../../containers/blocks.jsx'
import CostumeTab from '../../containers/costume-tab.jsx'
import DragLayer from '../../containers/drag-layer.jsx'
import WebGlModal from '../../containers/webgl-modal.jsx'
import StageHeader from '../../containers/stage-header.jsx'
import StageWrapper from '../../containers/stage-wrapper.jsx'
import SoundTab from '../../containers/sound-tab.jsx'
import TargetPane from '../../containers/target-pane.jsx'
import ProjectSaver from '../../containers/project-saver.jsx'
import SBFileUploader from '../../containers/sb-file-uploader.jsx'

import Button from '../button/button.jsx'
import EduStage from '../edu-stage/edu-stage.jsx'
import Input from '../forms/input.jsx'
import Loader, { Spinner } from '../loader/loader.jsx'
import ModalComponent from '../modal/modal.jsx'

import wdrLogo from '../../../assets/img/wdr_logo.svg'
import headLogo from '../../../assets/img/logo_text.png'
import soundsIcon from '../../../assets/icons/tab_sound.svg'
import { StageSizeConsumer } from '../../lib/stage-size-provider.jsx'
import codeIcon from './icon--code.svg'
import costumesIcon from './icon--costumes.svg'
import expandIcon from './expand_right@2x.svg'

import styles from './gui.css'

// Cache this value to only retreive it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null

const GUIComponent = (props) => {
  /* eslint-disable no-unused-vars, react/prop-types */
  const {
    activeTabIndex,
    basePath,
    blocksTabVisible,
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
    projectData,
    projectId,
    cancelSave,
    setProjectName,
    onSetUnchanged,
    fileInputRef,
    ...componentProps
  } = props
  /* eslint-enable */

  vm.attachAudioEngine(new AudioEngine());

  if (children) {
    return <div {...componentProps}>{children}</div>
  }

  const offline = navigator.onLine

  const tabClassNames = {
    tabs: styles.tabs,
    tab: classNames(tabStyles.reactTabsTab, styles.tab),
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(
      tabStyles.reactTabsTabPanelSelected,
      styles.isSelected
    ),
    tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected),
  }

  if (isRendererSupported === null) {
    isRendererSupported = Renderer.isSupported()
  }

  return (
    <div className={styles.pageWrapper} {...componentProps}>
      {loading ? <Loader /> : null}
      {saveProjectVisible ? (
        <ModalComponent
          className={styles.saveModal}
          contentLabel="Wie soll dein Spiel heißen?"
          onRequestClose={onSaveModalClose}
        >
          <div className={styles.savingOverlay} hidden={!isSaving}>
            <Spinner />
          </div>
          <Input
            placeholder="Hier eintippen, wie dein Spiel heißen soll"
            id="save_input"
            onChange={(e) => onProjectNameChange(e.target.value)}
            value={projectName}
          />
          {offline ? (
            <div className={styles.saveModalActions}>
              <p>{saveProjectError}</p>
              <Button
                style="primary"
                onClick={() => onSaveProject().then(() => closeSaveModal())}
                disabled={isSaving}
              >
                Speichern
              </Button>
            </div>
          ) : (
            <div className={styles.saveModalActions}>
              <FormattedMessage
                defaultMessage="Du bist aktuell Offline und kannst deine Arbeit nur auf deinen Rechner runterladen und nicht im Internet speichern"
                id="gui.gui.offline"
              />
            </div>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <ProjectSaver name={projectName}>
              {(downloadProject) => (
                <Button
                  style="secondary"
                  className={styles.saveModalDownload}
                  onClick={downloadProject}
                >
                  Projekt herunterladen
                </Button>
              )}
            </ProjectSaver>
            <SBFileUploader onSuccess={closeSaveModal}>
              {(_, renderFileInput, handleClick) => (
                <Button
                  style="secondary"
                  className={styles.saveModalDownload}
                  onClick={handleClick}
                >
                  Projekt hochladen
                  {renderFileInput()}
                </Button>
              )}
            </SBFileUploader>
          </div>
        </ModalComponent>
      ) : null}
      {isRendererSupported ? null : <WebGlModal />}
      <div className={styles.header} role="header">
        <div className={styles.column}>
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
            <RouterFragment forRoute="/lernspiel/">
              <span>Lernspiel {eduId}</span>
            </RouterFragment>
            <RouterFragment forRoute="/projekt/">
              <span>Projekt {projectName}</span>
            </RouterFragment>
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
                <div className={styles.tabContent}>
                  <img draggable={false} src={codeIcon} />
                  <FormattedMessage
                    defaultMessage="Code"
                    description="Button to get to the code panel"
                    id="gui.gui.codeTab"
                  />
                </div>
              </Tab>
              <Tab
                className={tabClassNames.tab}
                onClick={onActivateCostumesTab}
              >
                <div className={styles.tabContent}>
                  <img draggable={false} src={costumesIcon} />
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
                </div>
              </Tab>
              <Tab className={tabClassNames.tab} onClick={onActivateSoundsTab}>
                <div className={styles.tabContent}>
                  <img draggable={false} src={soundsIcon} />
                  <FormattedMessage
                    defaultMessage="Töne"
                    description="Button to get to the sounds panel"
                    id="gui.gui.soundsTab"
                  />
                </div>
              </Tab>
            </TabList>
            <TabPanel />
            <TabPanel />
            <TabPanel />
          </Tabs>
        </div>
        <div className={styles.column}>
          <img
            role="heading"
            alt="Programmieren mit der Maus"
            title="Logo Programmieren mit der Maus"
            className={styles.logoCenter}
            draggable={false}
            src={headLogo}
          />
        </div>
        <div className={classNames(styles.column, styles.columnButtons)}>
          <StageHeader vm={vm} />
        </div>
      </div>

      <div className={styles.bodyWrapper} role="main">
        <div className={styles.editorWrapper}>
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
            <TabPanel
              className={[tabClassNames.tabPanel, styles.codePanelWrapper]}
            >
              <div className={styles.codeTopRow}>
                <div
                  className={styles.blocksWrapper}
                  aria-label="Scratch Blocks"
                >
                  <Blocks
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
                  >
                    <img
                      alt="Coding Area vergrößern"
                      className={styles.layoutSwitcherIcon}
                      draggable={false}
                      src={expandIcon}
                      title="Coding Area"
                    />
                  </Button>
                </div>
                <StageSizeConsumer>
                  {(stageSize) => (
                    <div
                      className={styles.stageAndTargetWrapper}
                      style={{ width: stageSize.width }}
                    >
                      <StageWrapper
                        isRendererSupported={isRendererSupported}
                        stageSize={stageSize}
                        vm={vm}
                      />
                      <EduStage />
                    </div>
                  )}
                </StageSizeConsumer>
              </div>
              {props.eduLayerActive ? null : <TargetPane vm={vm} />}
            </TabPanel>
            <TabPanel className={tabClassNames.tabPanel}>
              {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
            </TabPanel>
            <TabPanel className={tabClassNames.tabPanel}>
              {soundsTabVisible ? <SoundTab vm={vm} /> : null}
            </TabPanel>
          </Tabs>
        </div>
      </div>
      <DragLayer />
    </div>
  )
}
GUIComponent.propTypes = {
  activeTabIndex: PropTypes.number,
  basePath: PropTypes.string,
  blocksTabVisible: PropTypes.bool,
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
  eduId: PropTypes.string,
}
GUIComponent.defaultProps = {
  basePath: '/',
}
export default injectIntl(GUIComponent)
