import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { addLocaleData, IntlProvider } from 'react-intl';
import de from 'react-intl/locale-data/de';
import PropTypes from 'prop-types';

import { Views, ContentPages } from '../lib/routing';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import localeDe from '../../translations/de.json';

import ParentHelp from '../lib/content/parents.md';

import GUI from './gui.jsx';
import Menu from './menu.jsx';
import ContentWrapper from '../components/content-wrapper/content-wrapper.jsx';

addLocaleData(de);

class App extends Component {
    renderContent() {
        switch (this.props.page) {
        case ContentPages.parents:
        default:
            return <ParentHelp />;
        }
    }

    renderView() {
        switch (this.props.view) {
        case Views.edu:
        case Views.onboarding:
        case Views.project:
            return <GUI />;
        case Views.content:
            return <ContentWrapper>{this.renderContent()}</ContentWrapper>;
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
    page: PropTypes.string,
};

const ConnectedApp = connect(
    (state) => {
        const result = state.router.result || {};
        return {
            view: result.view || '',
            page: result.page || '',
        };
    },
)(App);

const WrappedApp = ErrorBoundaryHOC('Top Level App')(
    AppStateHOC(ConnectedApp),
);

WrappedApp.setAppElement = ReactModal.setAppElement;
export default WrappedApp;
