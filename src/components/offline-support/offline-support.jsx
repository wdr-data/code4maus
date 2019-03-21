import React from 'react';
import PropTypes from 'prop-types';

import ButtonComponent from '../button/button.jsx';
import { connect } from 'react-redux';
import { setInstallOnLoad } from '../../reducers/offline.js';


const OfflineSupport = (props) => {
    let offlineSupport = 'serviceWorker' in navigator;
    if (!offlineSupport) {
        return null;
    }

    let content;
    if (props.firstTimeInstalled) {
        content = (
            <div>Fertig</div>
        );
    } else if (props.firstTimeInstalling) {
        content = (
            <div>Installiere...</div>
        );
    } else if (props.installed) {
        content = (
            <div>Offlineversion aktiviert</div>
        );
    } else if (!props.installOnLoad) {
        content = (
            <div style={{ marginRight: '20px' }}>
                <ButtonComponent style="primary" onClick={() => props.setInstallOnLoad()}>Offlinemodus aktivieren</ButtonComponent>
            </div>
        );
    }

    if (content) {
        return (
            <div style={{ marginRight: '20px' }}>
                {content}
            </div>
        );
    } else {
        return null;
    }
};

OfflineSupport.propTypes = {
    setInstallOnLoad: PropTypes.func.isRequired,
    installed: PropTypes.bool.isRequired,
    installOnLoad: PropTypes.bool.isRequired,
    firstTimeInstalling: PropTypes.bool.isRequired,
    firstTimeInstalled: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    installed: state.scratchGui.offline.installed,
    installOnLoad: state.scratchGui.offline.installOnLoad,
    firstTimeInstalled: state.scratchGui.offline.firstTimeInstalled,
    firstTimeInstalling: state.scratchGui.offline.firstTimeInstalling,
});
const mapDispatchToProps = (dispatch) => ({
    setInstallOnLoad: () => dispatch(setInstallOnLoad()),
});

export default connect(mapStateToProps, mapDispatchToProps)(OfflineSupport);
