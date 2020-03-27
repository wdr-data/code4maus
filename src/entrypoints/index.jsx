import '@babel/polyfill'
import 'es6-object-assign/auto'
import React from 'react'
import ReactDOM from 'react-dom'

import App from '../containers/app.jsx'
import '../css/defaults.css'

const appTarget = document.getElementById('__mausapp')

App.setAppElement(appTarget)
ReactDOM.render(<App />, appTarget)
