import React from 'react';
import qs from 'qs';
import fbIcon from 'simple-icons/icons/facebook';
import twitterIcon from 'simple-icons/icons/twitter';
import whatsappIcon from 'simple-icons/icons/whatsapp';

import InlineSVG from '../inline-svg/inline-svg.jsx';
import printIcon from '../../../assets/icons/header_save.svg';
import styles from './sharingpage.css';

import wdrLogo from '../../../assets/img/wdr_logo.svg';
import headLogo from '../../../assets/img/head_logo.png';

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
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.firstColumn}>
                        <img
                            alt="WDR"
                            className={styles.logo}
                            draggable={false}
                            src={wdrLogo}
                        />
                    </div>
                    <div className={styles.secondColumn}>
                        <a href="/inhalte/impressum/" className={styles.copyright}>
                            <span>&#9400; WDR {(new Date().getFullYear())}</span>
                        </a>
                    </div>
                </div>
                <img
                    alt="head"
                    className={styles.logoCenter}
                    draggable={false}
                    src={headLogo}
                />
            </div>
            <div className={styles.wrapper}>
                <img className={styles.image} src={url} />
                <div className={styles.buttonWrapper}>
                    <a href={url} download>
                        <img src={printIcon} />
                    </a>
                    <a href={twitterUrl} rel="noopener noreferrer" target="_blank">
                        <InlineSVG className={styles.brandIcon} svg={twitterIcon.svg} color={`#${twitterIcon.hex}`} />
                    </a>
                    <a href={fbUrl} rel="noopener noreferrer" target="_blank">
                        <InlineSVG className={styles.brandIcon} svg={fbIcon.svg} color={`#${fbIcon.hex}`} />
                    </a>
                    <a href={whatsappUrl} rel="noopener noreferrer" target="_blank">
                        <InlineSVG className={styles.brandIcon} svg={whatsappIcon.svg} color={`#${whatsappIcon.hex}`} />
                    </a>
                </div>
            </div>
            <div className={styles.wrapper}>
                <h2 className={styles.orange}>Das war ... Code</h2>
                <p>
                    Ich habe es <span className={styles.orange}><a href={'https://twitter.com/search?q=%23mausprobiert&src=typd'} rel="noopener noreferrer"target='_blank'>#Mausprobiert:</a></span> Mein erstes Programm mit <span className={styles.orange}><a href={'https://twitter.com/search?q=%23programmierenmitdermaus&src=typd'} rel="noopener noreferrer"target='_blank'>#ProgrammierenMitDerMaus</a></span> auf der re:publica.<br/>
                    Mit Programmieren mit der Maus lassen sich bereits Grundschulkinder spielerisch ans Programmieren heranführen. Das Angebot basiert auf Scratch, einer Open Source Software für Kinder und Jugendliche. In dem Angebot werden die Kinder zunächst durch mehrere Lernspiele geführt. Dort werden sie an sie grundlegende Programmierkonzepte wie Variablen, Schleifen und Verzweigungen herangeführt. Anschließend können sie eigene kleine Programme gestalten.<br/>
                    <span className={styles.orange}><a href={'https://twitter.com/search?f=tweets&q=%23generativeart&src=typd'} rel="noopener noreferrer"target='_blank'>#GenerativeArt</a><a href={'https://twitter.com/search?f=tweets&q=%23codingisfun&src=typd'} rel="noopener noreferrer"target='_blank'> #CodingIsFun</a></span><br/>
                    Digitale Bildung im WDR: <span className={styles.orange}><a href={'https://programmieren.wdrmaus.de'} rel="noopener noreferrer"target='_blank'>programmieren.wdrmaus.de</a></span>
                </p>
            </div>
        </div>
    );
};

export default SharingPage;
