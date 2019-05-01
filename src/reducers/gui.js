import { applyMiddleware, compose, combineReducers } from 'redux';
import assetDragReducer, { assetDragInitialState } from './asset-drag';
import cardsReducer, { cardsInitialState } from './cards';
import colorPickerReducer, { colorPickerInitialState } from './color-picker';
import customProceduresReducer, { customProceduresInitialState } from './custom-procedures';
import blockDragReducer, { blockDragInitialState } from './block-drag';
import editorTabReducer, { editorTabInitialState } from './editor-tab';
import hoveredTargetReducer, { hoveredTargetInitialState } from './hovered-target';
import menuReducer, { menuInitialState } from './menus';
import modalReducer, { modalsInitialState } from './modals';
import modeReducer, { modeInitialState } from './mode';
import monitorReducer, { monitorsInitialState } from './monitors';
import monitorLayoutReducer, { monitorLayoutInitialState } from './monitor-layout';
import stageSizeReducer, { stageSizeInitialState } from './stage-size';
import targetReducer, { targetsInitialState } from './targets';
import toolboxReducer, { toolboxInitialState } from './toolbox';
import vmReducer, { vmInitialState } from './vm';
import throttle from 'redux-throttle';
import layoutModeReducer, { layoutModeInitialState } from './layout-mode';
import projectReducer, { projectInitialState } from './project';
import eduLayerReducer, { eduLayerInitialState } from './edu-layer';
import projectChangedReducer, { projectChangedInitialState } from './project-changed';
import offlineReducer, { offlineInitialState } from './offline';

const guiMiddleware = compose(applyMiddleware(throttle(300, { leading: true, trailing: true })));

const guiInitialState = {
    assetDrag: assetDragInitialState,
    blockDrag: blockDragInitialState,
    cards: cardsInitialState,
    colorPicker: colorPickerInitialState,
    customProcedures: customProceduresInitialState,
    editorTab: editorTabInitialState,
    mode: modeInitialState,
    hoveredTarget: hoveredTargetInitialState,
    layoutMode: layoutModeInitialState,
    stageSize: stageSizeInitialState,
    menus: menuInitialState,
    modals: modalsInitialState,
    monitors: monitorsInitialState,
    monitorLayout: monitorLayoutInitialState,
    targets: targetsInitialState,
    toolbox: toolboxInitialState,
    vm: vmInitialState,
    project: projectInitialState,
    eduLayer: eduLayerInitialState,
    projectChanged: projectChangedInitialState,
    offline: offlineInitialState,
};

const initPlayer = function(currentState) {
    return Object.assign(
        {},
        currentState,
        { mode: {
            isFullScreen: currentState.mode.isFullScreen,
            isPlayerOnly: true,
        } }
    );
};
const initFullScreen = function(currentState) {
    return Object.assign(
        {},
        currentState,
        { mode: {
            isFullScreen: true,
            isPlayerOnly: currentState.mode.isPlayerOnly,
        } }
    );
};
const guiReducer = combineReducers({
    assetDrag: assetDragReducer,
    blockDrag: blockDragReducer,
    cards: cardsReducer,
    colorPicker: colorPickerReducer,
    customProcedures: customProceduresReducer,
    editorTab: editorTabReducer,
    mode: modeReducer,
    hoveredTarget: hoveredTargetReducer,
    layoutMode: layoutModeReducer,
    stageSize: stageSizeReducer,
    menus: menuReducer,
    modals: modalReducer,
    monitors: monitorReducer,
    monitorLayout: monitorLayoutReducer,
    targets: targetReducer,
    toolbox: toolboxReducer,
    vm: vmReducer,
    project: projectReducer,
    eduLayer: eduLayerReducer,
    projectChanged: projectChangedReducer,
    offline: offlineReducer,
});

export {
    guiReducer as default,
    guiInitialState,
    guiMiddleware,
    initFullScreen,
    initPlayer,
};
