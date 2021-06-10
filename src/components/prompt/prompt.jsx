import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

import Modal from '../modal/modal.jsx'
import Input from '../forms/input.jsx'
import Button from '../button/button.jsx'

import styles from './prompt.css'

const PromptComponent = (props) => (
  <Modal
    className={styles.modalContent}
    contentLabel={props.title}
    onRequestClose={props.onCancel}
  >
    <div className={styles.label}>{props.label}</div>
    <Input
      autoFocus
      placeholder={props.placeholder}
      onChange={props.onChange}
      onKeyPress={props.onKeyPress}
    />
    <div className={styles.buttonRow}>
      <Button style="secondary" onClick={props.onCancel}>
        <FormattedMessage
          defaultMessage="Abbrechen"
          description="Button in prompt for cancelling the dialog"
          id="gui.prompt.cancel"
        />
      </Button>
      <Button style="primary" onClick={props.onOk}>
        <FormattedMessage
          defaultMessage="OK"
          description="Button in prompt for confirming the dialog"
          id="gui.prompt.ok"
        />
      </Button>
    </div>
  </Modal>
)
PromptComponent.propTypes = {
  label: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  showMoreOptions: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default PromptComponent
