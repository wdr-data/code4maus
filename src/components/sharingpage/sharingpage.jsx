import React from 'react';

import styles from './sharingpage.css';
import printIcon from '../../../assets/icons/header_save.svg';

const SharingPage = () => {
    const search = location.search;
    if (search.length === 0) {
        return null;
        // return <ErrorPage />;
    }
    const imageId = location.search.substr(1);

    const key = `data/sharing/${imageId}`;
    const url = `${key}`;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <img src={url} />
                <div className={styles.buttonWrapper}>
                    <a href={url} download>
                        <img src={printIcon} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SharingPage;
