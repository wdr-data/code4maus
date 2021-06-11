import SharedAudioContext from 'audio-context'
import AudioEngine from 'scratch-audio'
import VM from 'scratch-vm'
import storage from '../lib/storage'

const SET_VM = 'scratch-gui/vm/SET_VM'
const defaultVM = new VM()

// Set up VM
const audioEngine = new AudioEngine(new SharedAudioContext())
defaultVM.attachAudioEngine(audioEngine)
defaultVM.extensionManager.loadExtensionIdSync('music')
defaultVM.attachStorage(storage)

const initialState = defaultVM

const reducer = function (state, action) {
  if (typeof state === 'undefined') {
    state = initialState
  }
  switch (action.type) {
    case SET_VM:
      return action.vm
    default:
      return state
  }
}
const setVM = function (vm) {
  alert('vm')
  return {
    type: SET_VM,
    vm: vm,
  }
}
export { reducer as default, initialState as vmInitialState, setVM }
