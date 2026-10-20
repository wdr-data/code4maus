import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import VM from 'scratch-vm'
import { Link } from 'react-router-dom'

import Controls from '../../containers/controls.jsx'
import Fullscreen from '../../containers/fullscreen.jsx'
import MenuButton from '../menu-button/menu-button.jsx'

import styles from './stage-header.css'
import SaveIcon from '../../../assets/icons/header_save.svg?component'
import MenuIcon from '../../../assets/icons/header_menu.svg?component'
import MailIcon from '../../../assets/icons/menu_impressum.svg?component'

const StageHeaderComponent = function (props) {
  const { isFullScreen, onSaveProject, vm, logPageInfo } = props

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
          logPageInfo={logPageInfo}
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
                IconSvg={MailIcon}
                external
                linkTo="mailto:maus@wdr.de"
              >
                Feedback
              </MenuButton>
              <MenuButton
                orientation="vertical"
                id="save"
                IconSvg={SaveIcon}
                onClick={onSaveProject}
              >
                Speichern
              </MenuButton>
              <MenuButton
                orientation="vertical"
                linkTo="/"
                className={styles.headerIcon}
                IconSvg={MenuIcon}
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

StageHeaderComponent.propTypes = {
  intl: PropTypes.object,
  isFullScreen: PropTypes.bool.isRequired,
  gameId: PropTypes.string,
  onSaveProject: PropTypes.func.isRequired,
  vm: PropTypes.instanceOf(VM).isRequired,
}

export default injectIntl(StageHeaderComponent)
