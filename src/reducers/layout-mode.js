const SET_BUILD_LAYOUT = 'scratch-gui/layout-mode/SET_BUILD_LAYOUT';
const SET_PLAY_LAYOUT = 'scratch-gui/layout-mode/SET_PLAY_LAYOUT';
const TOGGLE_LAYOUTMODE = 'scratch-gui/layout-mode/TOGGLE_LAYOUTMODE';

const setBuildLayout = function() {
    return {
        type: SET_BUILD_LAYOUT,
    };
};

const setPlayLayout = function() {
    return {
        type: SET_PLAY_LAYOUT,
    };
};

const toggleLayoutMode = function() {
    return {
        type: TOGGLE_LAYOUTMODE,
    };
};

const LAYOUT_BUILD = 'BUILD';
const LAYOUT_PLAY = 'PLAY';

const layoutModeReducer = (state = LAYOUT_PLAY, action) => {
    switch (action.type) {
    case SET_BUILD_LAYOUT:
        return LAYOUT_BUILD;
    case SET_PLAY_LAYOUT:
        return LAYOUT_PLAY;
    case TOGGLE_LAYOUTMODE:
        return state === LAYOUT_BUILD ? LAYOUT_PLAY : LAYOUT_BUILD;
    default:
        return state;
    }
};

const layoutModeInitialState = LAYOUT_PLAY;

export {
    layoutModeReducer as default,
    setBuildLayout,
    setPlayLayout,
    toggleLayoutMode,
    layoutModeInitialState,
};
