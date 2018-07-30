import React from 'react';
import { Link } from 'redux-little-router';

import styles from './content-wrapper.css';

const ContentWrapper = ({ children }) => (
    <section className={styles.page}>
        <div className={styles.wrapper}>
            <Link className={styles.backButton} href="/">
                Zurück zum Menü
            </Link>
            {children}
        </div>
    </section>
);

ContentWrapper.propTypes = {
    children: React.childrenOnly,
};

export default ContentWrapper;
