import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';
import { push } from 'redux-little-router';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import Modal from '../modal/modal.jsx';
import styles from './edu-stage.css';
import fullScreenIcon from '../../../assets/blocks-media/zoom-in.svg';
import unFullScreenIcon from '../../../assets/blocks-media/zoom-out.svg';
import { connect } from 'react-redux';
import { nextSlide, previousSlide, toggleFullscreen } from '../../reducers/edu-layer.js';
import { eduUrl } from '../../lib/routing';
import { gamesKeyed } from '../../lib/edu/';
import VideoPlayer from '../video-player/video-player.jsx';

const EduStageComponent = (props) => {
    const [ isPreVideoModalOpen, setPreVideoModalOpen ] = useState(true);
    const [ isPostVideoModalOpen, setPostVideoModalOpen ] = useState(true);
    return !props.isEnabled ? null :
        <React.Fragment>
            {props.preVideo && isPreVideoModalOpen && <Modal
                fullscreen
                contentLabel={'Erklärvideo'}
                onRequestClose={() => setPreVideoModalOpen(false)}
            >
                <div className={styles.content}>
                    <VideoPlayer src={props.preVideo} />
                </div>
            </Modal>}
            {props.postVideo && props.slideIndex >= props.slideCount - 1 && isPostVideoModalOpen && <Modal
                fullscreen
                contentLabel={'Video'}
                onRequestClose={() => setPostVideoModalOpen(false)}
            >
                <div className={styles.content}>
                    <VideoPlayer src={props.postVideo} />
                </div>
            </Modal>}
            {props.isDimmed && <div className={styles.dim} />}
            <Box
                aria-label="Lernspiel"
                className={classNames(styles.eduWrapper, { [styles.fullscreen]: props.isFullscreen })}
            >
                <Box className={styles.eduHeader}>
                    <Box className={styles.caption}>
                        {props.caption}
                    </Box>
                    <Button
                        className={styles.fullscreenButton}
                        onClick={props.toggleFullscreen}
                    >
                        <img
                            className={styles.fullscreenButtonIcon}
                            draggable={false}
                            src={props.isFullscreen ? unFullScreenIcon : fullScreenIcon}
                            title={props.isFullscreen ? 'Verkleinern' : 'Vergrößern'}
                        />
                    </Button>
                </Box>
                <Box
                    className={styles.eduSlides}
                >
                    {props.imageSrc && ((props.imageSrc.split('.').pop() === 'mp4') ?
                        <video
                            className={styles.images}
                            src={props.imageSrc}
                            autoPlay
                            loop
                        />
                        :
                        <img
                            className={styles.images}
                            src={props.imageSrc}
                        />
                    )}
                </Box>
                <Box className={styles.eduFooter}>
                    <Button
                        arrowLeft style='primary' disabled={props.slideIndex === 0}
                        onClick={props.previousSlide}
                    >
                    Zurück
                    </Button>
                    <p>{props.slideIndex + 1}/{props.slideCount}</p>
                    <Button
                        arrowRight style='primary' wiggle={props.slideIndex === 0 && !props.finished}
                        onClick={props.nextSlide}
                        disabled={props.finished}
                    >
                        {!props.linkNextGame ? 'Weiter' : 'Nächstes Lernspiel'}
                    </Button>
                </Box>
            </Box>
        </React.Fragment>;
};

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
    preVideo: PropTypes.string,
    postVideo: PropTypes.string,
};

const mapStateToProps = (state) => {
    const base = {
        slideIndex: state.scratchGui.eduLayer.index,
        slideCount: 0,
        isFullscreen: state.scratchGui.eduLayer.isFullscreen,
        isEnabled: state.scratchGui.eduLayer.enabled,
        imageSrc: '',
        gameId: state.scratchGui.eduLayer.gameId,
        caption: '',
    };

    const spec = gamesKeyed[base.gameId];
    if (!base.isEnabled || base.slideIndex >= spec.slides.length) {
        return base;
    }

    const slide = spec.slides[state.scratchGui.eduLayer.index];
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
    };
};

const mapDispatchToProps = {
    loadGame: (gameId) => push(eduUrl(gameId)),
    nextSlide,
    previousSlide,
    toggleFullscreen,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    nextSlide: stateProps.linkNextGame ? () => dispatchProps.loadGame(stateProps.nextGame) : dispatchProps.nextSlide,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(EduStageComponent);
