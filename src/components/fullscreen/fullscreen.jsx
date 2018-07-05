import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import {getStageSize} from '../../lib/screen-utils.js';
import styles from './fullscreen.css';

import fullScreenIcon from './icon--fullscreen.svg';
import largeStageIcon from './icon--large-stage.svg';
import smallStageIcon from './icon--small-stage.svg';
import unFullScreenIcon from './icon--fullscreen.svg';

const messages = defineMessages({
  largeStageSizeMessage: {
      defaultMessage: 'Switch to large stage',
      description: 'Button to change stage size to large',
      id: 'gui.stageHeader.stageSizeLarge'
  },
  smallStageSizeMessage: {
      defaultMessage: 'Switch to small stage',
      description: 'Button to change stage size to small',
      id: 'gui.stageHeader.stageSizeSmall'
  },
  fullStageSizeMessage: {
      defaultMessage: 'Enter full screen mode',
      description: 'Button to change stage size to full screen',
      id: 'gui.stageHeader.stageSizeFull'
  },
  unFullStageSizeMessage: {
      defaultMessage: 'Exit full screen mode',
      description: 'Button to get out of full screen mode',
      id: 'gui.stageHeader.stageSizeUnFull'
  },
  fullscreenControl: {
      defaultMessage: 'Full Screen Control',
      description: 'Button to enter/exit full screen mode',
      id: 'gui.stageHeader.fullscreenControl'
  }
});

const FullscreenComponent = props => {
  const {
  isFullScreen,
  onKeyPress,
  onSetStageFull,
  onSetStageUnFull,
  ...boxProps
  } = props;

  let fullscreenButton = null;

  if (isFullScreen) {
    fullscreenButton = (
      <Button
        className={styles.stageButtonFullscreen}
        onClick={onSetStageUnFull}
        onKeyPress={onKeyPress}
      >
        <img
            alt={props.intl.formatMessage(messages.unFullStageSizeMessage)}
            className={styles.stageButtonIcon}
            draggable={false}
            src={unFullScreenIcon}
            title={props.intl.formatMessage(messages.fullscreenControl)}
        />
      </Button>
    );
  } else {
    fullscreenButton = (
      <Button
        className={styles.stageButton}
        onClick={onSetStageFull}
      >
        <img
            alt={props.intl.formatMessage(messages.fullStageSizeMessage)}
            className={styles.stageButtonIcon}
            draggable={false}
            src={fullScreenIcon}
            title={props.intl.formatMessage(messages.fullscreenControl)}
        />
      </Button>
    )
  }

  return fullscreenButton;
}

FullscreenComponent.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onSetStageFull: PropTypes.func.isRequired,
  onSetStageUnFull: PropTypes.func.isRequired,
  intl: intlShape
};

export default injectIntl(FullscreenComponent);
