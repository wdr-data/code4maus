import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import codeGif from '../../../assets/img/code.gif'
import block1 from '../../../assets/img/block1.png'
import block2 from '../../../assets/img/block2.png'
import block3 from '../../../assets/img/block3.png'
import fant from '../../../assets/img/fant.png'
import headLogo from '../../../assets/img/head_logo.png'
import screenshotEditor from '../../../assets/img/screenshot_editor.png'

import InlineSVG from '../inline-svg/inline-svg.jsx'

import styles from './mobile-screen.css'
import wdrLogo from '!raw-loader!../../../assets/img/wdr_logo.svg'
import mausQuestion from '!raw-loader!../../../assets/img/maus_question.svg'

const MobileScreenComponent = () => (
  <div className={styles.pageWrapper}>
    <div className={styles.logoWrapper}>
      <InlineSVG className={styles.logoWdr} svg={wdrLogo} />
    </div>
    <img
      role="heading"
      alt="Programmieren mit der Maus"
      title="Logo Programmieren mit der Maus"
      className={styles.logoCenter}
      draggable={false}
      src={headLogo}
    />

    <div className={styles.blockWrapper}>
      <img
        role="Deko-Block"
        alt="Programmieren mit der Maus"
        title="Block Programmieren mit der Maus"
        className={styles.block1}
        draggable={false}
        src={block1}
      />

      <div className={classNames(styles.innerWrapper, styles.firstWrapper)}>
        <p>
          Sie befinden sich auf der mobilen Seite von Programmieren mit der
          Maus.{' '}
          <strong>
            Die eigentliche Anwendung können sie auf dem Desktop oder auf dem
            Tablet nutzen.
          </strong>{' '}
          Bei Programmieren mit der Maus lernen Kinder ab acht Jahren
          spielerisch erstes Programmieren. Begleitet werden sie dabei von den
          Figuren und Sounds aus der <strong>Sendung mit der Maus</strong>.
          Schritt für Schritt werden sie an Variablen, Schleifen und
          Verzweigungen herangeführt und programmieren erste Animationen und
          Spiele selbst.
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
        src={codeGif}
      />
    </div>

    <div className={styles.blockWrapper}>
      <Link
        className={styles.link}
        to="https://github.com/wdr-data/code4maus"
      >
        <img
          role="Deko-Block"
          alt="Programmieren mit der Maus"
          title="Link zu Programmieren mit der Maus bei Github"
          className={styles.block1}
          draggable={false}
          src={block2}
        />
      </Link>

      <div className={classNames(styles.innerWrapper, styles.secondWrapper)}>
        <p>
          Das Ganze beruht auf der grafischen Programmiersprache{' '}
          <Link className={styles.link} to="https://scratch.mit.edu/">
            Scratch
          </Link>
          , die am MIT, in den USA, entwickelt und von Kindern der ganzen Welt
          genutzt wird. Genau wie Scratch, ist auch Programmieren mit der Maus{' '}
          <span className={styles.boldOrange}>Open Source</span> – also frei
          verfügbar.
        </p>
        <img
          role="Screenshot des Programms"
          alt="Screenshot des Programms"
          title="Screenshot des Programms"
          className={styles.screenshotEditor}
          draggable={false}
          src={screenshotEditor}
        />
        <img
          role="Elefant"
          alt="Elefant"
          title="Elefant"
          className={styles.fant}
          draggable={false}
          src={fant}
        />
      </div>
    </div>
    <div className={styles.innerWrapper}>
      <p>
        <strong>Programmieren mit der Maus</strong> ist eine Anwendung für
        Desktop und iPad. Es gibt begleitendes Material für alle, die mit
        Kindern programmieren wollen: Lehrer*innen, AGs im offenen Ganztag oder
        interessierte Erwachsene, die zum Beispiel einen Programmiertag
        organisieren möchten.
      </p>
    </div>
    <div className={styles.blockWrapper}>
      <Link className={styles.link} to="/lehrkraefte">
        <img
          role="Lerkräfte-Blog"
          alt="Link zur Lehrkräfte-Seite"
          title="Link zur Lehrkräfte-Seite"
          className={styles.block3}
          draggable={false}
          src={block3}
        />
      </Link>
    </div>
    <InlineSVG className={styles.mausQuestion} svg={mausQuestion} />
    <Link className={styles.link} to="/inhalte/impressum">
      Impressum
    </Link>
  </div>
)

export default MobileScreenComponent
