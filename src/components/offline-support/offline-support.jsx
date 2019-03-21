import React from 'react';
import PropTypes from 'prop-types';

import ButtonComponent from '../button/button.jsx';
import { connect } from 'react-redux';
import { setEnabled } from '../../reducers/offline.js';


const OfflineSupport = (props) => {
    const offlineSupport = 'serviceWorker' in navigator;
    if (!offlineSupport) {
        return null;
    }

    if (props.installing) {
        return (
            <div>Installiere...</div>
        );
    }

    if (props.installed) {
        return (
            <div>Offlineversion aktiviert</div>
        );
    }

    if (!props.enabled) {
        return (
            <ButtonComponent style="primary" onClick={() => props.setEnabled(true)}>Offlinemodus aktivieren</ButtonComponent>
        );
    }

    if (props.installError !== null) {
        return (
            <div>Fehler: {props.installError}</div>
        );
    }

    return null;
};

OfflineSupport.propTypes = {
    setEnabled: PropTypes.func.isRequired,
    installed: PropTypes.bool.isRequired,
    installError: PropTypes.string,
    installing: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    installed: state.scratchGui.offline.installed,
    installError: state.scratchGui.offline.installError,
    installing: state.scratchGui.offline.installing,
    enabled: state.scratchGui.offline.enabled,
});

const mapDispatchToProps = (dispatch) => ({
    setEnabled: (value) => dispatch(setEnabled(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfflineSupport);
