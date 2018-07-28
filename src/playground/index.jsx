import 'babel-polyfill';
import 'es6-object-assign/auto';
import React from 'react';
import ReactDOM from 'react-dom';

import App from '../containers/app.jsx';

import styles from './index.css';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

App.setAppElement(appTarget);

ReactDOM.render(<App />, appTarget);
