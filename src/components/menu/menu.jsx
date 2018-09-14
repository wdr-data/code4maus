import React from 'react';
import classNames from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'redux-little-router';

import Box from '../box/box.jsx';
import MenuListing from '../menu-listing/menu-listing.jsx';
import InlineSVG from '../inline-svg/inline-svg.jsx';
import MenuButton from '../menu-button/menu-button.jsx';
import wdrLogo from '../../../assets/img/wdr_logo.svg';
import headLogo from '../../../assets/img/head_logo.png';
import { SHAPE_PROJECT } from '../menu-listing/menu-listing.jsx';

import buttonNew from '!raw-loader!../../../assets/icons/menu_plus.svg';
import tabIconEdugames from '!raw-loader!../../../assets/icons/menu_edugames.svg';
import tabIconProjects from '!raw-loader!../../../assets/icons/menu_projects.svg';
import tabIconExamples from '!raw-loader!../../../assets/icons/menu_examples.svg';
import buttonIconInfo from '!raw-loader!../../../assets/icons/menu_eltern-info.svg';
import buttonIconMausseite from '!raw-loader!../../../assets/icons/menu_mausseite.svg';
import buttonIconImpressum from '!raw-loader!../../../assets/icons/menu_impressum.svg';
import styles from './menu.css';

export const MenuComponent = (props) => {
    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    return (
        <Box className={styles.bodyWrapper}>
            <Box className={styles.header}>
                <Box className={styles.firstColumn}>
                    <img
                        alt="WDR"
                        className={styles.logo}
                        draggable={false}
                        src={wdrLogo}
                    />
                </Box>
                <Box className={styles.secondColumn}>
                    <img
                        alt="head"
                        className={styles.logoCenter}
                        draggable={false}
                        src={headLogo}
                    />
                </Box>
                <Box className={styles.thirdColumn}>

                </Box>
            </Box>
            <Box className={styles.listingWrapper}>
                <Tabs
                    className={styles.tabs}
                    forceRenderTabPanel={true} // eslint-disable-line react/jsx-boolean-value
                    selectedTabClassName={tabClassNames.tabSelected}
                    selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                    selectedIndex={props.selectedTab}
                    onSelect={props.handleTabSelected}
                >
                    <TabList className={tabClassNames.tabList}>
                        <Tab className={tabClassNames.tab}>
                            <Box className={styles.tabContent}>
                                <InlineSVG svg={tabIconEdugames} className={styles.tabIcon} />
                                <FormattedMessage
                                    defaultMessage="Lernen"
                                    id="gui.gui.eduGames"
                                />
                            </Box>
                        </Tab>
                        <Tab className={tabClassNames.tab}>
                            <Box className={styles.tabContent}>
                                <InlineSVG svg={tabIconProjects} className={styles.tabIcon} />
                                <FormattedMessage
                                    defaultMessage="Meine Sachen"
                                    id="gui.gui.games"
                                />
                            </Box>
                        </Tab>
                        <Tab className={tabClassNames.tab}>
                            <Box className={styles.tabContent}>
                                <InlineSVG svg={tabIconExamples} className={styles.tabIcon} />
                                <FormattedMessage
                                    defaultMessage="Beispiele"
                                    id="gui.gui.examples"
                                />
                            </Box>
                        </Tab>
                    </TabList>
                    <TabPanel className={tabClassNames.tabPanel}>
                        <Box className={styles.sectionBody}>
                            <MenuListing projects={props.eduGames} />
                        </Box>
                    </TabPanel>
                    <TabPanel className={tabClassNames.tabPanel}>
                        <Box className={styles.sectionBody}>
                            <Link href="/projekt/neu" className={styles.newButton}>
                                <InlineSVG svg={buttonNew} className={styles.newButtonIcon} />
                                Neu
                            </Link>
                            <MenuListing projects={props.projects} />
                        </Box>
                    </TabPanel>
                    <TabPanel className={tabClassNames.tabPanel}>
                        <Box className={styles.sectionBody} />
                    </TabPanel>
                </Tabs>
            </Box>
            <Box className={styles.buttonRow}>
                <MenuButton iconSvg={buttonIconInfo} linkTo="/inhalte/eltern">
                    Eltern-Info
                </MenuButton>
                <MenuButton iconSvg={buttonIconMausseite} external linkTo="https://www.wdrmaus.de/">
                    Hier geht's zur Maus Seite
                </MenuButton>
                <MenuButton iconSvg={buttonIconImpressum} linkTo="/inhalte/datenschutz">
                    Datenschutz
                </MenuButton>
                <MenuButton iconSvg={buttonIconImpressum} linkTo="/inhalte/impressum">
                    Impressum
                </MenuButton>
            </Box>
        </Box>
    );
};

MenuComponent.propTypes = {
    eduGames: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
    projects: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
    selectedTab: PropTypes.number.isRequired,
    handleTabSelected: PropTypes.func.isRequired,
};

export default MenuComponent;
