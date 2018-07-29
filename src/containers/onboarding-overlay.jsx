import React from 'react';
import PropTypes from 'prop-types';

import OnboardingOverlayComponent from '../components/onboarding-overlay/onboarding-overlay.jsx';
import onboardingConfig, { NEXT_STEP } from '../lib/onboarding/config';

import { OnboardingRefs } from './onboarding-refs-provider.jsx';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';

class OnboardingOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.overlayRef = React.createRef();
        this.triggerRef = null;

        this.buttonClickFactory = this.buttonClickFactory.bind(this);
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
    }

    nextStep() {
        const nextStep = this.props.step + 1;
        if (nextStep >= onboardingConfig.steps.length) {
            console.log('OnboardingOverlay: Finished!');
            return;
        }
        this.props.setOnboardingStep(nextStep);
    }

    buttonClickFactory(action) {
        return (event) => {
            switch (action) {
            case NEXT_STEP:
                this.nextStep();
                break;
            default:
                console.warn('OnboardingOverlay: button action not implemented!');
            }
        };
    }

    getPositioning(arrowTarget) {
        if (!(
            this.props.capturedRefs &&
            this.overlayRef.current &&
            arrowTarget in this.props.capturedRefs &&
            this.props.capturedRefs[arrowTarget]
        )) {
            return null;
        }

        const ref = this.props.capturedRefs[arrowTarget];
        const targetBounds = ref.getBoundingClientRect();
        const overlayBounds = this.overlayRef.current.getBoundingClientRect();

        return {
            x: targetBounds.x + targetBounds.width/2 - overlayBounds.x,
            y: targetBounds.y + targetBounds.height/2 - overlayBounds.y,
        };
    }

    assignTrigger(triggerId) {
        if (!(this.props.capturedRefs && triggerId in this.props.capturedRefs)) {
            if (this.triggerRef) {
                this.triggerRef.removeEventListener('click', this.handleTriggerClick);
            }
            return;
        }

        const ref = this.props.capturedRefs[triggerId];
        if (ref === this.triggerRef) {
            return;
        }

        if (this.triggerRef) {
            this.triggerRef.removeEventListener('click', this.handleTriggerClick);
        }
        if (ref) {
            ref.addEventListener('click', this.handleTriggerClick);
        }
        this.triggerRef = ref;
    }

    handleTriggerClick(event) {
        this.nextStep();
    }

    render() {
        if (this.props.step < 0 || this.props.step >= onboardingConfig.steps.length) {
            return null;
        }

        const {
            trigger,
            ...componentProps
        } = onboardingConfig.steps[this.props.step];

        const targetCoords = this.getPositioning(componentProps.arrowTo);
        this.assignTrigger(trigger);

        return (
            <OnboardingOverlayComponent
                {...componentProps}
                targetCoordinates={targetCoords}
                buttonClickFactory={this.buttonClickFactory}
                ref={this.overlayRef}
                shown={this.props.shown}
            />
        );
    }
}

OnboardingOverlay.propTypes = {
    capturedRefs: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    step: PropTypes.number.isRequired,
    setOnboardingStep: PropTypes.func.isRequired,
};

const OnboardingOverlayConnected = connect(
    (state) => ({
        step: parseInt((state.router.params || {}).step) || 0,
    }),
    (dispatch) => ({
        setOnboardingStep: (step) => dispatch(push(`/onboarding/${step}`)),
    })
)(OnboardingOverlay);

const OnboardingOverlayConsumeRefs = (props) =>
    <OnboardingRefs>
        {(refs) => <OnboardingOverlayConnected capturedRefs={refs} {...props} />}
    </OnboardingRefs>;

export default OnboardingOverlayConsumeRefs;
