import React from 'react';
import PropTypes from 'prop-types';

import Loader from '../components/loader/loader.jsx';

class LazyRender extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasLoaded: false,
            componentRef: null,
        };
    }

    async componentDidMount() {
        const { default: componentRef } = await this.props.promise;
        this.setState({
            componentRef,
            hasLoaded: true,
        });
    }

    render() {
        if (!this.state.hasLoaded) {
            return <Loader />;
        }

        const {
            promise, // eslint-disable-line no-unused-vars
            ...componentProps
        } = this.props;

        const Component = this.state.componentRef;
        return <Component {...componentProps} />;
    }
}

LazyRender.propTypes = {
    promise: PropTypes.instanceOf(Promise).isRequired,
};

export default LazyRender;
