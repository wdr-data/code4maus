import React from 'react';
import PropTypes from 'prop-types';

import LogoOverlay from '../logo-overlay/logo-overlay.jsx';
import ButtonPrimary from '../button-primary/button-primary.jsx';

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
                <div className={styles.buttonWrapper}>
                    <ButtonPrimary className={styles.button} onClick={props.onIntroClick}>
                        Lernen, wie es geht
                    </ButtonPrimary>
                    <ButtonPrimary className={styles.button} onClick={props.onMenuClick}>
                        Zur Übersicht
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    </LogoOverlay>
);

WelcomeScreenComponent.propTypes = {
    onIntroClick: PropTypes.func.isRequired,
    onMenuClick: PropTypes.func.isRequired,
};

export default WelcomeScreenComponent;
