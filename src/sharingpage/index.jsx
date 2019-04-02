import 'babel-polyfill';
import 'es6-object-assign/auto';
import React from 'react';
import ReactDOM from 'react-dom';

import styles from './index.css';

import App from '../components/sharingpage/sharingpage.jsx';

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);

// App.setAppElement(appTarget);

ReactDOM.render(<App />, appTarget);
