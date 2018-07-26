import PropTypes from 'prop-types';
import React from 'react';

import { OnboardingCapture } from '../../containers/onboarding-refs-provider.jsx';
import { TRIGGER_REFS } from '../../lib/onboarding/config';

import stopAllIcon from './stop@2x.png';

const StopAllComponent = function(props) {
    const {
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <OnboardingCapture componentId={TRIGGER_REFS.stopButton}>
            {(captureRef) => <img
                ref={captureRef}
                draggable={false}
                src={stopAllIcon}
                title={title}
                onClick={onClick}
                {...componentProps}
            />}
        </OnboardingCapture>
    );
};

StopAllComponent.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};

StopAllComponent.defaultProps = {
    title: 'Stop',
};

export default StopAllComponent;
