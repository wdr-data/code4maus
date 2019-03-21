const SET_INSTALL_ON_LOAD = 'scratch-gui/offline/SET_INSTALL_ON_LOAD';
const START_FIRST_TIME_INSTALL = 'scratch-gui/offline/START_FIRST_TIME_INSTALL';
const FAIL_FIRST_TIME_INSTALL = 'scratch-gui/offline/FAIL_FIRST_TIME_INSTALL';
const FINISH_FIRST_TIME_INSTALL = 'scratch-gui/offline/FINISH_FIRST_TIME_INSTALL';
const SET_INSTALLED = 'scratch-gui/offline/SET_INSTALLED';

const initialState = {
    installOnLoad: !!localStorage.getItem('offline-install'),
    firstTimeInstalling: false,
    firstTimeInstallError: null,
    installed: false,
    firstTimeInstalled: false,
};

const reducer = function(state, action) {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    switch (action.type) {
    case SET_INSTALL_ON_LOAD:
        localStorage.setItem('offline-install', true);
        return {
            ...state,
            installOnLoad: true,
        };
    case START_FIRST_TIME_INSTALL:
        return {
            ...state,
            firstTimeInstalling: true,
            firstTimeInstallFinished: false,
            firstTimeInstallError: null,
            firstTimeInstalled: false,
        };
    case FAIL_FIRST_TIME_INSTALL:
        return {
            ...state,
            firstTimeInstallError: action.error,
            firstTimeInstalling: false,
            firstTimeInstallFinished: false,
            firstTimeInstalled: false,
        };
    case FINISH_FIRST_TIME_INSTALL:
        return {
            ...state,
            firstTimeInstallError: null,
            firstTimeInstalling: false,
            firstTimeInstalled: true,
        };
    case SET_INSTALLED:
        return {
            ...state,
            installed: true,
        };
    default:
        return state;
    }
};

const setInstallOnLoad = function() {
    return {
        type: SET_INSTALL_ON_LOAD,
    };
};

const startFirstTimeInstall = function() {
    return {
        type: START_FIRST_TIME_INSTALL,
    };
};

const finishFirstTimeInstall = function() {
    return {
        type: FINISH_FIRST_TIME_INSTALL,
    };
};

const failFirstTimeInstall = function(error) {
    return {
        type: FAIL_FIRST_TIME_INSTALL,
        error,
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
    setInstallOnLoad,
    setInstalled,
    startFirstTimeInstall,
    finishFirstTimeInstall,
    failFirstTimeInstall,
};
