import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import defaultImage from '../../../assets/img/meine_sachen.png'
import { useFeatureFlag, FEATURE_GAMESPREVIEW } from '../../lib/feature-flags'
import styles from './menu-listing.css'

const MenuListingComponent = (props) => {
  const showHidden = useFeatureFlag(FEATURE_GAMESPREVIEW)
  return props.projects
    .filter((p) => !p.hidden || showHidden)
    .map((project) => (
      <Link
        href={project.linkTo}
        key={project.key}
        className={styles.projectWrapper}
      >
        <span className={styles.title}>{project.title}</span>
        <span className={styles.image}>
          {project.image ? (
            <img src={project.image} />
          ) : (
            <img src={defaultImage} />
          )}
        </span>
        <span className={styles.note}>{project.note}</span>
      </Link>
    ))
}

export const SHAPE_PROJECT = {
  key: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  note: PropTypes.string,
  image: PropTypes.boolean,
  linkTo: PropTypes.string.isRequired,
}

MenuListingComponent.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
}

export default MenuListingComponent
