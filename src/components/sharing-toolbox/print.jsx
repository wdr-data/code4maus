import React from 'react';
import styles from './print.css';
import buttonBorder from './buttonBorder.svg';

const PrintLayout = ({ stage }) => {
    return (
        <div className={styles.printLayout}>
            <div className={styles.button}>
                <img
                    className={styles.stage}
                    src={stage}
                />
                <img
                    className={styles.buttonBorder}
                    src={buttonBorder}
                />
            </div>
        </div>
    );
};

export default PrintLayout;
