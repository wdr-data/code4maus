import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import VM from 'scratch-vm'
import { Link } from 'react-router-dom'

import Controls from '../../containers/controls.jsx'
import Fullscreen from '../../containers/fullscreen.jsx'
import MenuButton from '../menu-button/menu-button.jsx'
import { guiTypePages, paEvent } from '../../lib/piano-analytics/main.js'

import styles from './stage-header.css'
import saveIcon from '!raw-loader!../../../assets/icons/header_save.svg'
import menuIcon from '!raw-loader!../../../assets/icons/header_menu.svg'
import mailIcon from '!raw-loader!../../../assets/icons/menu_impressum.svg'

const StageHeaderComponent = function (props) {
  const { isFullScreen, onSaveProject, vm, gameId } = props

  return (
    <div
      className={
        isFullScreen
          ? styles.stageHeaderWrapperOverlay
          : styles.stageHeaderWrapper
      }
    >
      <div className={styles.stageMenuWrapper}>
        <Controls
          className={styles.controls}
          vm={vm}
          isFullScreen={isFullScreen}
          onGreenFlagClick={() => sendPaEvent('clickAction', gameId, 'Los')}
          onStopAllClick={() => sendPaEvent('clickAction', gameId, 'Stopp')}
        />
        {isFullScreen ? (
          <Fullscreen />
        ) : (
          <div className={styles.flexWrapper}>
            <div className={styles.copyrightWrapper}>
              <Link to="/impressum/" className={styles.copyright}>
                <span>&copy; WDR {new Date().getFullYear()}</span>
              </Link>
            </div>
            <div className={styles.menuWrapper} role="navigation">
              <MenuButton
                orientation="vertical"
                iconSvg={mailIcon}
                external
                linkTo="mailto:maus@wdr.de"
                onClick={() => sendPaEvent('clickExit', gameId, 'Feedback')}
              >
                Feedback
              </MenuButton>
              <MenuButton
                orientation="vertical"
                id="save"
                iconSvg={saveIcon}
                onClick={() => {
                  sendPaEvent('clickAction', gameId, 'Speichern')
                  return onSaveProject()
                }}
              >
                Speichern
              </MenuButton>
              <MenuButton
                orientation="vertical"
                linkTo="/"
                className={styles.headerIcon}
                iconSvg={menuIcon}
                onClick={() => sendPaEvent('clickAction', gameId, 'Übersicht')}
              >
                Übersicht
              </MenuButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const sendPaEvent = (eventType, gameId, lastLevel) => {
  const pages = guiTypePages(gameId)
  pages.push(lastLevel)
  return paEvent[eventType]({ pages })
}

StageHeaderComponent.propTypes = {
  intl: intlShape,
  isFullScreen: PropTypes.bool.isRequired,
  gameId: PropTypes.string,
  onSaveProject: PropTypes.func.isRequired,
  vm: PropTypes.instanceOf(VM).isRequired,
}

export default injectIntl(StageHeaderComponent)
