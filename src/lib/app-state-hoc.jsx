import React from 'react'
import { Provider } from 'react-redux'
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { initializeCurrentLocation } from 'redux-little-router'
import { createLogger } from 'redux-logger'

import { IntlProvider } from 'react-intl-redux'
import { ScratchPaintReducer } from 'scratch-paint'
import intlReducer from '../reducers/intl.js'

import guiReducer, { guiInitialState, guiMiddleware } from '../reducers/gui'
import * as router from './routing'

const enhancer = compose(
  router.enhancer,
  guiMiddleware,
  applyMiddleware(
    router.middleware,
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

      const reducer = combineReducers({
        intl: intlReducer,
        scratchGui: guiReducer,
        scratchPaint: ScratchPaintReducer,
        router: router.reducer,
      })

      this.store = createStore(
        reducer,
        { scratchGui: guiInitialState },
        enhancer
      )

      const initialLocation = this.store.getState().router
      if (initialLocation) {
        this.store.dispatch(initializeCurrentLocation(initialLocation))
      }
    }
    render() {
      return (
        <Provider store={this.store}>
          <IntlProvider>
            <WrappedComponent {...this.props} />
          </IntlProvider>
        </Provider>
      )
    }
  }
  return AppStateWrapper
}

export default AppStateHOC
