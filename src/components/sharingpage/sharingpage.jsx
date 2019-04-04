import React from 'react';
import qs from 'qs';
import fbIcon from 'simple-icons/icons/facebook';
import twitterIcon from 'simple-icons/icons/twitter';
import whatsappIcon from 'simple-icons/icons/whatsapp';

import InlineSVG from '../inline-svg/inline-svg.jsx';
import printIcon from '../../../assets/icons/header_save.svg';
import styles from './sharingpage.css';

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
                        <InlineSVG className={styles.brandIcon} svg={fbIcon.svg} color={`#${fbIcon.hex}`} />
                    </a>
                    <a href={twitterUrl} rel="noopener noreferrer" target="_blank">
                        <InlineSVG className={styles.brandIcon} svg={twitterIcon.svg} color={`#${twitterIcon.hex}`} />
                    </a>
                    <a href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                        <InlineSVG className={styles.brandIcon} svg={whatsappIcon.svg} color={`#${whatsappIcon.hex}`} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SharingPage;
