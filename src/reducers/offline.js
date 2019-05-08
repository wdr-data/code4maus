const SET_ENABLED = 'scratch-gui/offline/SET_ENABLED';
const START_INSTALL = 'scratch-gui/offline/START_INSTALL';
const FAIL_INSTALL = 'scratch-gui/offline/FAIL_INSTALL';
const SET_INSTALLED = 'scratch-gui/offline/SET_INSTALLED';

const initialState = {
    enabled: !!localStorage.getItem('offline-install'),
    installing: false,
    installError: null,
    installed: false,
};

const reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    switch (action.type) {
    case SET_ENABLED:
        localStorage.setItem('offline-install', action.value);
        return {
            ...state,
            enabled: action.value,
        };
    case START_INSTALL:
        return {
            ...state,
            installing: true,
            installFinished: false,
            installError: null,
            installed: false,
        };
    case FAIL_INSTALL:
        return {
            ...state,
            installing: false,
            installFinished: false,
            installError: action.error,
            installed: false,
        };
    case SET_INSTALLED:
        return {
            ...state,
            installError: null,
            installing: false,
            installed: true,
        };
    default:
        return state;
    }
};

const setEnabled = function(value) {
    return {
        type: SET_ENABLED,
        value,
    };
};

const startInstall = function() {
    return {
        type: START_INSTALL,
    };
};

const failInstall = function(e) {
    return {
        type: FAIL_INSTALL,
        error: e.message,
    };
};

const setInstalled = function() {
    return {
        type: SET_INSTALLED,
    };
};

export {
    reducer as default,
    initialState as offlineInitialState,
    setEnabled,
    setInstalled,
    startInstall,
    failInstall,
};
