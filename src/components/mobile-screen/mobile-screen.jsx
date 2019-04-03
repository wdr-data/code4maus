import React from 'react';
import { Link } from 'redux-little-router';
import headLogo from '../../../assets/img/head_logo.png';
import wdrLogo from '!raw-loader!../../../assets/img/wdr_logo.svg';
import codeGif from '../../../assets/img/code.gif';
import block1 from '../../../assets/img/block1.png';
import block2 from '../../../assets/img/block2.png';
import block3 from '../../../assets/img/block3.png';
import fant from '../../../assets/img/fant.png';
import classNames from 'classnames';
import screenshotEditor from '../../../assets/img/screenshot_editor.png';

import Box from '../box/box.jsx';
import InlineSVG from '../inline-svg/inline-svg.jsx';
import Button from '../button/button.jsx';

import mausQuestion from '!raw-loader!../../../assets/img/maus_question.svg';

import styles from './mobile-screen.css';

const MobileScreenComponent = () => (
    <Box className={styles.pageWrapper}>
        <div className={styles.logoWrapper}>
            <InlineSVG className={styles.logoWdr} svg={wdrLogo} />
        </div>
        <img
            role="heading"
            alt="Programmieren mit der Maus"
            title="Logo Programmieren mit der Maus"
            className={styles.logoCenter}
            draggable={false}
            src={headLogo} />

        <div className={styles.blockWrapper}>
            <img
                role="Deko-Block"
                alt="Programmieren mit der Maus"
                title="Block Programmieren mit der Maus"
                className={styles.block1}
                draggable={false}
                src={block1} />

            <div className={classNames(styles.innerWrapper, styles.firstWrapper)}>
                <p>
                    Kinder ab acht Jahren lernen spielerisch erstes Programmieren. Begleitet werden sie dabei
                von den Figuren und Sounds aus der <span className={styles.boldOrange}>Sendung mit der Maus</span>. Schritt für Schritt werden sie
                                                                                                                            an Variablen, Schleifen und Verzweigungen herangeführt und programmieren erste Animationen und Spiele selbst.
                </p>
            </div>
        </div>

        <div className={styles.innerWrapper}>
            <img
                role="Eine Animation, die das Programmieren mit Blöcken zeigt"
                alt="Eine Animation, die das Programmieren mit Blöcken zeigt"
                title="Das war ... Code"
                className={styles.content}
                draggable={false}
                src={codeGif} />
        </div>

        <div className={styles.blockWrapper}>
            <Link className={styles.link} href="https://github.com/wdr-data/code4maus">
                <img
                    role="Deko-Block"
                    alt="Programmieren mit der Maus"
                    title="Link zu Programmieren mit der Maus bei Github"
                    className={styles.block2}
                    draggable={false}
                    src={block2} />
            </Link>

            <div className={classNames(styles.innerWrapper, styles.secondWrapper)}>
                <p>
                    Das Ganze beruht auf der grafischen Programmiersprache <Link className={styles.link} href="https://scratch.mit.edu/">Scratch</Link>, die am MIT, in den
                    USA, entwickelt und von Kindern der ganzen Welt genutzt wird. Genau wie Scratch, ist auch
                    Programmieren mit der Maus <span className={styles.boldOrange}>Open Source</span> – also frei verfügbar.
                </p>
                <img
                    role="Screenshot des Programms"
                    alt="Screenshot des Programms"
                    title="Screenshot des Programms"
                    className={styles.screenshotEditor}
                    draggable={false}
                    src={screenshotEditor} />

                <img
                    role="Elefant"
                    alt="Elefant"
                    title="Elefant"
                    className={styles.fant}
                    draggable={false}
                    src={fant} />
            </div>
        </div>
        <div className={styles.innerWrapper}>
            <p>
                <span className={styles.boldOrange}>Programmieren mit der Maus </span> ist eine Anwendung für Desktop und iPad. Ab Mai 2019 gibt
                es begleitendes Material für alle, die mit Kindern programmieren wollen: Lehrer*innen, AGs im
                offenen Ganztag oder interessierte Erwachsene, die zum Beispiel einen Programmiertag organisieren möchten.
                </p>
        </div>
        <div className={styles.blockWrapper}>
            <Link className={styles.link} href="/inhalte/eltern">
                <img
                    role="Lerkräfte-Blog"
                    alt="Link zur Lehrkräfte-Seite"
                    title="Link zur Lehrkräfte-Seite"
                    className={styles.block1}
                    draggable={false}
                    src={block3} />
            </Link>

            <div className={classNames(styles.innerWrapper, styles.thirdWrapper)}>
                <p>
                    Auf der re:publica kann Programmieren mit der Maus von Groß UND Klein <span className={styles.boldOrange}>#mausprobiert </span>
                    werden. Spielerisch mit Code Bilder mit der Maus, der Ente und dem Elefanten
                    erzeugen, das Ergebnis dann teilen oder einfach direkt als Button ausdrucken.
                </p>
            </div>
        </div>
        <InlineSVG className={styles.mausQuestion} svg={mausQuestion} />
        <Link className={styles.link} href="/inhalte/impressum">Impressum</Link>
    </Box >
);

export default MobileScreenComponent;
