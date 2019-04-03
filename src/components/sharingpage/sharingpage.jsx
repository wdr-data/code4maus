import React from 'react';

import qs from 'qs';
import styles from './sharingpage.css';
import printIcon from '../../../assets/icons/header_save.svg';

const SharingPage = () => {
    const { id } = qs.parse(location.search.substr(1));

    if (!id) {
        return null;
    }

    const url = `/data/sharing/${id}`;

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
