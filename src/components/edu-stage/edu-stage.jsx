import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import Button from '../button/button.jsx';
import styles from './edu-stage.css';
import arrowIcon from '../gui/arrow.svg'
import fullScreenIcon from '../stage-header/icon--fullscreen.svg';
import {connect} from 'react-redux';
import {nextSlide, previousSlide, toggleFullscreen} from '../../reducers/edu-layer.js';

const EduStageComponent = props => !props.isEnabled ? null : (
    <Box className={classNames(styles.eduWrapper, {[styles.fullscreen]: props.isFullscreen})}>
        <Box className={styles.eduHeader}>
            <p>{props.slideIndex + 1}/{props.slideCount}</p>
            <Button className={styles.fullscreenButton} onClick={props.toggleFullscreen}>
                <img
                    className={styles.fullscreenButtonIcon}
                    draggable={false}
                    src={fullScreenIcon}
                    title="Full Screen Control"
                />
            </Button>
        </Box>
        <Box className={styles.eduSlides} style={{backgroundImage: `url(/edu-assets/${props.imageSrc})`}} />
        <Box className={styles.eduFooter}>
            <Button className={styles.backButton} onClick={props.previousSlide}>
                <img
                    className={styles.backButtonIcon}
                    draggable={false}
                    src={arrowIcon}
                    title="Back Arrow"
                />
            </Button>
            <Button className={styles.forwardButton} onClick={props.nextSlide}>
                <img
                    className={styles.forwardButtonIcon}
                    draggable={false}
                    src={arrowIcon}
                    title="Forward arrow"
                />
            </Button>
        </Box>
    </Box>
);

EduStageComponent.propTypes = {
    imageSrc: PropTypes.string,
    isEnabled: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    slideCount: PropTypes.number,
    slideIndex: PropTypes.number,
};

const mapStateToProps = (state) => ({
    slideIndex: state.eduLayer.index,
    slideCount: state.eduLayer.size,
    isFullscreen: state.eduLayer.isFullscreen,
    isEnabled: state.eduLayer.enabled,
    imageSrc: state.eduLayer.enabled ? state.eduLayer.gameSpec[state.eduLayer.index].asset : '',
});

const mapDispatchToProps = {
    nextSlide,
    previousSlide,
    toggleFullscreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(EduStageComponent);
