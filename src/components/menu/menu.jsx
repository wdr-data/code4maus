import React from 'react'
import classNames from 'classnames'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import tabStyles from 'react-tabs/style/react-tabs.css'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import InlineSVG from '../inline-svg/inline-svg.jsx'
import MenuButton from '../menu-button/menu-button.jsx'
import MenuListing, { SHAPE_PROJECT } from '../menu-listing/menu-listing.jsx'
import OfflineSupport from '../offline-support/offline-support.jsx'
import wdrLogo from '../../../assets/img/wdr_logo.svg'
import headLogo from '../../../assets/img/head_logo.png'

import { useFeatureFlag, FEATURE_OFFLINE } from '../../lib/feature-flags.js'
import styles from './menu.css'
import buttonNew from '!raw-loader!../../../assets/icons/menu_plus.svg'
import tabIconEdugames from '!raw-loader!../../../assets/icons/menu_edugames.svg'
import tabIconProjects from '!raw-loader!../../../assets/icons/menu_projects.svg'
import tabIconExamples from '!raw-loader!../../../assets/icons/menu_examples.svg'
import tabIconVideos from '!raw-loader!../../../assets/icons/icon_film.svg'
import buttonIconLehrerinnen from '!raw-loader!../../../assets/icons/menu_lehrer.svg'
import buttonIconInfo from '!raw-loader!../../../assets/icons/menu_eltern-info.svg'
import buttonIconMausseite from '!raw-loader!../../../assets/icons/menu_mausseite.svg'
import buttonIconDatenschutz from '!raw-loader!../../../assets/icons/icon_hilfe.svg'
import buttonIconImpressum from '!raw-loader!../../../assets/icons/menu_impressum.svg'
import { paEvent } from '../../lib/piano-analytics/main.js'
import { menuTabTitles } from '../../lib/piano-analytics/constants.js'

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
  //         <InlineSVG svg={svg} className={styles.tabIcon} />
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
          <Link href="/impressum/" className={styles.copyright}>
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
          onSelect={(index) => {
            paEvent.pageDisplay({ pages: ["Menu", menuTabTitles[index]], pageType: "Hauptseite" })
            return props.handleTabSelected(index)
          }}
        >
          <TabList className={tabClassNames.tabList}>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG svg={tabIconEdugames} className={styles.tabIcon} />
                <FormattedMessage
                  defaultMessage="Lernen"
                  id="gui.gui.eduGames"
                />
              </div>
            </Tab>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG svg={tabIconProjects} className={styles.tabIcon} />
                <FormattedMessage
                  defaultMessage="Meine Sachen"
                  id="gui.gui.games"
                />
              </div>
            </Tab>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG svg={tabIconExamples} className={styles.tabIcon} />
                <FormattedMessage
                  defaultMessage="Beispiele"
                  id="gui.gui.examples"
                />
              </div>
            </Tab>
            <Tab className={tabClassNames.tab}>
              <div className={styles.tabContent}>
                <InlineSVG svg={tabIconVideos} className={styles.tabIcon} />
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
              <Link href="/projekt/neu" className={styles.newButton}>
                <InlineSVG svg={buttonNew} className={styles.newButtonIcon} />
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
        <MenuButton iconSvg={buttonIconLehrerinnen} linkTo="/lehrkraefte">
          Lehrkräfte
        </MenuButton>
        <MenuButton iconSvg={buttonIconInfo} linkTo="/eltern">
          Eltern-Info
        </MenuButton>
        <MenuButton
          iconSvg={buttonIconMausseite}
          external
          linkTo="https://www.wdrmaus.de/"
          onClick={() => {
            paEvent.clickExit({
              pages: ['Menu', menuTabTitles[props.selectedTab]],
              pageType: 'Hauptseite',
              chapter1: 'Exit',
              chapter2: 'Zur Maus-Seite',
              target: "https://www.wdrmaus.de/"
            })
          }}
        >
          Zur Maus-Seite
        </MenuButton>
        <MenuButton iconSvg={buttonIconDatenschutz} linkTo="/datenschutz">
          Datenschutz
        </MenuButton>
        <MenuButton iconSvg={buttonIconImpressum} linkTo="/impressum">
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
