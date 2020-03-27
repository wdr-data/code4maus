import '@babel/polyfill'
import 'es6-object-assign/auto'
import React from 'react'
import ReactDOM from 'react-dom'

import App from '../components/sharingpage/sharingpage.jsx'
import '../css/defaults.css'

ReactDOM.render(<App />, document.getElementById('__mausapp'))
