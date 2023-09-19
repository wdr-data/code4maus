import { injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import VM from 'scratch-vm'
import { Link } from 'redux-little-router'

import Controls from '../../containers/controls.jsx'
import Fullscreen from '../../containers/fullscreen.jsx'
import MenuButton from '../menu-button/menu-button.jsx'

import styles from './stage-header.css'
import saveIcon from '!raw-loader!../../../assets/icons/header_save.svg'
import menuIcon from '!raw-loader!../../../assets/icons/header_menu.svg'
import mailIcon from '!raw-loader!../../../assets/icons/menu_impressum.svg'

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
              <Link href="/impressum/" className={styles.copyright}>
                <span>&copy; WDR {new Date().getFullYear()}</span>
              </Link>
            </div>
            <div className={styles.menuWrapper} role="navigation">
              <MenuButton
                orientation="vertical"
                iconSvg={mailIcon}
                external
                linkTo="mailto:maus@wdr.de"
              >
                Feedback
              </MenuButton>
              <MenuButton
                orientation="vertical"
                id="save"
                iconSvg={saveIcon}
                onClick={onSaveProject}
              >
                Speichern
              </MenuButton>
              <MenuButton
                orientation="vertical"
                linkTo="/"
                className={styles.headerIcon}
                iconSvg={menuIcon}
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
  intl: intlShape,
  isFullScreen: PropTypes.bool.isRequired,
  onSaveProject: PropTypes.func.isRequired,
  vm: PropTypes.instanceOf(VM).isRequired,
}

export default injectIntl(StageHeaderComponent)
