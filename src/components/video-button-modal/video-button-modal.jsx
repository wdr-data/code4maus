import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import Modal from '../modal/modal.jsx'
import VideoPlayer from '../video-player/video-player.jsx'

import defaultImage from '../../../assets/img/meine_sachen.png'
import { paEvent } from '../../lib/piano-analytics/main.js'
import { menuTabTitles } from '../../lib/piano-analytics/constants.js'
import styles from './video-button-modal.css'

const VideoButtonModal = ({ title, image, note, video }) => {
  const [showModal, setShowModal] = useState(false)
  // Use the '(' in the title string to split it into two lines
  let [firstline, secondline] = title.split('(')
  // Add the '(' back to the 2nd line for correct display
  secondline = secondline ? `(${secondline}` : ''

  useEffect(() => {
    if (!showModal) return

    paEvent.pageDisplay({
      pages: ['Menu', menuTabTitles[3], `Video ${note}`],
      pageType: 'Video',
    })
  }, [showModal])

  return (
    <>
      <div
        className={styles.projectWrapper}
        role="button"
        onClick={() => setShowModal(true)}
      >
        <div className={styles.title}>
          <span>
            {firstline}
            <br />
            {secondline}
          </span>
        </div>
        <span className={styles.image}>
          <img src={image || defaultImage} />
        </span>
        <span className={styles.note}>{note}</span>
      </div>
      {showModal && (
        <Modal
          fullscreen
          contentLabel={title}
          onRequestClose={() => setShowModal(false)}
        >
          <div className={styles.videoContent}>
            <VideoPlayer src={video} />
          </div>
        </Modal>
      )}
    </>
  )
}
VideoButtonModal.propTypes = {
  image: PropTypes.string,
  note: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  video: PropTypes.string.isRequired,
}

export default VideoButtonModal
