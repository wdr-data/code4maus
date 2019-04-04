import React from 'react';

import qs from 'qs';
import styles from './sharingpage.css';
import printIcon from '../../../assets/icons/header_save.svg';
import fbIcon from './fb.svg';
import twitterIcon from './twitter.svg';
import whatsappIcon from './whatsapp.svg';

const SharingPage = () => {
    const { id } = qs.parse(location.search.substr(1));

    if (!id) {
        return null;
    }

    const url = `/data/sharing/${id}`;
    const fbUrl = `https://www.facebook.com/dialog/share?app_id=${process.env.FB_APP_ID}&href=${encodeURIComponent(location.href)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(location.href)}`;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <img src={url} />
                <div className={styles.buttonWrapper}>
                    <a href={url} download>
                        <img src={printIcon} />
                    </a>
                    <a href={fbUrl} rel="noopener noreferrer" target="_blank">
                        <img src={fbIcon} />
                    </a>
                    <a href={twitterUrl} rel="noopener noreferrer" target="_blank">
                        <img src={twitterIcon} />
                    </a>
                    <a href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                        <img src={whatsappIcon} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SharingPage;
