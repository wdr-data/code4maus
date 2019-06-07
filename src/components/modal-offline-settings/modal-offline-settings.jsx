import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../modal/modal.jsx';
import Button from '../button/button.jsx';
import { Spinner } from '../loader/loader.jsx';

import styles from './modal-offline-settings.css';

export const modes = [ 'inactive', 'activating', 'unsupported', 'error', 'active' ];

const actions = (props) => {
    switch (props.mode) {
    case 'inactive':
        return (
            <React.Fragment>
                <span>Status: Offline aus ...</span>
                <div className={styles.actionsButton}>
                    <Button style='primary'>
                Aktivieren
                    </Button>
                </div>
            </React.Fragment>
        );
    case 'activating':
        return (
            <React.Fragment>
                <span>Status: Wird aktiviert ...</span>

                <div className={styles.actionsButton}>
                    <Button style='secondary'>
                    Abbrechen
                    </Button>
                </div>
                <div className={styles.actionsSpinner}>
                    <Spinner/>
                </div>
            </React.Fragment>
        );
    case 'unsupported':
        return (<React.Fragment>
            <span>Status: Der Offline-Modus wird in deinem Browser nicht unterstützt.</span>
        </React.Fragment>
        );
    case 'error':
        return (<React.Fragment>
            <span>Status: Upps, da ist etwas schief gelaufen.</span>
            <div className={styles.actionsButton}>
                <Button style='primary'>
                Noch mal versuchen
                </Button>
            </div>
        </React.Fragment>);

    case 'active':
        return (<React.Fragment>
            <span>Status: Offline an. </span>
            <div className={styles.actionsButton}>
                <Button style='primary'>
                Aktualisieren
                </Button>
                <Button style='primary'>
                Deaktivieren
                </Button>
            </div>

        </React.Fragment>
        );
    }
};

const ModalOfflineSettings = (props) =>
    <Modal contentLabel='Offline-Modus'>
        <div className={styles.content}>
            <section className={styles.description}>
                <p>Der Offlinemodus ist für Chrome, Firefox und Safari verfügbar.</p>
                <p>Wird der Offlinemodus aktiviert, werden ca. 50 Mb Daten heruntergeladen.</p>
                <p>Eigene Projekte können im Offline-Modus heruntergeladen, aber nicht online gespeichert werden.</p>
                <p>Beispiele sind im Offline-Modus nicht verfügbar.</p>
            </section>


            <section className={styles.actions}>
                {actions(props)}
            </section>
        </div>
    </Modal>;

export default ModalOfflineSettings;
