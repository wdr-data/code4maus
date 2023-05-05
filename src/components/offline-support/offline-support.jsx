import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import ButtonComponent from '../button/button.jsx'
import { setEnabled } from '../../reducers/offline.js'
import styles from '../../css/offline.css'


// TODO: add changing local storage key value before setEnabled

const OfflineSupport = (props) => {
  const offlineSupport = 'serviceWorker' in navigator

  const toggleButton = (enabled) => (
    <ButtonComponent
      style={enabled ? 'primary' : 'secondary'}
      className={styles.featureButton}
      onClick={() => props.setEnabled(!enabled)}
    >
      {`Offlinemodus ${enabled ? 'Deaktivieren' : 'Aktivieren'}`}
    </ButtonComponent>
  )


  if (!offlineSupport) {
    return null
  }

  if (props.installing) {
    return <div>Installiere...</div>
  }

  if (props.installed) {
    return (
      <>
        {toggleButton(true)}
        <div>Offlineversion aktiviert</div>
      </>
    )
  }

  if (!props.enabled) {
    return (
      toggleButton(false)
    )
  }

  if (props.installError !== null) {
    return (
      <>
        {toggleButton(true)}
        <i>Fehler: {props.installError}</i>
      </>
    )
  }

  return null
}

OfflineSupport.propTypes = {
  setEnabled: PropTypes.func.isRequired,
  installed: PropTypes.bool.isRequired,
  installError: PropTypes.string,
  installing: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  installed: state.scratchGui.offline.installed,
  installError: state.scratchGui.offline.installError,
  installing: state.scratchGui.offline.installing,
  enabled: state.scratchGui.offline.enabled,
})

const mapDispatchToProps = (dispatch) => ({
  setEnabled: (value) => dispatch(setEnabled(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OfflineSupport)
