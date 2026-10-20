import PropTypes from 'prop-types'
import React, { useState } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { history } from '../../lib/app-state-hoc.jsx'

import fullScreenIcon from '../../../assets/blocks-media/zoom-in.svg'
import unFullScreenIcon from '../../../assets/blocks-media/zoom-out.svg'
import Modal from '../modal/modal.jsx'
import Button from '../button/button.jsx'
import {
  nextSlide,
  previousSlide,
  toggleFullscreen,
} from '../../reducers/edu-layer.js'
import { eduUrl } from '../../lib/routing'
import { gamesKeyed } from '../../lib/edu/'
import VideoPlayer from '../video-player/video-player.jsx'
import { buildGuiPage, paEvent } from '../../lib/piano-analytics/main'
import styles from './edu-stage.css'

const EduStageComponent = (props) => {
  const [isPreVideoModalOpen, setPreVideoModalOpen] = useState(false)
  const [isPostVideoModalOpen, setPostVideoModalOpen] = useState(true)
  return !props.isEnabled ? null : (
    <>
      {props.preVideo && isPreVideoModalOpen && (
        <Modal
          fullscreen
          contentLabel={'Erklärvideo'}
          onRequestClose={() => setPreVideoModalOpen(false)}
        >
          <div className={styles.content}>
            <VideoPlayer src={props.preVideo} />
          </div>
        </Modal>
      )}
      {props.postVideo &&
        props.slideIndex >= props.slideCount - 1 &&
        isPostVideoModalOpen && (
          <Modal
            fullscreen
            contentLabel={'Video'}
            onRequestClose={() => setPostVideoModalOpen(false)}
          >
            <div className={styles.content}>
              <VideoPlayer src={props.postVideo} />
            </div>
          </Modal>
        )}
      {props.isDimmed && <div className={styles.dim} />}
      <div
        aria-label="Lernspiel"
        className={classNames(styles.eduWrapper, {
          [styles.fullscreen]: props.isFullscreen,
        })}
      >
        <div className={styles.eduHeader}>
          <div className={styles.caption}>{props.caption}</div>
          <Button
            className={styles.fullscreenButton}
            onClick={() => {
              sendPaEvent(props, 'Fullscreen')
              return props.toggleFullscreen()
            }}
          >
            <img
              className={styles.fullscreenButtonIcon}
              draggable={false}
              src={props.isFullscreen ? unFullScreenIcon : fullScreenIcon}
              title={props.isFullscreen ? 'Verkleinern' : 'Vergrößern'}
            />
          </Button>
        </div>
        <div className={styles.eduSlides}>
          {props.imageSrc &&
            (props.imageSrc.split('.').pop() === 'mp4' ? (
              <video
                className={styles.images}
                src={props.imageSrc}
                autoPlay
                loop
              />
            ) : (
              <img className={styles.images} src={props.imageSrc} />
            ))}
        </div>
        <div className={styles.eduFooter}>
          <Button
            arrowLeft
            style="primary"
            disabled={props.slideIndex === 0}
            onClick={() => {
              sendPaEvent(props, 'Zurück')
              return props.previousSlide()
            }}
          >
            Zurück
          </Button>
          <p>
            {props.slideIndex + 1}/{props.slideCount}
          </p>
          <Button
            arrowRight
            style="primary"
            wiggle={props.slideIndex === 0 && !props.finished}
            onClick={() => {
              sendPaEvent(props, 'Weiter')
              return props.nextSlide()
            }}
            disabled={props.finished}
          >
            {!props.linkNextGame ? 'Weiter' : 'Nächstes Lernspiel'}
          </Button>
        </div>
      </div>
    </>
  )
}

const sendPaEvent = (props, clickName) => {
  const pages = buildGuiPage(props.gameId, false, props.activeTabIndex)

  // 1-based number of the slide shown after the click
  let target = `${props.slideIndex + 1}/${props.slideCount}`
  if (clickName == 'Zurück') {
    target = `${props.slideIndex}/${props.slideCount}`
  } else if (clickName == 'Weiter') {
    target = !props.linkNextGame
      ? `${props.slideIndex + 2}/${props.slideCount}`
      : 'Nächstes Lernspiel'
  }

  paEvent.clickAction({
    pages,
    pageType: 'Spiele',
    chapter1: 'Tutorial',
    chapter2: clickName,
    target,
  })
}

EduStageComponent.propTypes = {
  caption: PropTypes.string,
  imageSrc: PropTypes.string,
  isDimmed: PropTypes.bool,
  isEnabled: PropTypes.bool,
  isFullscreen: PropTypes.bool,
  linkNextGame: PropTypes.bool,
  gameId: PropTypes.string,
  nextSlide: PropTypes.func.isRequired,
  previousSlide: PropTypes.func.isRequired,
  slideCount: PropTypes.number,
  slideIndex: PropTypes.number,
  toggleFullscreen: PropTypes.func.isRequired,
  finished: PropTypes.bool,
  activeTabIndex: PropTypes.number,
  preVideo: PropTypes.string,
  postVideo: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const base = {
    slideIndex: state.scratchGui.eduLayer.index,
    slideCount: 0,
    isFullscreen: state.scratchGui.eduLayer.isFullscreen,
    isEnabled: state.scratchGui.eduLayer.enabled,
    imageSrc: '',
    gameId: ownProps.match.params.eduId,
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    caption: '',
  }

  const spec = gamesKeyed[base.gameId]
  if (!base.isEnabled || !spec || base.slideIndex >= spec.slides.length) {
    return base
  }

  const slide = spec.slides[state.scratchGui.eduLayer.index]
  return {
    ...base,
    imageSrc: slide.asset,
    slideCount: spec.slides.length,
    caption: slide.caption || '',
    isDimmed: !!slide.dim,
    linkNextGame: spec.nextGame && base.slideIndex >= spec.slides.length - 1,
    nextGame: spec.nextGame || '',
    finished: !spec.nextGame && base.slideIndex >= spec.slides.length - 1,
    preVideo: spec.preVideo || '',
    postVideo: spec.postVideo || '',
  }
}

const mapDispatchToProps = {
  // loadGame: (gameId) => history.push(eduUrl(gameId)),
  nextSlide,
  previousSlide,
  toggleFullscreen,
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    nextSlide: stateProps.linkNextGame
      ? () => history.push(eduUrl(stateProps.nextGame))
      : dispatchProps.nextSlide,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EduStageComponent)
