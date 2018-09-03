import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { addLocaleData, IntlProvider } from 'react-intl';
import de from 'react-intl/locale-data/de';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { push, replace } from 'redux-little-router';

import { Views, ContentPages } from '../lib/routing';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import localeDe from '../../translations/de.json';
import storage, { s3userFile } from '../lib/storage';
import { setUserId } from '../reducers/project';

import ParentHelp, { attributes as parentAttributes } from '../lib/content/parents.md';

import GUI from './gui.jsx';
import Menu from './menu.jsx';
import WelcomeScreen from './welcome-screen.jsx';
import ContentWrapper from '../components/content-wrapper/content-wrapper.jsx';
import Loader from '../components/loader/loader.jsx';

addLocaleData(de);

const lsKeyDeviceId = 'deviceId';
const lsKeyVisited = 'hasVisited';

class App extends Component {
    static async userIdExists(userId) {
        try {
            const res = await fetch(s3userFile(userId, 'index.json'), {
                method: 'HEAD',
            });
            if (res.status >= 400) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    componentDidMount() {
        this.ensureUserId();
        this.maybeRedirectWelcome();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            storage.userId = this.props.userId;
        }
    }

    async ensureUserId() {
        if (this.userId) {
            storage.userId = this.userId;
            return;
        }

        const localStorage = window.localStorage;
        let userId = localStorage.getItem(lsKeyDeviceId);
        if (!userId) {
            while (!userId || await App.userIdExists(userId)) {
                userId = uuid();
            }
            localStorage.setItem(lsKeyDeviceId, userId);
        }

        storage.userId = userId;
        this.props.setUserId(userId);
    }

    maybeRedirectWelcome() {
        const localStorage = window.localStorage;
        const hasVisited = localStorage.getItem(lsKeyVisited);
        if (hasVisited === 'yes') {
            return;
        }

        this.props.redirectWelcome();
        localStorage.setItem(lsKeyVisited, 'yes');
    }

    renderContent() {
        switch (this.props.page) {
        case ContentPages.parents:
        default:
            return this.wrapContent(<ParentHelp />, parentAttributes);
        }
    }

    wrapContent(children, props) {
        return <ContentWrapper backToHome={this.props.backToHome} {...props}>{children}</ContentWrapper>;
    }

    renderView() {
        switch (this.props.view) {
        case Views.edu:
        case Views.onboarding:
        case Views.project:
            return <GUI />;
        case Views.content:
            return this.renderContent();
        case Views.welcome:
            return <WelcomeScreen />;
        case Views.menu:
        default:
            return <Menu />;
        }
    }

    render() {
        if (this.props.userId === null) {
            return <Loader />;
        }

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
    setUserId: PropTypes.func.isRequired,
    userId: PropTypes.string,
    backToHome: PropTypes.func.isRequired,
    redirectWelcome: PropTypes.func.isRequired,
};

const ConnectedApp = connect(
    (state) => {
        const result = state.router.result || {};
        return {
            view: result.view || '',
            page: result.page || '',
            userId: state.scratchGui.project.userId,
        };
    },
    (dispatch) => ({
        setUserId: (id) => dispatch(setUserId(id)),
        backToHome: () => dispatch(push('/')),
        redirectWelcome: () => dispatch(replace('/welcome')),
    }),
)(App);

const WrappedApp = ErrorBoundaryHOC('Top Level App')(
    AppStateHOC(ConnectedApp),
);

WrappedApp.setAppElement = ReactModal.setAppElement;
export default WrappedApp;
