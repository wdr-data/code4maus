import React from 'react';
import PropTypes from 'prop-types';

import LogoOverlay from '../logo-overlay/logo-overlay.jsx';
import ButtonPrimary from '../button-primary/button-primary.jsx';

import styles from './welcome-screen.css';

const WelcomeScreenComponent = (props) => (
    <LogoOverlay>
        <div className={styles.wrapper}>
            <div className={styles.innerWrapper}>
                <p>Willkommen zu <strong>Programmieren mit der Maus.</strong></p>
                <p>
                    Die Welt wird digitaler. Programmieren ist in dieser Welt eine Grundfertigkeit,
                    um selbst aktiv werden, mitgestalten und auch Kritik üben zu können. Mit dieser
                    Anwendung programmieren Kinder Schritt für Schritt erste eigene Bildergeschichten
                    und kleine Spiele. Dabei lernen sie Variablen, Schleifen und Verzweigungen kennen.
                </p>
            </div>
            <div className={styles.buttonWrapper}>
                <ButtonPrimary className={styles.button} onClick={props.onIntroClick}>
                    Zur Einführung
                </ButtonPrimary>
                <ButtonPrimary className={styles.button} onClick={props.onMenuClick}>
                    Zur Übersicht
                </ButtonPrimary>
            </div>
        </div>
    </LogoOverlay>
);

WelcomeScreenComponent.propTypes = {
    onIntroClick: PropTypes.func.isRequired,
    onMenuClick: PropTypes.func.isRequired,
};

export default WelcomeScreenComponent;
