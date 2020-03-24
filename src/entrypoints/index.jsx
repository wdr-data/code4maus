import 'babel-polyfill'
import 'es6-object-assign/auto'
import React from 'react'
import ReactDOM from 'react-dom'

import App from '../containers/app.jsx'

import styles from '../css/index.css'

const appTarget = document.createElement('div')
appTarget.className = styles.app
document.body.appendChild(appTarget)

App.setAppElement(appTarget)

ReactDOM.render(<App />, appTarget)
