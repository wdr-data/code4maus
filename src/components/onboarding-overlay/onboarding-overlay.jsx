import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import ButtonPrimary from '../button-primary/button-primary.jsx';
import { NEXT_STEP, customOffsets } from '../../lib/onboarding/config';

import styles from './onboarding-overlay.css';
import arrowLong from './arrow-3.svg';
import arrowShort from './arrow-1.svg';

const arrowOffset = {
    left: {
        targetX: -45,
        modalX: -40,
    },
    right: {
        targetX: -45,
        modalX: 48,
    },
    top: {
        targetY: 35,
        modalY: 200,
    },
    middle: {
        targetX: 0,
        targetY: -40,
        modalY: 20,
    },
    bottom: {
        targetY: 35,
        modalY: 200,
    },
};

const getPositions = (props, ref) => {
    if (!props.targetCoordinates) {
        return {
            modalStyle: {},
            arrow: null,
        };
    }

    const overlayBounds = ref.current ? ref.current.getBoundingClientRect() : {};

    const orientationX = props.targetCoordinates.x > overlayBounds.width / 2 ? 'left' : 'right';
    const quotientY = Math.floor(props.targetCoordinates.y / (overlayBounds.height / 3));
    const orientationY =
        quotientY < 1
            ? 'top'
            : quotientY < 2
                ? 'middle'
                : 'bottom';

    const offset = {
        ...arrowOffset[orientationX],
        ...arrowOffset[orientationY],
    };
    if (props.arrowTo in customOffsets) {
        offset.targetX = offset.targetX + customOffsets[props.arrowTo].x;
        offset.modalX = offset.modalX + customOffsets[props.arrowTo].x;
        offset.targetY = offset.targetY + customOffsets[props.arrowTo].y;
        offset.modalY = offset.modalY + customOffsets[props.arrowTo].y;
    }

    const modalStyle = {
        top: props.targetCoordinates.y + offset.modalY,
    };
    if (orientationX === 'left') {
        modalStyle.right = overlayBounds.width - (props.targetCoordinates.x + offset.modalX);
    } else if (orientationX === 'right') {
        modalStyle.left = props.targetCoordinates.x + offset.modalX;
    }

    const arrowStyle = {
        left: props.targetCoordinates.x + offset.targetX,
        top: props.targetCoordinates.y + offset.targetY,
    };

    return {
        modalStyle,
        arrow: <img
            src={orientationY === 'middle' ? arrowShort : arrowLong}
            className={classNames(styles.arrow, styles[`orientation-${orientationX}`], styles[`orientation-${orientationY}`])}
            style={arrowStyle}
        />,
    };
};

const OnboardingOverlayComponent = React.forwardRef((props, ref) => {
    const overlayClasses = classNames(
        styles.overlay,
        {
            [styles.dim]: props.dim,
            [styles.shown]: props.shown,
        },
    );

    const { modalStyle, arrow } = getPositions(props, ref);

    return (
        <div className={overlayClasses} ref={ref}>
            <Box
                className={classNames(styles.modal, { [styles.center]: !props.targetCoordinates })}
                style={modalStyle}
            >
                <p>{props.text}</p>
                {props.image && <img src={props.image} className={styles.image} />}
                {props.buttons.length > 0 &&
                    <div className={styles.buttons}>
                        {props.buttons.map((button) =>
                            <ButtonPrimary
                                key={button.text}
                                arrowRight={button.action === NEXT_STEP}
                                onClick={props.buttonClickFactory(button.action)}
                                className={styles.button}
                            >
                                {button.text}
                            </ButtonPrimary>
                        )}
                    </div>
                }
            </Box>
            {arrow}
        </div>
    );
});

OnboardingOverlayComponent.propTypes = {
    text: PropTypes.string.isRequired,
    arrowTo: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        action: PropTypes.oneOf([ PropTypes.string, PropTypes.func ]).isRequired,
    })),
    targetCoordinates: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    dim: PropTypes.bool,
    buttonClickFactory: PropTypes.func.isRequired,
    shown: PropTypes.bool,
    image: PropTypes.string,
};

OnboardingOverlayComponent.defaultProps = {
    arrowTo: '',
    buttons: [],
    targetCoordinates: null,
    dim: false,
};

export default OnboardingOverlayComponent;
