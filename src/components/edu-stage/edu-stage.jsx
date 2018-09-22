import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { push } from 'redux-little-router';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import ButtonPrimary from '../button-primary/button-primary.jsx';
import styles from './edu-stage.css';
import fullScreenIcon from '../../../assets/blocks-media/zoom-in.svg';
import unFullScreenIcon from '../../../assets/blocks-media/zoom-out.svg';
import { connect } from 'react-redux';
import { nextSlide, previousSlide, toggleFullscreen } from '../../reducers/edu-layer.js';
import { eduUrl } from '../../lib/routing';

const EduStageComponent = (props) => !props.isEnabled ? null :
    <React.Fragment>
        {props.isDimmed && <div className={styles.dim} />}
        <Box className={classNames(styles.eduWrapper, { [styles.fullscreen]: props.isFullscreen })}>
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
                        src= {props.isFullscreen ? unFullScreenIcon : fullScreenIcon}
                    />
                </Button>
            </Box>
            <Box
                className={styles.eduSlides}
                style={{ backgroundImage: `url(/edu/${props.gameId}/assets/${props.imageSrc})` }}
            />
            <Box className={styles.eduFooter}>
                <ButtonPrimary
                    className={styles.backButton}
                    arrowLeft grey={props.slideIndex === 0}
                    onClick={props.previousSlide}
                >
                    Zurück
                </ButtonPrimary>
                <p>{props.slideIndex + 1}/{props.slideCount}</p>
                <ButtonPrimary
                    className={styles.forwardButton}
                    arrowRight wiggle={props.slideIndex === 0}
                    onClick={props.nextSlide}
                >
                    {!props.linkNextGame ? 'Weiter' : 'Nächstes Lernspiel'}
                </ButtonPrimary>
            </Box>
        </Box>
    </React.Fragment>
;

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
};

const mapStateToProps = (state) => {
    const base = {
        slideIndex: state.scratchGui.eduLayer.index,
        slideCount: state.scratchGui.eduLayer.size,
        isFullscreen: state.scratchGui.eduLayer.isFullscreen,
        isEnabled: state.scratchGui.eduLayer.enabled,
        imageSrc: '',
        gameId: state.scratchGui.eduLayer.gameId,
        caption: '',
    };

    const spec = state.scratchGui.eduLayer.gameSpec;
    if (!base.isEnabled || base.slideIndex >= spec.slides.length) {
        return base;
    }

    const slide = spec.slides[state.scratchGui.eduLayer.index];
    return {
        ...base,
        imageSrc: slide.asset,
        caption: slide.caption || '',
        isDimmed: !!slide.dim,
        linkNextGame: spec.nextGame && base.slideIndex >= base.slideCount-1,
        nextGame: spec.nextGame || '',
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
