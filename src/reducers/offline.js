const SET_ENABLED = 'scratch-gui/offline/SET_ENABLED'
const START_INSTALL = 'scratch-gui/offline/START_INSTALL'
const FAIL_INSTALL = 'scratch-gui/offline/FAIL_INSTALL'
const SET_INSTALLED = 'scratch-gui/offline/SET_INSTALLED'
const SET_ONLINE = 'scratch-gui/offline/SET_ONLINE'
const SET_OFFLINE = 'scratch-gui/offline/SET_OFFLINE'

const initialState = {
  enabled: localStorage.getItem('offline-install') === 'true',
  installing: false,
  installError: null,
  installed: false,
  online: 'onLine' in navigator ? navigator.onLine : true,
}

const reducer = function (state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }
  switch (action.type) {
    case SET_ENABLED:
      localStorage.setItem('offline-install', action.value)
      return {
        ...state,
        enabled: action.value,
      }
    case START_INSTALL:
      return {
        ...state,
        installing: true,
        installFinished: false,
        installError: null,
        installed: false,
      }
    case FAIL_INSTALL:
      return {
        ...state,
        installing: false,
        installFinished: false,
        installError: action.error,
        installed: false,
      }
    case SET_INSTALLED:
      return {
        ...state,
        installError: null,
        installing: false,
        installed: true,
      }
    case SET_ONLINE:
      return {
        ...state,
        online: true,
      }
    case SET_OFFLINE:
      return {
        ...state,
        online: false,
      }
    default:
      return state
  }
}

const setEnabled = function (value) {
  return {
    type: SET_ENABLED,
    value,
  }
}

const startInstall = function () {
  return {
    type: START_INSTALL,
  }
}

const failInstall = function (e) {
  return {
    type: FAIL_INSTALL,
    error: e.message,
  }
}

const setInstalled = function () {
  return {
    type: SET_INSTALLED,
  }
}

const setOnline = function () {
  return {
    type: SET_ONLINE,
  }
}

const setOffline = function () {
  return {
    type: SET_OFFLINE,
  }
}

export {
  reducer as default,
  initialState as offlineInitialState,
  setEnabled,
  setInstalled,
  startInstall,
  failInstall,
  setOnline,
  setOffline,
}
