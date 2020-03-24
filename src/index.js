import { ScratchPaintReducer } from 'scratch-paint'
import { setAppElement } from 'react-modal'
import GUI from './containers/gui.jsx'
import GuiReducer, {
  guiInitialState,
  guiMiddleware,
  initFullScreen,
  initPlayer,
} from './reducers/gui'
import IntlReducer from './reducers/intl'
import { setFullScreen, setPlayer } from './reducers/mode'

const guiReducers = {
  intl: IntlReducer,
  scratchGui: GuiReducer,
  scratchPaint: ScratchPaintReducer,
}

export {
  GUI as default,
  setAppElement,
  guiReducers,
  guiInitialState,
  guiMiddleware,
  initPlayer,
  initFullScreen,
  setFullScreen,
  setPlayer,
}
