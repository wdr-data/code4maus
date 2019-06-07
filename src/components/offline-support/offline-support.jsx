import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../button/button.jsx';
import { connect } from 'react-redux';
import ModalOfflineSettings from '../modal-offline-settings/modal-offline-settings.jsx';

import styles from './offline-support.css';

const OfflineSupport = (props) => {
    const [ isOfflineSettingsOpen, setOfflineSettingsOpen ] = useState(false);
    return (
        <React.Fragment>
            {isOfflineSettingsOpen && < ModalOfflineSettings
                onRequestClose={() => setOfflineSettingsOpen(false)}
            />}
            <div className={styles.offlineStatus}>
                <Button style='secondary' onClick={() => setOfflineSettingsOpen(true)}>
    Offline-Modus
                </Button>
                <span>
                    {props.installed?'An':'Aus'}
                </span>
            </div>
        </React.Fragment>);
};

OfflineSupport.propTypes = {
    installed: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    installed: state.scratchGui.offline.installed,
});

export default connect(mapStateToProps)(OfflineSupport);
