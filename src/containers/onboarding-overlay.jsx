import React from 'react';
import PropTypes from 'prop-types';

import OnboardingOverlayComponent from '../components/onboarding-overlay/onboarding-overlay.jsx';
import onboardingConfig, { NEXT_STEP } from '../lib/onboarding/config';

import { OnboardingRefs } from './onboarding-refs-provider.jsx';

class OnboardingOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stepIndex: 0,
        };
        this.overlayRef = React.createRef();
        this.triggerRef = null;

        this.buttonClickFactory = this.buttonClickFactory.bind(this);
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
    }

    buttonClickFactory(action) {
        return (event) => {
            switch (action) {
            case NEXT_STEP:
                if (this.state.stepIndex + 1 === onboardingConfig.steps.length) {
                    console.log('OnboardingOverlay: Finished!');
                    break;
                }
                this.setState({ stepIndex: this.state.stepIndex + 1 });
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
                this.triggerRef.removeEventListener('click', this.handleClick);
            }
            return;
        }

        const ref = this.props.capturedRefs[triggerId];
        if (ref === this.triggerRef) {
            return;
        }

        if (this.triggerRef) {
            this.triggerRef.removeEventListener('click', this.handleClick);
        }
        ref.addEventListener('click', this.handleTriggerClick);
        this.triggerRef = ref;
    }

    handleTriggerClick(event) {
        this.setState({ stepIndex: this.state.stepIndex + 1 });
    }

    render() {
        if (this.state.stepIndex < 0 || this.state.stepIndex >= onboardingConfig.steps.length) {
            return null;
        }

        const {
            arrowTo,
            trigger,
            ...componentProps
        } = onboardingConfig.steps[this.state.stepIndex];

        const targetCoords = this.getPositioning(arrowTo);
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
};

const OnboardingOverlayConsumeRefs = (props) =>
    <OnboardingRefs>
        {(refs) => <OnboardingOverlay capturedRefs={refs} {...props} />}
    </OnboardingRefs>;

export default OnboardingOverlayConsumeRefs;
