import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

import CostumeCanvas from '../costume-canvas/costume-canvas.jsx'
import IconWithText from '../icon-text/icon-text.jsx'
import InlineSVG from '../inline-svg/inline-svg.jsx'
import styles from './stage-selector.css'
import IconBg from '!raw-loader!../../../assets/icons/target_bg.svg'
import IconNew from '!raw-loader!../../../assets/icons/target_exchange.svg'

const StageSelector = (props) => {
  const {
    selected,
    raised,
    receivedBlocks,
    url,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onNewBackdropClick,
    fileInputRef: _fileInputRef,
    onBackdropFileUpload: _onBackdropFileUpload,
    onBackdropFileUploadClick: _onBackdropFileUploadClick,
    onEmptyBackdropClick: _onEmptyBackdropClick,
    onSurpriseBackdropClick: _onSurpriseBackdropClick,
    backdropCount: _backdropCount,
    ...componentProps
  } = props
  return (
    <div
      aria-label="Hintergrund auswählen"
      className={classNames(styles.stageSelector, {
        [styles.isSelected]: selected,
        [styles.raised]: raised,
        [styles.receivedBlocks]: receivedBlocks,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...componentProps}
    >
      <IconWithText className={styles.label} iconSvg={IconBg}>
        Hintergrund
      </IconWithText>
      {url ? (
        <CostumeCanvas
          className={styles.costumeCanvas}
          height={54}
          url={url}
          width={72}
        />
      ) : null}
      <InlineSVG
        className={styles.buttonNew}
        svg={IconNew}
        onClick={onNewBackdropClick}
      />
    </div>
  )
}

StageSelector.propTypes = {
  backdropCount: PropTypes.number.isRequired,
  fileInputRef: PropTypes.func,
  onBackdropFileUpload: PropTypes.func,
  onBackdropFileUploadClick: PropTypes.func,
  onClick: PropTypes.func,
  onEmptyBackdropClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onNewBackdropClick: PropTypes.func,
  onSurpriseBackdropClick: PropTypes.func,
  dispatchSetHoveredSprite: PropTypes.func,
  raised: PropTypes.bool.isRequired,
  receivedBlocks: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  url: PropTypes.string,
}

export default StageSelector
