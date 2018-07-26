import PropTypes from 'prop-types';
import React from 'react';

import { OnboardingCapture } from '../../containers/onboarding-refs-provider.jsx';
import { TRIGGER_REFS } from '../../lib/onboarding/config';

import greenFlagIcon from './play@2x.png';

const GreenFlagComponent = function(props) {
    const {
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <OnboardingCapture componentId={TRIGGER_REFS.startButton}>
            {(captureRef) => <img
                ref={captureRef}
                draggable={false}
                src={greenFlagIcon}
                title={title}
                onClick={onClick}
                {...componentProps}
            />}
        </OnboardingCapture>
    );
};
GreenFlagComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};
GreenFlagComponent.defaultProps = {
    title: 'Go',
};
export default GreenFlagComponent;
