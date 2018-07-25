import 'babel-polyfill';
import 'es6-object-assign/auto';
import React from 'react';
import ReactDOM from 'react-dom';

import GUI from '../containers/gui.jsx';

import styles from './index.css';

if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
    // Warn before navigating away
    window.onbeforeunload = () => true;
}

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

GUI.setAppElement(appTarget);

ReactDOM.render(<GUI />, appTarget);
