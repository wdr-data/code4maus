import React from 'react'
import qs from 'qs'

import printIcon from '../../../assets/icons/header_save.svg'
import wdrLogo from '../../../assets/img/wdr_logo.svg'
import headLogo from '../../../assets/img/head_logo.png'
import styles from './sharingpage.css'

const { id, type } = qs.parse(location.search.substr(1))

const SharingPage = () => {
  if (!id) {
    return null
  }

  const isImage = type === 'image'
  const isVideo = type === 'video'
  if (!isImage && !isVideo) {
    return 'Invalid type'
  }

  const url = `/data/sharing/${id}`

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
            <a href="/impressum/" className={styles.copyright}>
              <span>&#9400; WDR {new Date().getFullYear()}</span>
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
        {isImage && <img className={styles.image} src={url} />}
        {isVideo && (
          <video className={styles.image} src={url} loop autoPlay muted />
        )}
        <div className={styles.buttonWrapper}>
          <a href={url} download>
            <img src={printIcon} />
          </a>
        </div>
      </div>
      <div className={styles.wrapper}>
        <h2 className={styles.orange}>Das war ... Code</h2>
        <p>
          Ich hab’s{' '}
          <span className={styles.orange}>
            <a
              href={'https://twitter.com/search?q=%23mausprobiert&src=typd'}
              rel="noopener noreferrer"
              target="_blank"
            >
              #mausprobiert:
            </a>
          </span>{' '}
          Mein erstes Programm mit{' '}
          <span className={styles.orange}>
            <a
              href={
                'https://twitter.com/search?q=%23programmierenmitdermaus&src=typd'
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              {' '}
              Programmieren mit der Maus
            </a>
          </span>{' '}
          auf der re:publica.
          <br />
          Programmieren mit der Maus führt alle ab 8 Jahre spielerisch ans
          Programmieren heran. Das Angebot basiert auf Scratch, einer Open
          Source Software. Über mehrere Lernspiele lernen Kinder die
          Programmierumgebung kennen und grundlegende Programmierkonzepte wie
          Variablen, Schleifen und Verzweigungen. Dann können sie eigene
          Programme umsetzen.
          <br />
          <span className={styles.orange}>
            <a
              href={
                'https://twitter.com/search?f=tweets&q=%23generativeart&src=typd'
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              #GenerativeArt
            </a>
            <a
              href={'https://twitter.com/search?f=tweets&q=%23MausArt&src=typd'}
              rel="noopener noreferrer"
              target="_blank"
            >
              {' '}
              #MausArt
            </a>
          </span>
          <br />
          Digitale Bildung im WDR:{' '}
          <span className={styles.orange}>
            <a
              href={'https://programmieren.wdrmaus.de'}
              rel="noopener noreferrer"
              target="_blank"
            >
              programmieren.wdrmaus.de
            </a>
          </span>
        </p>
      </div>
    </div>
  )
}

export default SharingPage
