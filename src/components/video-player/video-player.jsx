import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Hls from 'hls.js'
import styles from './video-player.css'

const VideoPlayer = (props) => {
  const videoRef = useRef(null)
  useEffect(() => {
    const video = videoRef.current
    if (video === null) {
      return
    }
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(props.src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
      // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
      // This is using the built-in support of the plain video element, without using hls.js.
      // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
      // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
      video.src = props.src
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }
  }, [videoRef, props.src])
  return <video className={styles.video} controls ref={videoRef} />
}

VideoPlayer.propTypes = {
  src: PropTypes.string,
}

export default VideoPlayer
