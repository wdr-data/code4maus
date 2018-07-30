import React from 'react';
import PropTypes from 'prop-types';

import OnboardingOverlayComponent from '../components/onboarding-overlay/onboarding-overlay.jsx';
import onboardingConfig, { NEXT_STEP, customBlocks } from '../lib/onboarding/config';
import { setProjectId, setCustomBlocks } from '../reducers/project';

import { OnboardingRefs } from './onboarding-refs-provider.jsx';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';

class OnboardingOverlay extends React.Component {
    constructor(props) {
        super(props);

        this.overlayRef = React.createRef();
        this.cachedOverlayWidth = -1;
        this.triggerRef = null;
        this.currentTimeout = null;

        this.state = {
            overlayProps: null,
        };

        this.buttonClickFactory = this.buttonClickFactory.bind(this);
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
    }

    componentDidMount() {
        if (this.props.step >= 0 && this.props.step < onboardingConfig.steps.length) {
            this.loadStep(this.props.step);
        }
        this.props.setCustomBlocks(customBlocks);
    }

    componentDidUpdate(prevProps) {
        const overlayWidth = this.overlayRef.current ? this.overlayRef.current.getBoundingClientRect().width : -1;
        if (
            prevProps.step !== this.props.step ||
            prevProps.capturedRefs !== this.props.capturedRefs ||
            this.cachedOverlayWidth !== overlayWidth
        ) {
            this.cachedOverlayWidth = overlayWidth;
            this.loadStep(this.props.step);
        }
    }

    loadStep(step) {
        if (!(this.props.step >= 0 && this.props.step < onboardingConfig.steps.length)) {
            return;
        }

        const {
            trigger,
            loadProject,
            timeout,
            ...props
        } = onboardingConfig.steps[step];

        if (timeout) {
            if (this.currentTimeout) {
                clearTimeout(this.currentTimeout);
            }
            this.currentTimeout = setTimeout(() => this.nextStep(), timeout);
            this.setState({ overlayProps: null });
            return;
        }

        const targetCoordinates = this.getPositioning(props.arrowTo);
        if (props.arrowTo && !targetCoordinates) {
            return;
        }

        this.setState({
            overlayProps: {
                ...props,
                targetCoordinates,
            },
        });

        this.assignTrigger(trigger);

        if (loadProject !== undefined) {
            this.props.loadProject(loadProject);
        }
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
            if (typeof action === 'function') {
                // treat functions as action creators
                this.props.dispatchAction(action());
                return;
            }

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
        const contentReady = !!this.state.overlayProps;

        return (
            <OnboardingOverlayComponent
                {...this.state.overlayProps}
                buttonClickFactory={this.buttonClickFactory}
                ref={this.overlayRef}
                shown={contentReady && this.props.shown}
            />
        );
    }
}

OnboardingOverlay.propTypes = {
    capturedRefs: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    step: PropTypes.number.isRequired,
    loadProject: PropTypes.func.isRequired,
    setCustomBlocks: PropTypes.func.isRequired,
    setOnboardingStep: PropTypes.func.isRequired,
    dispatchAction: PropTypes.func.isRequired,
};

const OnboardingOverlayConnected = connect(
    (state) => ({
        step: parseInt((state.router.params || {}).step) || 0,
    }),
    (dispatch) => ({
        loadProject: (id) => dispatch(setProjectId(id)),
        setOnboardingStep: (step) => dispatch(push(`/onboarding/${step}`)),
        setCustomBlocks: (blocks) => dispatch(setCustomBlocks(blocks)),
        dispatchAction: dispatch,
    })
)(OnboardingOverlay);

const OnboardingOverlayConsumeRefs = (props) =>
    <OnboardingRefs>
        {(refs) => <OnboardingOverlayConnected capturedRefs={refs} {...props} />}
    </OnboardingRefs>;

export default OnboardingOverlayConsumeRefs;
