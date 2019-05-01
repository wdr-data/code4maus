import 'babel-polyfill';
import 'es6-object-assign/auto';
import React from 'react';
import ReactDOM from 'react-dom';

import defaultStyles from '../css/defaults.css';
import styles from '../css/settings.css';
import ButtonComponent from '../components/button/button.jsx';
import { useFeatureState } from '../lib/feature-flags';

const appTarget = document.createElement('div');
appTarget.className = defaultStyles.app;
document.body.appendChild(appTarget);

const Settings = () => {
    const features = useFeatureState();
    return (
        <div className={styles.background}>
            <div className={styles.wrapper}>
                <h1 className={styles.header}>Einstellungen</h1>
                {
                    features.map((feature) => (
                        <div key={feature.id} className={styles.feature}>
                            <ButtonComponent
                                style={feature.enabled ? 'primary' : 'secondary'}
                                className={styles.featureButton}
                                onClick={feature.toggle}
                            >
                                {feature.enabled ? 'Deaktivieren' : 'Aktivieren'}
                            </ButtonComponent>
                            <p className={styles.description}>{feature.description}</p>
                        </div>
                    ))
                }
            </div>
        </div>);
};

ReactDOM.render(<Settings />, appTarget);
