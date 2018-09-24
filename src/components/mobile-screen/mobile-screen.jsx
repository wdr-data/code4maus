import React from 'react';
import Box from '../box/box.jsx';

import InlineSVG from '../inline-svg/inline-svg.jsx';

import mausQuestion from '!raw-loader!../../../assets/img/maus_question.svg';

import styles from './mobile-screen.css';

const MobileScreenComponent = () => (
    <Box className={styles.pageWrapper}>
        <div className={styles.innerWrapper}>
            <p>
                Leider kannst Du <strong>Programmieren mit der Maus</strong> nicht auf dem Smartphone nutzen.
                Im Moment werden nur Tablets und Desktop-Rechner unterstützt.
            </p>
        </div>
        <InlineSVG className={styles.mausQuestion} svg={mausQuestion} />
    </Box>
);

export default MobileScreenComponent;
