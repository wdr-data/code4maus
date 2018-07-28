import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { addLocaleData, IntlProvider } from 'react-intl';
import de from 'react-intl/locale-data/de';
import PropTypes from 'prop-types';

import { Views } from '../lib/routing';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import localeDe from '../../translations/de.json';

import GUI from './gui.jsx';
import Menu from './menu.jsx';

addLocaleData(de);

class App extends Component {
    renderView() {
        switch (this.props.view) {
        case Views.edu:
        case Views.project:
            return <GUI />;
        case Views.menu:
        default:
            return <Menu />;
        }
    }

    render() {
        return (
            <IntlProvider
                locale="de"
                messages={localeDe}
            >
                {this.renderView()}
            </IntlProvider>
        );
    }
}

App.propTypes = {
    view: PropTypes.string.isRequired,
};

const ConnectedApp = connect(
    (state) => ({
        view: (state.router.result || {}).view || '',
    })
)(App);

const WrappedApp = ErrorBoundaryHOC('Top Level App')(
    AppStateHOC(ConnectedApp),
);

WrappedApp.setAppElement = ReactModal.setAppElement;
export default WrappedApp;
