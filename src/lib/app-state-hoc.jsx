import React from 'react'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router'
import { createLogger } from 'redux-logger'

import { IntlProvider } from 'react-intl-redux'
import { ScratchPaintReducer } from 'scratch-paint'
import intlReducer from '../reducers/intl.js'

import guiReducer, { guiInitialState, guiMiddleware } from '../reducers/gui'

export const history = createBrowserHistory()

const reducer = (history) =>
  combineReducers({
    intl: intlReducer,
    scratchGui: guiReducer,
    scratchPaint: ScratchPaintReducer,
    router: connectRouter(history),
  })

const enhancer = compose(
  // router.enhancer,
  guiMiddleware,
  applyMiddleware(
    routerMiddleware(history),
    ...(process.env.NODE_ENV !== 'production' ? [createLogger({})] : [])
  )
)

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent) {
  class AppStateWrapper extends React.Component {
    constructor(props) {
      super(props)

      this.store = createStore(
        reducer(history),
        { scratchGui: guiInitialState },
        enhancer
      )
    }
    render() {
      return (
        <Provider store={this.store}>
          <ConnectedRouter history={history}>
            <IntlProvider>
              <WrappedComponent {...this.props} />
            </IntlProvider>
          </ConnectedRouter>
        </Provider>
      )
    }
  }
  return AppStateWrapper
}

export default AppStateHOC
