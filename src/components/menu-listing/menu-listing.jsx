import React from 'react';
import PropTypes from 'prop-types';

import Box from '../box/box.jsx';

import styles from './menu-listing.css';

const MenuListingComponent = (props) =>
    Object.entries(props.projects).map(([ key, project ]) => (
        <Box
            key={key}
            className={styles.projectWrapper}
            onClick={props.handleItemClickCreate(key)}
        >
            <img src="https://via.placeholder.com/200x150/fff/333?text=Projekt-Vorschau" />
            <span className={styles.projectName}>{project.name}</span>
            <span className={styles.projectChanged}>
                {new Date(project.updated_at).toLocaleDateString()}
            </span>
        </Box>
    ))
;

export const SHAPE_PROJECT = {
    name: PropTypes.string.isRequired,
    created_at: PropTypes.number.isRequired,
    updated_at: PropTypes.number.isRequired,
};

MenuListingComponent.propTypes = {
    projects: PropTypes.objectOf(PropTypes.shape(SHAPE_PROJECT)),
    handleItemClickCreate: PropTypes.func.isRequired,
};

export default MenuListingComponent;
