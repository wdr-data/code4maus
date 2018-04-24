import classNames from 'classnames';
import React from 'react';

import Box from '../box/box.jsx';

import styles from './menu-bar.css';

import scratchLogo from './scratch-logo.svg';

const MenuBar = props => (
    <Box className={styles.menuBar}>
        <div className={styles.mainMenu}>
            <div className={styles.fileGroup}>
                <div className={classNames(styles.menuBarItem)}>
                    <img
                        alt="Scratch"
                        className={styles.scratchLogo}
                        draggable={false}
                        src={scratchLogo}
                    />
                </div>
            </div>
        </div>
        <div className={classNames(styles.menuItem)}>
            <button
                className={styles.saveProjectButton}
                title="saveProject"
                onClick={props.saveProject}
            >
                Save
            </button>
        </div>
    </Box>
);

MenuBar.propTypes = {
    saveProject: PropTypes.func
};

export default MenuBar;
