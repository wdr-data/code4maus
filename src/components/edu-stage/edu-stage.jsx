import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import ButtonPrimary from '../button-primary/button-primary.jsx';
import styles from './edu-stage.css';
import fullScreenIcon from '../fullscreen/icon--fullscreen.svg';
import unFullScreenIcon from '../fullscreen/icon--unfullscreen.svg';
import { connect } from 'react-redux';
import { nextSlide, previousSlide, toggleFullscreen } from '../../reducers/edu-layer.js';

const EduStageComponent = (props) => !props.isEnabled ? null :
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
                arrowLeft grey
                onClick={props.previousSlide}
            >
                Zurück
            </ButtonPrimary>
            <p>{props.slideIndex + 1}/{props.slideCount}</p>
            <ButtonPrimary
                className={styles.forwardButton}
                arrowRight
                onClick={props.nextSlide}
            >
                Weiter
            </ButtonPrimary>
        </Box>
    </Box>
;

EduStageComponent.propTypes = {
    caption: PropTypes.string,
    imageSrc: PropTypes.string,
    isEnabled: PropTypes.bool,
    isFullscreen: PropTypes.bool,
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

    if (!base.isEnabled || base.slideIndex >= state.scratchGui.eduLayer.gameSpec.slides.length) {
        return base;
    }

    const slide = state.scratchGui.eduLayer.gameSpec.slides[state.scratchGui.eduLayer.index];
    return {
        ...base,
        imageSrc: slide.asset,
        caption: slide.caption || '',
    };
};

const mapDispatchToProps = {
    nextSlide,
    previousSlide,
    toggleFullscreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(EduStageComponent);
