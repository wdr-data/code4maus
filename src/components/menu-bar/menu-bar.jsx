import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Box from '../box/box.jsx';
import {openSaveProject} from '../../reducers/modals';

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
            <h3>{props.projectName}</h3>
        </div>
        <div className={classNames(styles.menuItem)}>
            <button
                className={styles.saveProjectButton}
                title="saveProject"
                onClick={props.onSaveProject}
            >
                Save
            </button>
        </div>
    </Box>
);

MenuBar.propTypes = {
    onSaveProject: PropTypes.func,
};

const mapStateToProps = state => ({
    projectName: state.project.name
});

const mapDispatchToProps = dispatch => ({
    onSaveProject: () => {
        dispatch(openSaveProject());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuBar);
