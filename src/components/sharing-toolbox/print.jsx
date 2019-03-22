import React from 'react';
import PropTypes from 'prop-types';
import styles from './print.css';
import buttonBorder from './buttonBorder.svg';

const PrintLayout = ({ stage, layoutRef = React.createRef() }) => {
    return (
        <div className={styles.button} ref={layoutRef}>
            <img
                className={styles.stage}
                src={stage}
            />
            <img
                className={styles.buttonBorder}
                src={buttonBorder}
            />
        </div>
    );
};

PrintLayout.propTypes = {
    stage: PropTypes.string.isRequired,
    layoutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default PrintLayout;
