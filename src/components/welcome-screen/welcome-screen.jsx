import React from 'react'
import { Link } from 'redux-little-router'

import Button from '../button/button.jsx'
import wdrLogo from '../../../assets/img/wdr_logo.svg'
import logo from '../../../assets/img/head_logo.png'
import { eduUrl } from '../../lib/routing'
import helloWorldImage from '../../lib/edu/shared_assets/L00.jpg'
import mausImage from '../../../assets/img/maus1.png'
import styles from './welcome-screen.css'

const WelcomeScreenComponent = () => (
  <div className={styles.container}>
    <img alt="WDR" className={styles.wdrLogo} draggable={false} src={wdrLogo} />

    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        <img className={styles.logo} src={logo} />

        <p>
          Willkommen zu <strong>Programmieren mit der Maus</strong>!
        </p>
        <p>
          Hier lernst du Schritt für Schritt Bildergeschichten und Spiele mit
          der Maus zu programmieren. Viel Spaß!
        </p>

        <Link href={eduUrl('00')} className={styles.section}>
          <div className={styles.sectionText}>
            Spielst du zum ersten Mal?
            <div className={styles.sectionSmallText}>
              Fang am besten mit unserem ersten Lernspiel an.
            </div>
            <Button style="primary">
              <div style={{ whiteSpace: 'nowrap' }}>Lernen, wie es geht ‣</div>
            </Button>
          </div>

          <img
            src={helloWorldImage}
            alt=""
            className={styles.imageHelloWorld}
          />
        </Link>

        <Link href="/" className={styles.section}>
          <div className={styles.sectionText}>
            Kennst du dich schon aus?
            <div className={styles.sectionSmallText}>
              Gehe direkt zur Übersicht und klicke dein nächstes Lernspiel an.
              Gespeicherte Spiele findest du unter „Meine Sachen“.
            </div>
            <Button style="primary">
              <div style={{ whiteSpace: 'nowrap' }}>Alle Lernspiele ‣</div>
            </Button>
          </div>

          <img src={mausImage} alt="" className={styles.imageMaus} />
        </Link>
      </div>
    </div>
  </div>
)

export default WelcomeScreenComponent
