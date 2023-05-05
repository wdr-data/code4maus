import React, { useEffect } from 'react'

import betaLogo from '../../assets/img/beta_header_sans.png'
import styles from '../css/offline.css'

import '../css/defaults.css'
import ButtonComponent from '../components/button/button.jsx'
import { useState } from 'react'
import { localStorageKey } from '../lib/feature-flags'
import { FEATURE_OFFLINE } from '../lib/feature-flags'
import { useCallback } from 'react'
import Modal from './modal.jsx'
import { setEnabled } from '../reducers/offline'
import OfflineSupport from '../components/offline-support/offline-support.jsx'
import { useDispatch, useSelector } from 'react-redux'

const OfflineModus = () => {
  const dispatch = useDispatch()
  const offlineState = useSelector((state) => state.scratchGui.offline)
  const modusKey = localStorageKey(FEATURE_OFFLINE)
  const initState = Boolean(localStorage.getItem(modusKey))
  const [modusActivated, setModusActivated] = useState(initState)

  const toggleOfflineModus = useCallback(() => {
      modusActivated ? localStorage.removeItem(modusKey) : localStorage.setItem(modusKey, 'true')
      setModusActivated((prevState) => !prevState)
    }, [setModusActivated]
  )

  // TODO: implement this in offline-support component

  const activateButton = (
    <ButtonComponent 
      className={styles.featureButton} 
      style='secondary'
      onClick={toggleOfflineModus}
    >
      Offlinemodus aktivieren
    </ButtonComponent>
  )

  useEffect(() => {
    console.log("state chaged", offlineState)

    // if (!offlineState.enabled) {
    //   localStorage.removeItem(modusKey)
    // } else {
    //   localStorage.setItem(modusKey, 'true')
    // }

  }, [offlineState])

  return (
    <Modal
      fullScreen
      contentLabel="Offlinemodus"
      onRequestClose={() => window.location.assign('/')}
      id="offline-modus-modal"
    >
      <div className={styles.background}>
        <div className={styles.wrapper}>
          <img className={styles.logo} src={betaLogo} />

          <h1>
            Programmieren mit der Maus ohne Internetverbindung nutzen - <br /> nur im Chrome Browser
          </h1>

          <p>
          Um Schulen zu unterstützen, die nicht überall oder nicht durchgehend gutes Internet haben, 
          stellen wir für Programmieren mit der Maus eine Offline-Version zur Verfügung.
          </p>

          <p>
          So geht’s: <br />
          An einem Ort mit Internet an jedem Gerät einmal auf “Offlinemodus aktivieren” klicken. 
          Alle erfoderlichen Inhalte werden dann heruntergeladen. Wenn das erfolgreich war, erscheint 
          “Offlinemodus aktiviert”. <br />
          Programmieren mit der Maus kann dann ohne Internetverbindung verwendet werden. Von den Kindern 
          angelegte Projekte werden auf dem Gerät gespeichert, bis wieder eine Internetverbindung besteht.
          </p>

          <b>
          Die Funktion ist noch in der Entwicklung. Derzeit funktioniert der Offlinemodus 
          nur im Chrome-Browser.
          </b>

          <OfflineSupport />
        </div>
      </div>
    </Modal>
  )
}

export default OfflineModus
