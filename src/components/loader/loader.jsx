import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './loader.css';

import InlineSVG from '../inline-svg/inline-svg.jsx';

import wdrLogo from '../../../assets/img/wdr_logo.svg';
import logo from '../../../assets/img/head_logo.png';
import loader from '!raw-loader!../../../assets/img/loader.svg';

class LoaderComponent extends React.Component {
    render() {
        return (
            <div className={styles.background}>
                <img
                    alt="WDR"
                    className={styles.wdrLogo}
                    draggable={false}
                    src={wdrLogo}
                />

                <div className={styles.container}>
                    <img className={styles.logo} src={logo} />
                    <InlineSVG className={styles.loader} svg={loader} />
                </div>
            </div>
        );
    }
}

export default LoaderComponent;
