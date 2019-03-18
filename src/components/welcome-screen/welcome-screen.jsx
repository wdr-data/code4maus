import React from 'react';
import PropTypes from 'prop-types';

import LogoOverlay from '../logo-overlay/logo-overlay.jsx';
import Button from '../button/button.jsx';

import styles from './welcome-screen.css';

const WelcomeScreenComponent = (props) => (
    <LogoOverlay>
        <div className={styles.wrapper}>
            <div className={styles.innerWrapper}>
                <p>Willkommen zu <strong>Programmieren mit der Maus</strong></p>
                <p>
                Hier lernst du Schritt für Schritt Bildergeschichten 
                und Spiele mit der Maus zu programmieren.
                Viel Spaß!
                </p>
                <p className={styles.buttonWrapper}>
                    <Button style='primary' onClick={props.onIntroClick}>
                        Lernen, wie es geht
                    </Button>
                    <Button style='primary' onClick={props.onMenuClick}>
                        Zur Übersicht
                    </Button>
                </p>
            </div>
        </div>
    </LogoOverlay>
);

WelcomeScreenComponent.propTypes = {
    onIntroClick: PropTypes.func.isRequired,
    onMenuClick: PropTypes.func.isRequired,
};

export default WelcomeScreenComponent;
