import React from 'react';
import PropTypes from 'prop-types';
import styles from './logo-overlay.css';

import wdrLogo from '../../../assets/img/wdr_logo.svg';
import logo from '../../../assets/img/head_logo.png';

const LogoOverlayComponent = ({ children }) => (
    <div className={styles.background}>
        <img
            alt="WDR"
            className={styles.wdrLogo}
            draggable={false}
            src={wdrLogo}
        />

        <div className={styles.container}>
            <img className={styles.logo} src={logo} />
            {children}
        </div>
    </div>
);

LogoOverlayComponent.propTypes = {
    children: PropTypes.node,
};

export default LogoOverlayComponent;
