import AudioEngine from 'scratch-audio'
import SharedAudioContext from 'audio-context'
import PropTypes from 'prop-types'
import React from 'react'
import VM from 'scratch-vm'
import { connect } from 'react-redux'
import flow from 'lodash.flowright'

import { openExtensionLibrary, closeSaveProject } from '../reducers/modals'
import {
  activateTab,
  BLOCKS_TAB_INDEX,
  COSTUMES_TAB_INDEX,
  SOUNDS_TAB_INDEX,
} from '../reducers/editor-tab'

import EduLoaderHOC from '../lib/edu-loader-hoc.jsx'
import ProjectLoaderHOC from '../lib/project-loader-hoc.jsx'
import ProjectSaveHOC from '../lib/project-save-hoc.jsx'
import vmListenerHOC from '../lib/vm-listener-hoc.jsx'
import UnsavedProjectBlockerHOC from '../lib/unsaved-project-blocker.jsx'
import { StageSizeProviderHOC } from '../lib/stage-size-provider.jsx'

import GUIComponent from '../components/gui/gui.jsx'
import { toggleLayoutMode } from '../reducers/layout-mode'
import { setProjectUnchanged } from '../reducers/project-changed'

class GUI extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: !props.vm.initialized,
      loadingError: false,
      errorMessage: '',
    }

    this.handleSaveModalClose = this.handleSaveModalClose.bind(this)

    // Ensure audio context is set up before music extension loads
    const audioEngine = new AudioEngine(new SharedAudioContext())
    this.props.vm.attachAudioEngine(audioEngine)
    this.props.vm.setLocale(this.props.locale, this.props.messages)

    // When loading projects, scratch enables the extension automatically
    // Loading it like this breaks it somehow
    if (!(this.props.projectData || this.props.fetchingProject)) {
      console.log('Enabling music extension...')
      this.props.vm.extensionManager.loadExtensionIdSync('music')
      console.log('🎵 Music on')
    }
  }
  componentDidMount() {
    if (this.props.vm.initialized) {
      return
    }

    if (this.props.projectData) {
      this.loadProject()
    }
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.projectData !== this.props.projectData ||
      // force clearing workspace after fetching
      (!this.props.fetchingProject &&
        prevProps.fetchingProject !== this.props.fetchingProject)
    ) {
      this.loadProject()
    }
  }
  loadProject() {
    this.setState({ loading: true }, () => {
      this.props.vm
        .loadProject(this.props.projectData)
        .then(() => {
          this.setState({ loading: false })
          if (!this.props.vm.initialized) {
            this.props.vm.setCompatibilityMode(true)
            this.props.vm.start()
            this.props.vm.initialized = true
          }
          setTimeout(() => this.props.onSetUnchanged(), 100)
        })
        .catch((e) => {
          // Need to catch this error and update component state so that
          // error page gets rendered if project failed to load
          this.setState({ loadingError: true, errorMessage: e })
        })
    })
  }
  componentWillUnmount() {
    this.props.vm.stopAll()
  }
  handleSaveModalClose() {
    this.props.cancelSave()
    this.props.closeSaveModal()
  }
  render() {
    if (this.state.loadingError) {
      throw new Error(
        `Failed to load project from server: ${this.state.errorMessage}`
      )
    }
    const {
      cancelSave, // eslint-disable-line no-unused-vars
      children,
      fetchingProject,
      loadingStateVisible,
      onSetUnchanged, // eslint-disable-line no-unused-vars
      projectData, // eslint-disable-line no-unused-vars
      vm,
      ...componentProps
    } = this.props
    return (
      <GUIComponent
        loading={fetchingProject || this.state.loading || loadingStateVisible}
        onSaveModalClose={this.handleSaveModalClose}
        vm={vm}
        {...componentProps}
      >
        {children}
      </GUIComponent>
    )
  }
}

GUI.propTypes = {
  ...GUIComponent.propTypes,
  fetchingProject: PropTypes.bool,
  loadingStateVisible: PropTypes.bool,
  projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  vm: PropTypes.instanceOf(VM).isRequired,
  cancelSave: PropTypes.func.isRequired,
}

GUI.defaultProps = GUIComponent.defaultProps

const mapStateToProps = (state) => ({
  activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
  blocksTabVisible:
    state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
  costumesTabVisible:
    state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
  importInfoVisible: state.scratchGui.modals.importInfo,
  loadingStateVisible: state.scratchGui.modals.loadingProject,
  previewInfoVisible: state.scratchGui.modals.previewInfo,
  targetIsStage:
    state.scratchGui.targets.stage &&
    state.scratchGui.targets.stage.id ===
      state.scratchGui.targets.editingTarget,
  soundsTabVisible:
    state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
  layoutmode: state.scratchGui.layoutMode,
  saveProjectVisible: state.scratchGui.modals.saveProject,
  eduLayerActive: state.scratchGui.eduLayer.enabled,
  eduId: state.scratchGui.eduLayer.gameId,
})

const mapDispatchToProps = (dispatch) => ({
  closeSaveModal: () => dispatch(closeSaveProject()),
  onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
  onActivateTab: (tab) => dispatch(activateTab(tab)),
  onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
  onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
  onLayoutModeClick: () => dispatch(toggleLayoutMode()),
  onSetUnchanged: () => dispatch(setProjectUnchanged()),
})

const ConnectedGUI = connect(mapStateToProps, mapDispatchToProps)(GUI)

// eslint-disable-next-line new-cap
const WrappedGui = flow([
  EduLoaderHOC,
  ProjectSaveHOC,
  vmListenerHOC,
  ProjectLoaderHOC,
  StageSizeProviderHOC,
  UnsavedProjectBlockerHOC,
])(ConnectedGUI)

export default WrappedGui
