import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Modal from '../modal/modal.jsx'
import VideoPlayer from '../video-player/video-player.jsx'

import defaultImage from '../../../assets/img/meine_sachen.png'
import styles from '../menu-listing/menu-listing.css'

const VideoButtonModal = ({ title, image, note, video }) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <div
        className={styles.projectWrapper}
        role="button"
        onClick={() => setShowModal(true)}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.image}>
          {image ? <img src={image} /> : <img src={defaultImage} />}
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
