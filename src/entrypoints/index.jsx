import 'babel-polyfill'
import 'es6-object-assign/auto'
import React from 'react'
import ReactDOM from 'react-dom'

import App from '../containers/app.jsx'

const appTarget = document.createElement('div')
document.body.appendChild(appTarget)

App.setAppElement(appTarget)

ReactDOM.render(<App />, appTarget)
