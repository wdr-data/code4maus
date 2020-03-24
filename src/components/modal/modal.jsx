import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import ReactModal from 'react-modal'
import { FormattedMessage } from 'react-intl'

import Button from '../button/button.jsx'
import CloseButton from '../close-button/close-button.jsx'

import backIcon from '../../lib/assets/icon--back.svg'

import styles from './modal.css'

const ModalComponent = (props) => (
  <ReactModal
    isOpen
    className={classNames(styles.modalWrapper, props.className, {
      [styles.fullScreen]: props.fullScreen,
      [styles.styleOrange]: props.style === 'orange',
    })}
    contentLabel={props.contentLabel}
    overlayClassName={styles.modalOverlay}
    onRequestClose={props.onRequestClose}
  >
    <div className={classNames(styles.header, props.headerClassName)}>
      <div className={classNames(styles.headerItem, styles.headerItemTitle)}>
        {props.contentLabel}
      </div>
      <div className={classNames(styles.headerItem, styles.headerItemClose)}>
        {props.fullScreen ? (
          <Button
            className={styles.backButton}
            iconSrc={backIcon}
            onClick={props.onRequestClose}
          >
            <FormattedMessage
              defaultMessage="Back"
              description="Back button in modal"
              id="gui.modal.back"
            />
          </Button>
        ) : (
          <CloseButton
            size={CloseButton.SIZE_LARGE}
            onClick={props.onRequestClose}
          />
        )}
      </div>
    </div>
    <div className={styles.content}>{props.children}</div>
  </ReactModal>
)
ModalComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  contentLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  fullScreen: PropTypes.bool,
  headerClassName: PropTypes.string,
  onRequestClose: PropTypes.func,
  style: PropTypes.oneOf(['orange', 'blue']),
}

ModalComponent.defaultProps = {
  style: 'blue',
}

export default ModalComponent
