import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import styles from './audio-trimmer.css'
import handleIcon from './icon--handle.svg'

const AudioTrimmer = (props) => (
  <div className={styles.absolute} ref={props.containerRef}>
    {props.trimStart === null ? null : (
      <div
        className={classNames(
          styles.absolute,
          styles.trimBackground,
          styles.startTrimBackground
        )}
        style={{
          width: `${100 * props.trimStart}%`,
        }}
        onMouseDown={props.onTrimStartMouseDown}
        onTouchStart={props.onTrimStartMouseDown}
      >
        <div
          className={classNames(styles.absolute, styles.trimBackgroundMask)}
        />
        <div className={classNames(styles.trimLine, styles.startTrimLine)}>
          <div
            className={classNames(
              styles.trimHandle,
              styles.topTrimHandle,
              styles.startTrimHandle
            )}
          >
            <img src={handleIcon} />
          </div>
          <div
            className={classNames(
              styles.trimHandle,
              styles.bottomTrimHandle,
              styles.startTrimHandle
            )}
          >
            <img src={handleIcon} />
          </div>
        </div>
      </div>
    )}

    {props.playhead ? (
      <div
        className={classNames(styles.trimLine, styles.playhead)}
        style={{
          left: `${100 * props.playhead}%`,
        }}
      />
    ) : null}

    {props.trimEnd === null ? null : (
      <div
        className={classNames(
          styles.absolute,
          styles.trimBackground,
          styles.endTrimBackground
        )}
        style={{
          left: `${100 * props.trimEnd}%`,
          width: `${100 - 100 * props.trimEnd}%`,
        }}
        onMouseDown={props.onTrimEndMouseDown}
        onTouchStart={props.onTrimEndMouseDown}
      >
        <div
          className={classNames(styles.absolute, styles.trimBackgroundMask)}
        />
        <div className={classNames(styles.trimLine, styles.endTrimLine)}>
          <div
            className={classNames(
              styles.trimHandle,
              styles.topTrimHandle,
              styles.endTrimHandle
            )}
          >
            <img src={handleIcon} />
          </div>
          <div
            className={classNames(
              styles.trimHandle,
              styles.bottomTrimHandle,
              styles.endTrimHandle
            )}
          >
            <img src={handleIcon} />
          </div>
        </div>
      </div>
    )}
  </div>
)
AudioTrimmer.propTypes = {
  containerRef: PropTypes.func,
  onTrimEndMouseDown: PropTypes.func.isRequired,
  onTrimStartMouseDown: PropTypes.func.isRequired,
  playhead: PropTypes.number,
  trimEnd: PropTypes.number,
  trimStart: PropTypes.number,
}

export default AudioTrimmer
