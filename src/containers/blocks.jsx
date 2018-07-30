import bindAll from 'lodash.bindall';
import debounce from 'lodash.debounce';
import defaultsDeep from 'lodash.defaultsdeep';
import makeToolboxXML from '../lib/make-toolbox-xml';
import PropTypes from 'prop-types';
import React from 'react';
import VMScratchBlocks from '../lib/blocks';
import VM from '@wdr-data/scratch-vm';

import Prompt from './prompt.jsx';
import BlocksComponent from '../components/blocks/blocks.jsx';
import ExtensionLibrary from './extension-library.jsx';
import CustomProcedures from './custom-procedures.jsx';
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';

import { connect } from 'react-redux';
import { updateToolbox } from '../reducers/toolbox';
import { activateColorPicker } from '../reducers/color-picker';
import { closeExtensionLibrary } from '../reducers/modals';
import { activateCustomProcedures, deactivateCustomProcedures } from '../reducers/custom-procedures';
import { OnboardingCapture } from './onboarding-refs-provider.jsx';
import { TRIGGER_REFS } from '../lib/onboarding/config';

const addFunctionListener = (object, property, callback) => {
    const oldFn = object[property];
    object[property] = function() {
        const result = oldFn.apply(this, arguments);
        callback.apply(this, result);
        return result;
    };
};

class Blocks extends React.Component {
    constructor(props) {
        super(props);
        this.ScratchBlocks = VMScratchBlocks(props.vm);
        bindAll(this, [
            'attachVM',
            'detachVM',
            'handleCategorySelected',
            'handlePromptStart',
            'handlePromptCallback',
            'handlePromptClose',
            'handleCustomProceduresClose',
            'onScriptGlowOn',
            'onScriptGlowOff',
            'onBlockGlowOn',
            'onBlockGlowOff',
            'handleExtensionAdded',
            'handleBlocksInfoUpdate',
            'onTargetsUpdate',
            'onVisualReport',
            'onWorkspaceUpdate',
            'onWorkspaceMetricsChange',
            'setBlocks',
        ]);
        this.ScratchBlocks.prompt = this.handlePromptStart;
        this.state = {
            workspaceMetrics: {},
            prompt: null,
        };
        this.onTargetsUpdate = debounce(this.onTargetsUpdate, 100);
        this.toolboxUpdateQueue = [];
    }
    componentDidMount() {
        this.ScratchBlocks.FieldColourSlider.activateEyedropper_ = this.props.onActivateColorPicker;
        this.ScratchBlocks.Procedures.externalProcedureDefCallback = this.props.onActivateCustomProcedures;

        const workspaceConfig = defaultsDeep({},
            Blocks.defaultOptions,
            this.props.options,
            { toolbox: this.props.toolboxXML }
        );
        this.workspace = this.ScratchBlocks.inject(this.blocks, workspaceConfig);

        // we actually never want the workspace to enable "refresh toolbox" - this basically re-renders the
        // entire toolbox every time we reset the workspace.  We call updateToolbox as a part of
        // componentDidUpdate so the toolbox will still correctly be updated
        this.setToolboxRefreshEnabled = this.workspace.setToolboxRefreshEnabled.bind(this.workspace);
        this.workspace.setToolboxRefreshEnabled = () => {
            this.setToolboxRefreshEnabled(false);
        };

        // @todo change this when blockly supports UI events
        addFunctionListener(this.workspace, 'translate', this.onWorkspaceMetricsChange);
        addFunctionListener(this.workspace, 'zoom', this.onWorkspaceMetricsChange);

        this.attachVM();
        this.props.vm.setLocale(this.props.locale, this.props.messages);

        const toolbox = this.workspace.getToolbox();
        if (toolbox) {
            this.props.captureFlyoutRef(toolbox.flyout_.svgGroup_);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.state.prompt !== nextState.prompt ||
            this.props.isVisible !== nextProps.isVisible ||
            this.props.toolboxXML !== nextProps.toolboxXML ||
            this.props.extensionLibraryVisible !== nextProps.extensionLibraryVisible ||
            this.props.customProceduresVisible !== nextProps.customProceduresVisible ||
            this.props.locale !== nextProps.locale ||
            this.props.anyModalVisible !== nextProps.anyModalVisible ||
            this.props.layoutMode !== nextProps.layoutMode
        );
    }
    componentDidUpdate(prevProps) {
        // If any modals are open, call hideChaff to close z-indexed field editors
        if (this.props.anyModalVisible && !prevProps.anyModalVisible) {
            this.ScratchBlocks.hideChaff();
        }

        if (prevProps.locale !== this.props.locale) {
            this.props.vm.setLocale(this.props.locale, this.props.messages);
        }

        if (prevProps.layoutMode !== this.props.layoutMode) {
            setTimeout(() => {
                this.props.vm.refreshWorkspace();
                window.dispatchEvent(new Event('resize'));
            });
        }

        if (prevProps.toolboxXML !== this.props.toolboxXML) {
            // rather than update the toolbox "sync" -- update it in the next frame
            clearTimeout(this.toolboxUpdateTimeout);
            this.toolboxUpdateTimeout = setTimeout(() => {
                this.updateToolbox();
            }, 0);
        }
        if (this.props.isVisible === prevProps.isVisible) {
            return;
        }
        // @todo hack to resize blockly manually in case resize happened while hidden
        // @todo hack to reload the workspace due to gui bug #413
        if (this.props.isVisible) { // Scripts tab
            this.workspace.setVisible(true);
            this.props.vm.refreshWorkspace();
            // Re-enable toolbox refreshes without causing one. See #updateToolbox for more info.
            this.workspace.toolboxRefreshEnabled_ = true;
            window.dispatchEvent(new Event('resize'));
        } else {
            this.workspace.setVisible(false);
        }
    }
    componentWillUnmount() {
        this.detachVM();
        this.workspace.dispose();
        clearTimeout(this.toolboxUpdateTimeout);
    }

    updateToolbox() {
        this.toolboxUpdateTimeout = false;

        const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
        const offset = this.workspace.toolbox_.getCategoryScrollOffset();
        this.workspace.updateToolbox(this.props.toolboxXML);
        // In order to catch any changes that mutate the toolbox during "normal runtime"
        // (variable changes/etc), re-enable toolbox refresh.
        // Using the setter function will rerender the entire toolbox which we just rendered.
        this.workspace.toolboxRefreshEnabled_ = true;

        const currentCategoryPos = this.workspace.toolbox_.getCategoryPositionById(categoryId);
        const currentCategoryLen = this.workspace.toolbox_.getCategoryLengthById(categoryId);
        if (offset < currentCategoryLen) {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos + offset);
        } else {
            this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
        }

        const queue = this.toolboxUpdateQueue;
        this.toolboxUpdateQueue = [];
        queue.forEach((fn) => fn());
    }

    withToolboxUpdates(fn) {
        // if there is a queued toolbox update, we need to wait
        if (this.toolboxUpdateTimeout) {
            this.toolboxUpdateQueue.push(fn);
        } else {
            fn();
        }
    }

    attachVM() {
        this.workspace.addChangeListener(this.props.vm.blockListener);
        this.flyoutWorkspace = this.workspace
            .getFlyout()
            .getWorkspace();
        this.flyoutWorkspace.addChangeListener(this.props.vm.flyoutBlockListener);
        this.flyoutWorkspace.addChangeListener(this.props.vm.monitorBlockListener);
        this.props.vm.addListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.addListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.addListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.addListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.addListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.addListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.addListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.addListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.addListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
    }
    detachVM() {
        this.props.vm.removeListener('SCRIPT_GLOW_ON', this.onScriptGlowOn);
        this.props.vm.removeListener('SCRIPT_GLOW_OFF', this.onScriptGlowOff);
        this.props.vm.removeListener('BLOCK_GLOW_ON', this.onBlockGlowOn);
        this.props.vm.removeListener('BLOCK_GLOW_OFF', this.onBlockGlowOff);
        this.props.vm.removeListener('VISUAL_REPORT', this.onVisualReport);
        this.props.vm.removeListener('workspaceUpdate', this.onWorkspaceUpdate);
        this.props.vm.removeListener('targetsUpdate', this.onTargetsUpdate);
        this.props.vm.removeListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.removeListener('BLOCKSINFO_UPDATE', this.handleBlocksInfoUpdate);
    }

    updateToolboxBlockValue(id, value) {
        this.withToolboxUpdates(() => {
            const block = this.workspace
                .getFlyout()
                .getWorkspace()
                .getBlockById(id);
            if (block) {
                block.inputList[0].fieldRow[0].setValue(value);
            }
        });
    }

    updateToolboxXml(target) {
        const dynamicBlocksXML = this.props.vm.runtime.getBlocksXML();
        const toolboxXML = makeToolboxXML(target.isStage, target.id, dynamicBlocksXML, this.props.customBlocks);
        this.props.updateToolboxState(toolboxXML);
    }

    onTargetsUpdate() {
        if (this.props.vm.editingTarget) {
            [ 'glide', 'move', 'set' ].forEach((prefix) => {
                this.updateToolboxBlockValue(`${prefix}x`, Math.round(this.props.vm.editingTarget.x).toString());
                this.updateToolboxBlockValue(`${prefix}y`, Math.round(this.props.vm.editingTarget.y).toString());
            });
        }
    }
    onWorkspaceMetricsChange() {
        const target = this.props.vm.editingTarget;
        if (target && target.id) {
            const workspaceMetrics = Object.assign({}, this.state.workspaceMetrics, {
                [target.id]: {
                    scrollX: this.workspace.scrollX,
                    scrollY: this.workspace.scrollY,
                    scale: this.workspace.scale,
                },
            });
            this.setState({ workspaceMetrics });
        }
    }
    onScriptGlowOn(data) {
        this.workspace.glowStack(data.id, true);
    }
    onScriptGlowOff(data) {
        this.workspace.glowStack(data.id, false);
    }
    onBlockGlowOn(data) {
        this.workspace.glowBlock(data.id, true);
    }
    onBlockGlowOff(data) {
        this.workspace.glowBlock(data.id, false);
    }
    onVisualReport(data) {
        this.workspace.reportValue(data.id, data.value);
    }
    onWorkspaceUpdate(data) {
        // When we change sprites, update the toolbox to have the new sprite's blocks
        if (this.props.vm.editingTarget) {
            const target = this.props.vm.editingTarget;
            this.updateToolboxXml(target);
        }

        if (this.props.vm.editingTarget && !this.state.workspaceMetrics[this.props.vm.editingTarget.id]) {
            this.onWorkspaceMetricsChange();
        }

        // Remove and reattach the workspace listener (but allow flyout events)
        this.workspace.removeChangeListener(this.props.vm.blockListener);
        const dom = this.ScratchBlocks.Xml.textToDom(data.xml);
        this.ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        this.workspace.addChangeListener(this.props.vm.blockListener);

        if (this.props.vm.editingTarget && this.state.workspaceMetrics[this.props.vm.editingTarget.id]) {
            const { scrollX, scrollY, scale } = this.state.workspaceMetrics[this.props.vm.editingTarget.id];
            this.workspace.scrollX = scrollX;
            this.workspace.scrollY = scrollY;
            this.workspace.scale = scale;
            this.workspace.resize();
        }
    }
    handleExtensionAdded(blocksInfo) {
        // select JSON from each block info object then reject the pseudo-blocks which don't have JSON, like separators
        // this actually defines blocks and MUST run regardless of the UI state
        this.ScratchBlocks.defineBlocksWithJsonArray(blocksInfo.map((blockInfo) => blockInfo.json).filter((x) => x));

        // update the toolbox view: this can be skipped if we're not looking at a target, etc.
        const runtime = this.props.vm.runtime;
        const target = runtime.getEditingTarget() || runtime.getTargetForStage();
        if (target) {
            this.updateToolboxXml(target);
        }
    }
    handleBlocksInfoUpdate(blocksInfo) {
        // @todo Later we should replace this to avoid all the warnings from redefining blocks.
        this.handleExtensionAdded(blocksInfo);
    }
    handleCategorySelected(categoryId) {
        this.withToolboxUpdates(() => {
            this.workspace.toolbox_.setSelectedCategoryById(categoryId);
        });
    }
    setBlocks(blocks) {
        this.blocks = blocks;
    }
    handlePromptStart(message, defaultValue, callback, optTitle, optVarType) {
        const p = { prompt: { callback, message, defaultValue } };
        p.prompt.title = optTitle ? optTitle :
            this.ScratchBlocks.VARIABLE_MODAL_TITLE;
        p.prompt.showMoreOptions =
            optVarType !== this.ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE;
        this.setState(p);
    }
    handlePromptCallback(data) {
        this.state.prompt.callback(data);
        this.handlePromptClose();
    }
    handlePromptClose() {
        this.setState({ prompt: null });
    }
    handleCustomProceduresClose(data) {
        this.props.onRequestCloseCustomProcedures(data);
        const ws = this.workspace;
        ws.refreshToolboxSelection_();
    }
    render() {
        /* eslint-disable no-unused-vars */
        const {
            anyModalVisible,
            customProceduresVisible,
            extensionLibraryVisible,
            options,
            vm,
            isVisible,
            onActivateColorPicker,
            updateToolboxState,
            onActivateCustomProcedures,
            onRequestCloseExtensionLibrary,
            onRequestCloseCustomProcedures,
            layoutMode,
            toolboxXML,
            customBlocks,
            captureFlyoutRef,
            ...props
        } = this.props;
        /* eslint-enable no-unused-vars */
        return (
            <React.Fragment>
                <BlocksComponent
                    componentRef={this.setBlocks}
                    {...props}
                />
                {this.state.prompt ?
                    <Prompt
                        label={this.state.prompt.message}
                        placeholder={this.state.prompt.defaultValue}
                        showMoreOptions={this.state.prompt.showMoreOptions}
                        title={this.state.prompt.title}
                        onCancel={this.handlePromptClose}
                        onOk={this.handlePromptCallback}
                    />
                    : null}
                {extensionLibraryVisible ?
                    <ExtensionLibrary
                        vm={vm}
                        onCategorySelected={this.handleCategorySelected}
                        onRequestClose={onRequestCloseExtensionLibrary}
                    />
                    : null}
                {customProceduresVisible ?
                    <CustomProcedures
                        options={{
                            media: options.media,
                        }}
                        onRequestClose={this.handleCustomProceduresClose}
                    />
                    : null}
            </React.Fragment>
        );
    }
}

const BlocksWithCapture = (props) => (
    <OnboardingCapture componentId={TRIGGER_REFS.blocksToolbox}>
        {(captureRef) => <Blocks captureFlyoutRef={captureRef} {...props} />}
    </OnboardingCapture>
);

Blocks.propTypes = {
    anyModalVisible: PropTypes.bool,
    customProceduresVisible: PropTypes.bool,
    extensionLibraryVisible: PropTypes.bool,
    isVisible: PropTypes.bool,
    layoutMode: PropTypes.string,
    locale: PropTypes.string,
    messages: PropTypes.objectOf(PropTypes.string),
    onActivateColorPicker: PropTypes.func,
    onActivateCustomProcedures: PropTypes.func,
    onRequestCloseCustomProcedures: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number,
        }),
        colours: PropTypes.shape({
            workspace: PropTypes.string,
            flyout: PropTypes.string,
            toolbox: PropTypes.string,
            toolboxSelected: PropTypes.string,
            scrollbar: PropTypes.string,
            scrollbarHover: PropTypes.string,
            insertionMarker: PropTypes.string,
            insertionMarkerOpacity: PropTypes.number,
            fieldShadow: PropTypes.string,
            dragShadowOpacity: PropTypes.number,
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool,
    }),
    toolboxXML: PropTypes.string,
    updateToolboxState: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    customBlocks: PropTypes.arrayOf(PropTypes.shape({
        category: PropTypes.string.isRequired,
        blocks: PropTypes.arrayOf(PropTypes.string).isRequired,
    })),
    captureFlyoutRef: PropTypes.func.isRequired,
};

Blocks.defaultOptions = {
    zoom: {
        controls: true,
        wheel: true,
        startScale: 0.675,
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ddd',
    },
    colours: {
        workspace: '#F9F9F9',
        flyout: '#F9F9F9',
        toolbox: '#FFFFFF',
        toolboxSelected: '#E9EEF2',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#000000',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6,
    },
    comments: false,
    collapse: false,
    sounds: false,
};

Blocks.defaultProps = {
    isVisible: true,
    options: Blocks.defaultOptions,
};

const mapStateToProps = (state) => ({
    anyModalVisible:
        Object.keys(state.scratchGui.modals).some((key) => state.scratchGui.modals[key]) ||
        state.scratchGui.mode.isFullScreen,
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    locale: state.intl.locale,
    messages: state.intl.messages,
    toolboxXML: state.scratchGui.toolbox.toolboxXML,
    customProceduresVisible: state.scratchGui.customProcedures.active,
    layoutMode: state.scratchGui.layoutMode,
    customBlocks: (state.scratchGui.eduLayer.gameSpec || {}).blocks || null,
});

const mapDispatchToProps = (dispatch) => ({
    onActivateColorPicker: (callback) => dispatch(activateColorPicker(callback)),
    onActivateCustomProcedures: (data, callback) => dispatch(activateCustomProcedures(data, callback)),
    onRequestCloseExtensionLibrary: () => {
        dispatch(closeExtensionLibrary());
    },
    onRequestCloseCustomProcedures: (data) => {
        dispatch(deactivateCustomProcedures(data));
    },
    updateToolboxState: (toolboxXML) => {
        dispatch(updateToolbox(toolboxXML));
    },
});

export default errorBoundaryHOC('Blocks')(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(BlocksWithCapture)
);
