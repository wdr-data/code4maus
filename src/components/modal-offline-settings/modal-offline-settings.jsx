import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Modal from '../modal/modal.jsx';
import Button from '../button/button.jsx';
import { Spinner } from '../loader/loader.jsx';
import { setEnabled } from '../../reducers/offline';

import styles from './modal-offline-settings.css';

const getMode = (props) => {
    const offlineSupport = 'serviceWorker' in navigator;
    if (!offlineSupport) {
        return 'unsupported';
    }

    if (!props.enabled) {
        return 'inactive';
    }

    if (props.installing) {
        return 'installing';
    }

    if (props.installed) {
        return 'installed';
    }

    if (props.installError !== null) {
        return 'error';
    }

    return 'inactive';
};

export const modes = [ 'inactive', 'installing', 'unsupported', 'error', 'installed' ];

const actions = (props) => {
    switch (getMode(props)) {
    case 'inactive':
        return (
            <React.Fragment>
                <span>Status: Offline aus.</span>
                <div className={styles.actionsButton}>
                    <Button style='primary' onClick={props.setEnabled}>
                        Aktivieren
                    </Button>
                </div>
            </React.Fragment>
        );
    case 'installing':
        return (
            <React.Fragment>
                <span>Status: Wird aktiviert ...</span>

                <div className={styles.actionsButton}>
                    <Button style='secondary' onClick={props.setDisabled}>
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

    case 'installed':
        return (<React.Fragment>
            <span>Status: Offline an. </span>
            <div className={styles.actionsButton}>
                { /* <Button style='primary'>
                    Aktualisieren
                  </Button> */}
                <Button style='primary' onClick={props.setDisabled}>
                    Deaktivieren
                </Button>
            </div>

        </React.Fragment>
        );
    }
};

const ModalOfflineSettings = (props) =>
    <Modal contentLabel='Offline-Modus' onRequestClose={props.onRequestClose} >
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

ModalOfflineSettings.propTypes = {
    onRequestClose: PropTypes.func,
    setEnabled: PropTypes.func.isRequired,
    setDisabled: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    installed: state.scratchGui.offline.installed,
    installError: state.scratchGui.offline.installError,
    installing: state.scratchGui.offline.installing,
    enabled: state.scratchGui.offline.enabled,
});

const mapDispatchToProps = (dispatch) => ({
    setEnabled: () => dispatch(setEnabled(true)),
    setDisabled: () => dispatch(setEnabled(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalOfflineSettings);
