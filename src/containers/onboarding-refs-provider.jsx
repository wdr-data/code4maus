import React, { Component } from 'react';
import PropTypes from 'prop-types';

const OnboardingRefsContext = React.createContext();
export const OnboardingRefs = OnboardingRefsContext.Consumer;

const OnboardingCaptureContext = React.createContext();

const onboardingRefsHOC = (WrappedComponent) => {
    class OnboardingRefsProvider extends Component {
        constructor(props) {
            super(props);

            this.state = {};

            this.captureRef = this.captureRef.bind(this);
        }

        captureRef(id, ref) {
            if (this.state[id] !== ref) {
                this.setState({ [id]: ref });
            }
        }

        render() {
            return <OnboardingRefsContext.Provider value={this.state}>
                <OnboardingCaptureContext.Provider value={this.captureRef}>
                    <WrappedComponent {...this.props} />
                </OnboardingCaptureContext.Provider>
            </OnboardingRefsContext.Provider>;
        }
    }

    return OnboardingRefsProvider;
};

const noop = () => {};

export const OnboardingCapture = (props) => {
    if (!props.componentId) {
        return props.children(noop);
    }
    return <OnboardingCaptureContext.Consumer>
        {(captureRef) => props.children((ref) => captureRef(props.componentId, ref))}
    </OnboardingCaptureContext.Consumer>;
};

OnboardingCapture.propTypes = {
    children: PropTypes.func.isRequired,
    componentId: PropTypes.string.isRequired,
};

export default onboardingRefsHOC;
