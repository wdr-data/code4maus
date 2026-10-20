import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import '../src/css/defaults.css'
import '../src/css/typography.css'

const BackgroundDecorator = (story) => (
  <div style={{ backgroundColor: 'darkorange', minHeight: '100vh' }}>
    {story()}
  </div>
)

const mockStore = createStore((state) => state, { router: {} })

const ReduxDecorator = (story) => (
  <Provider store={mockStore}>{story()}</Provider>
)

export default {
  decorators: [BackgroundDecorator, ReduxDecorator],
}
