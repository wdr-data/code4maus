import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'redux-little-router';

import WelcomeScreenComponent from '../components/welcome-screen/welcome-screen.jsx';

class WelcomeScreen extends React.Component {
    render() {
        return (
            <WelcomeScreenComponent
                onIntroClick={this.props.handleIntroClick}
                onMenuClick={this.props.handleMenuClick}
            />
        );
    }
}

WelcomeScreen.propTypes = {
    handleIntroClick: PropTypes.func.isRequired,
    handleMenuClick: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    handleIntroClick: () => dispatch(push('/onboarding')),
    handleMenuClick: () => dispatch(push('/')),
});

export default connect(() => ({}), mapDispatchToProps)(WelcomeScreen);
