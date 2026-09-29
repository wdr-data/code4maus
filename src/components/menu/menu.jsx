import React from 'react'
import classNames from 'classnames'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import tabStyles from 'react-tabs/style/react-tabs.css'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import InlineSVG from '../inline-svg/inline-svg.jsx'
import MenuButton from '../menu-button/menu-button.jsx'
import MenuListing, { SHAPE_PROJECT } from '../menu-listing/menu-listing.jsx'
import OfflineSupport from '../offline-support/offline-support.jsx'
import wdrLogo from '../../../assets/img/wdr_logo.svg'
import headLogo from '../../../assets/img/head_logo.png'

import { useFeatureFlag, FEATURE_OFFLINE } from '../../lib/feature-flags.js'
import { paEvent } from '../../lib/piano-analytics/main.js'
import { menuTabTitles } from '../../lib/piano-analytics/constants.js'
import styles from './menu.css'
import ButtonNew from '../../../assets/icons/menu_plus.svg?component'
import TabIconEdugames from '../../../assets/icons/menu_edugames.svg?component'
import TabIconProjects from '../../../assets/icons/menu_projects.svg?component'
import TabIconExamples from '../../../assets/icons/menu_examples.svg?component'
import TabIconVideos from '../../../assets/icons/icon_film.svg?component'
import ButtonIconLehrerinnen from '../../../assets/icons/menu_lehrer.svg?component'
import ButtonIconInfo from '../../../assets/icons/menu_eltern-info.svg?component'
import ButtonIconMausseite from '../../../assets/icons/menu_mausseite.svg?component'
import ButtonIconDatenschutz from '../../../assets/icons/icon_hilfe.svg?component'
import ButtonIconImpressum from '../../../assets/icons/menu_impressum.svg?component'

// TODO: Use when updating react-intl (must use static values for now)
// const tabListData = {
//   0: { title: "Lernen", id: "gui.gui.eduGames", svg: tabIconEdugames },
//   1: { title: "Meine Sachen", id: "gui.gui.games", svg: tabIconProjects },
//   2: { title: "Beispiele", id: "gui.gui.examples", svg: tabIconExamples },
//   3: { title: "Videos", id: "gui.gui.videos", svg: tabIconVideos },
// }

export const MenuComponent = (props) => {
  const tabClassNames = {
    tabs: styles.tabs,
    tab: classNames(tabStyles.reactTabsTab, styles.tab),
    tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
    tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
    tabPanelSelected: classNames(
      tabStyles.reactTabsTabPanelSelected,
      styles.isSelected
    ),
    tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected),
  }

  // TODO: Use when updating react-intl
  // const menuTab = (index) => {
  //   const { title, id, svg } = tabListData[index]

  //   return (
  //     <Tab className={tabClassNames.tab}>
  //       <div className={styles.tabContent}>
  //         <InlineSVG Svg={svg} className={styles.tabIcon} />
  //         <FormattedMessage
  //           defaultMessage="{title}"
  //           values={{
  //             title: title
  //           }}
  //           id={id}
  //         />
  //       </div>
  //     </Tab>
  //   )
  // }

  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.header}>
        <div className={styles.firstColumn}>
          <img
            alt="WDR"
            className={styles.logo}
            draggable={false}
            src={wdrLogo}
          />
        </div>
        <div className={styles.secondColumn}>
          <img
            alt="head"
            className={styles.logoCenter}
            draggable={false}
            src={headLogo}
          />
        </div>
        <div className={styles.thirdColumn}>
          <Link to="/impressum/" className={styles.copyright}>
            <span>&#9400; WDR {new Date().getFullYear()}</span>
          </Link>
          {useFeatureFlag(FEATURE_OFFLINE) && <OfflineSupport />}
        </div>
      </div>
      <div className={styles.listingWrapper}>
        <Tabs
          className={styles.tabs}
          forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
          selectedTabClassName={tabClassNames.tabSelected}
          selectedTabPanelClassName={tabClassNames.tabPanelSelected}
          selectedIndex={props.selectedTab}
          onSelect={(index) =>
            index !== props.selectedTab && props.handleTabSelected(index)
          }
        >
          <TabList className={tabClassNames.tabList}>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG Svg={TabIconEdugames} className={styles.tabIcon} />
                <FormattedMessage
                  defaultMessage="Lernen"
                  id="gui.gui.eduGames"
                />
              </div>
            </Tab>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG Svg={TabIconProjects} className={styles.tabIcon} />
                <FormattedMessage
                  defaultMessage="Meine Sachen"
                  id="gui.gui.games"
                />
              </div>
            </Tab>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG Svg={TabIconExamples} className={styles.tabIcon} />
                <FormattedMessage
                  defaultMessage="Beispiele"
                  id="gui.gui.examples"
                />
              </div>
            </Tab>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG Svg={TabIconVideos} className={styles.tabIcon} />
                <FormattedMessage defaultMessage="Videos" id="gui.gui.videos" />
              </div>
            </Tab>
          </TabList>
          <TabPanel className={tabClassNames.tabPanel}>
            <div className={styles.sectionBody}>
              <MenuListing projects={props.eduGames} />
            </div>
          </TabPanel>
          <TabPanel className={tabClassNames.tabPanel}>
            <div className={styles.sectionBody}>
              <Link
                to={{
                  pathname: '/projekt/neu',
                  state: { isNewProject: true },
                }}
                className={styles.newButton}
              >
                <InlineSVG Svg={ButtonNew} className={styles.newButtonIcon} />
                Neu
              </Link>
              <MenuListing projects={props.projects} />
            </div>
          </TabPanel>
          <TabPanel className={tabClassNames.tabPanel}>
            <div className={styles.sectionBody}>
              {props.isOnline ? (
                <MenuListing projects={props.examples} />
              ) : (
                <p className={styles.offlineWarning}>
                  Beispiele sind offline leider nicht verfügbar.
                </p>
              )}
            </div>
          </TabPanel>
          <TabPanel className={tabClassNames.tabPanel}>
            <div className={styles.sectionBody}>
              <MenuListing projects={props.videos} isVideoListing />
            </div>
          </TabPanel>
        </Tabs>
      </div>
      <div className={styles.buttonRow}>
        <MenuButton IconSvg={ButtonIconLehrerinnen} linkTo="/lehrkraefte">
          Lehrkräfte
        </MenuButton>
        <MenuButton IconSvg={ButtonIconInfo} linkTo="/eltern">
          Eltern-Info
        </MenuButton>
        <MenuButton
          IconSvg={ButtonIconMausseite}
          external
          linkTo="https://www.wdrmaus.de/"
          onClick={() => {
            paEvent.clickExit({
              pages: ['Menu', menuTabTitles[props.selectedTab]],
              pageType: 'Hauptseite',
              chapter1: 'Exit',
              chapter2: 'Zur Maus-Seite',
              target: 'https://www.wdrmaus.de/',
            })
          }}
        >
          Zur Maus-Seite
        </MenuButton>
        <MenuButton IconSvg={ButtonIconDatenschutz} linkTo="/datenschutz">
          Datenschutz
        </MenuButton>
        <MenuButton IconSvg={ButtonIconImpressum} linkTo="/impressum">
          Impressum
        </MenuButton>
      </div>
    </div>
  )
}

MenuComponent.propTypes = {
  eduGames: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
  examples: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
  projects: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
  videos: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
  selectedTab: PropTypes.number.isRequired,
  handleTabSelected: PropTypes.func.isRequired,
  isOnline: PropTypes.bool,
}

export default MenuComponent
