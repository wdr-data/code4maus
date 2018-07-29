import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'redux-little-router';

import Box from '../box/box.jsx';

import styles from './menu-listing.css';

const MenuListingComponent = (props) =>
    props.projects.map((project) => (
        <Link
            href={project.linkTo}
            key={project.key}
            className={styles.projectWrapper}
        >
            <img src="https://via.placeholder.com/200x150/fff/333?text=Projekt-Vorschau" />
            <span className={styles.title}>
                {project.title}
            </span>
            <span className={styles.note}>
                {project.note}
            </span>
        </Link>
    ))
;

export const SHAPE_PROJECT = {
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    note: PropTypes.string,
    image: PropTypes.string,
    linkTo: PropTypes.string.isRequired,
};

MenuListingComponent.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
};

export default MenuListingComponent;
