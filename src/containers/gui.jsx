import AudioEngine from 'scratch-audio';
import PropTypes from 'prop-types';
import React from 'react';
import VM from '@wdr-data/scratch-vm';
import { connect } from 'react-redux';

import { openExtensionLibrary, closeSaveProject } from '../reducers/modals';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX,
} from '../reducers/editor-tab';

import EduLoaderHOC from '../lib/edu-loader-hoc.jsx';
import ProjectLoaderHOC from '../lib/project-loader-hoc.jsx';
import ProjectSaveHOC from '../lib/project-save-hoc.jsx';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';
import onboardingRefsHOC from './onboarding-refs-provider.jsx';

import GUIComponent from '../components/gui/gui.jsx';
import { toggleLayoutMode } from '../reducers/layout-mode';

class GUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: !props.vm.initialized,
            loadingError: false,
            errorMessage: '',
        };
    }
    componentDidMount() {
        if (this.props.vm.initialized) {
            return;
        }

        this.audioEngine = new AudioEngine();
        this.props.vm.attachAudioEngine(this.audioEngine);
        this.loadProject();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.projectData === this.props.projectData) {
            return;
        }

        this.loadProject();
    }
    loadProject() {
        if (this.props.fetchingProject) {
            return;
        }

        this.setState({ loading: true }, () => {
            this.props.vm.loadProject(this.props.projectData)
                .then(() => {
                    this.setState({ loading: false });
                    if (!this.props.vm.initialized) {
                        this.props.vm.setCompatibilityMode(true);
                        this.props.vm.start();
                        this.props.vm.initialized = true;
                    }
                })
                .catch((e) => {
                    // Need to catch this error and update component state so that
                    // error page gets rendered if project failed to load
                    this.setState({ loadingError: true, errorMessage: e });
                });
        });
    }
    componentWillUnmount() {
        this.props.vm.stopAll();
    }
    render() {
        if (this.state.loadingError) {
            throw new Error(
                `Failed to load project from server: ${this.state.errorMessage}`);
        }
        const {
            children,
            fetchingProject,
            loadingStateVisible,
            projectData, // eslint-disable-line no-unused-vars
            vm,
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || this.state.loading || loadingStateVisible}
                vm={vm}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    ...GUIComponent.propTypes,
    fetchingProject: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    projectData: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
    vm: PropTypes.instanceOf(VM),
};

GUI.defaultProps = GUIComponent.defaultProps;

const mapStateToProps = (state) => ({
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    cardsVisible: state.scratchGui.cards.visible,
    costumesTabVisible: state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
    importInfoVisible: state.scratchGui.modals.importInfo,
    loadingStateVisible: state.scratchGui.modals.loadingProject,
    previewInfoVisible: state.scratchGui.modals.previewInfo,
    targetIsStage:
        state.scratchGui.targets.stage &&
        state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget,
    soundsTabVisible: state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
    layoutmode: state.scratchGui.layoutMode,
    saveProjectVisible: state.scratchGui.modals.saveProject,
    eduLayerActive: state.scratchGui.eduLayer.enabled,
});

const mapDispatchToProps = (dispatch) => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: (tab) => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onLayoutModeClick: () => dispatch(toggleLayoutMode()),
    onSaveModalClose: () => dispatch(closeSaveProject()),
});

const ConnectedGUI = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GUI);

const WrappedGui = EduLoaderHOC(ProjectLoaderHOC(ProjectSaveHOC(vmListenerHOC(onboardingRefsHOC(ConnectedGUI)))));

export default WrappedGui;
