import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'redux-little-router'

import VideoButtonModal from '../video-button-modal/video-button-modal.jsx'
import defaultImage from '../../../assets/img/meine_sachen.png'
import { useFeatureFlag, FEATURE_GAMESPREVIEW } from '../../lib/feature-flags'
import styles from './menu-listing.css'

const MenuListingComponent = (props) => {
  const showHidden = useFeatureFlag(FEATURE_GAMESPREVIEW)
  const { projects, isVideoListing } = props
  if (isVideoListing) {
    return projects.map((project) => (
      <VideoButtonModal
        key={project.key}
        title={project.title}
        note={project.note}
        image={project.image}
        video={project.video}
      />
    ))
  }
  return projects
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
  video: PropTypes.string,
  linkTo: PropTypes.string,
}

MenuListingComponent.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.shape(SHAPE_PROJECT)),
  isVideoListing: PropTypes.bool,
}

export default MenuListingComponent
