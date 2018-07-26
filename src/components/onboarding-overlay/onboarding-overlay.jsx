import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import ButtonPrimary from '../button-primary/button-primary.jsx';
import { NEXT_STEP } from '../../lib/onboarding/config';

import styles from './onboarding-overlay.css';
import arrowLeft from './arrow-3.svg';
import arrowRight from './arrow-4.svg';

const arrowOffset = {
    left: {
        targetX: -45,
        modalX: -40,
    },
    right: {
        targetX: -45,
        modalX: 48,
    },
    targetY: 35,
    modalY: 200,
};

const getPositions = (props, ref) => {
    if (!props.targetCoordinates) {
        return {
            modalStyle: {},
            arrow: null,
        };
    }

    const overlayBounds = ref.current ? ref.current.getBoundingClientRect() : {};

    const orientation = props.targetCoordinates.x > overlayBounds.width / 2 ? 'left' : 'right';
    const offset = {
        ...arrowOffset,
        ...arrowOffset[orientation],
    };

    const modalStyle = {
        top: props.targetCoordinates.y + offset.modalY,
    };
    if (orientation === 'left') {
        modalStyle.right = overlayBounds.width - (props.targetCoordinates.x + offset.modalX);
    } else if (orientation === 'right') {
        modalStyle.left = props.targetCoordinates.x + offset.modalX;
    }

    const arrowStyle = {
        left: props.targetCoordinates.x + offset.targetX,
        top: props.targetCoordinates.y + offset.targetY,
    };

    return {
        modalStyle,
        arrow: <img src={orientation === 'left' ? arrowLeft : arrowRight} className={styles.arrow} style={arrowStyle} />,
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
                <span>{props.text}</span>
                {props.buttons.length > 0 &&
                    <div className={styles.buttons}>
                        {props.buttons.map((button) =>
                            <ButtonPrimary
                                key={button.text}
                                arrowRight={button.action === NEXT_STEP}
                                onClick={props.buttonClickFactory(button.action)}
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
    buttons: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
    })),
    targetCoordinates: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    }),
    dim: PropTypes.bool,
    buttonClickFactory: PropTypes.func.isRequired,
    shown: PropTypes.bool,
};

OnboardingOverlayComponent.defaultProps = {
    buttons: [],
    targetCoordinates: null,
    dim: false,
};

export default OnboardingOverlayComponent;
