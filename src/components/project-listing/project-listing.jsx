import React from 'react';
import styles from './project-listing.css';
import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import classNames from 'classnames';
import { Link } from 'redux-little-router';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import { FormattedMessage } from 'react-intl';

import wdrLogo from '../../../assets/img/wdr_logo.svg';
import headLogo from '../../../assets/img/head_logo.png';

export const ProjectListingComponent = props => {

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
                >
                    <TabList className={tabClassNames.tabList}>
                        <Tab className={tabClassNames.tab}>
                            <Box className={styles.tabContent}>
                                <FormattedMessage
                                    defaultMessage="Lernen"
                                    id="gui.gui.eduGames"
                                />
                            </Box>
                        </Tab>
                        <Tab className={tabClassNames.tab}>
                            <Box className={styles.tabContent}>
                                <FormattedMessage
                                    defaultMessage="Selber machen"
                                    id="gui.gui.games"
                                />
                            </Box>
                        </Tab>
                        <Tab className={tabClassNames.tab}>
                            <Box className={styles.tabContent}>
                                <FormattedMessage
                                    defaultMessage="Beispiele"
                                    id="gui.gui.examples"
                                />
                            </Box>
                        </Tab>
                    </TabList>
                    <TabPanel className={tabClassNames.tabPanel}>
                    </TabPanel>
                    <TabPanel className={tabClassNames.tabPanel}>
                        <Box className={styles.sectionBody}>
                            <Button className={styles.newButton}>
                                <div className={styles.newButtonIcon}>
                                    <svg viewBox="0 0 37.29 37.3"
                                        height="37.3"
                                        width="37.29">
                                        <rect
                                            id="rect6"
                                            fill="#fff"
                                            height="21.31"
                                            width="4.74"
                                            y="7.99"
                                            x="16.28" />
                                        <rect
                                            id="rect8"
                                            fill="#fff"
                                            transform="translate(37.3 0) rotate(90)"
                                            height="21.31"
                                            width="4.74"
                                            y="7.99"
                                            x="16.28" />
                                    </svg>
                                </div>
                                Neu
                            </Button>
                            {Object.keys(props.projects).map(key => (
                                <Box key={key} className={styles.projectWrapper}>
                                    <Link href={`/projekt/${key}`} className={styles.projectName}>{props.projects[key].name}</Link>
                                    <span className={styles.projectChanged}>{new Date(props.projects[key].updated_at).toLocaleDateString()}</span>
                                </Box>
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel className={tabClassNames.tabPanel}>
                    </TabPanel>
                </Tabs>
            </Box>
        </Box>
    );
};

export default ProjectListingComponent;
