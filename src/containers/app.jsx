import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { addLocaleData, IntlProvider } from 'react-intl';
import de from 'react-intl/locale-data/de';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { replace } from 'redux-little-router';

import { Views } from '../lib/routing';
import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import AppStateHOC from '../lib/app-state-hoc.jsx';
import withTracking from '../lib/tracking-hoc.jsx';
import localeDe from '../../translations/de.json';
import storage, { s3userFile } from '../lib/storage';
import { setUserId } from '../reducers/project';
import { startInstall, failInstall, setInstalled } from '../reducers/offline';

import Menu from './menu.jsx';
import WelcomeScreen from './welcome-screen.jsx';
import LazyRender from './lazy-render.jsx';
import Content from './content.jsx';
import MobileScreen from './mobile-screen.jsx';
import Loader from '../components/loader/loader.jsx';

import { Workbox } from 'workbox-window';

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
        if (this.props.offlineEnabled) {
            this.offlineSupport();
        }
        this.ensureUserId();
        this.maybeRedirectWelcome();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            storage.userId = this.props.userId;
        }

        if (prevProps.offlineEnabled !== this.props.offlineEnabled && this.props.offlineEnabled) {
            this.offlineSupport();
        }
    }

    async offlineSupport() {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        this.props.startInstall();
        // register service worker
        const wb = new Workbox('/service-worker.js');

        // not 100% sure about timing here. maybe we could register the event only if it has not yet
        // been installed. But not 100% sure..better play safe here :S
        const installedPromise = new Promise((resolve, reject) => {
            wb.addEventListener('installed', () => {
                resolve();
            });
        });

        try {
            const result = await wb.register();
            const installed = result.installing === null
                ? Promise.resolve()
                : installedPromise;

            await installed;
            this.props.setInstalled();
        } catch (e) {
            this.props.failInstall(e);
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

    renderView() {
        switch (this.props.view) {
        case Views.edu:
        case Views.project:
            return <LazyRender promise={import('./gui.jsx')} />;
        case Views.content:
            return <Content />;
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
            <React.Fragment>
                <IntlProvider
                    locale="de"
                    messages={localeDe}
                >
                    {this.renderView()}
                </IntlProvider>
                <MobileScreen />
            </React.Fragment>
        );
    }
}

App.propTypes = {
    view: PropTypes.string.isRequired,
    setUserId: PropTypes.func.isRequired,
    userId: PropTypes.string,
    redirectWelcome: PropTypes.func.isRequired,
    offlineEnabled: PropTypes.bool.isRequired,
    startInstall: PropTypes.func.isRequired,
    failInstall: PropTypes.func.isRequired,
    setInstalled: PropTypes.func.isRequired,
};

const ConnectedApp = connect(
    (state) => {
        const result = state.router.result || {};
        return {
            view: result.view || '',
            userId: state.scratchGui.project.userId,
            offlineEnabled: state.scratchGui.offline.enabled,
        };
    },
    (dispatch) => ({
        setUserId: (id) => dispatch(setUserId(id)),
        redirectWelcome: () => dispatch(replace('/welcome')),
        startInstall: () => dispatch(startInstall()),
        failInstall: (e) => dispatch(failInstall(e)),
        setInstalled: () => dispatch(setInstalled()),
    }),
)(App);

const WrappedApp = ErrorBoundaryHOC('Top Level App')(
    AppStateHOC(withTracking(ConnectedApp)),
);

WrappedApp.setAppElement = ReactModal.setAppElement;
export default WrappedApp;
