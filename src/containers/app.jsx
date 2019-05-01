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
import { startFirstTimeInstall, failFirstTimeInstall, finishFirstTimeInstall, setInstalled } from '../reducers/offline';

import Menu from './menu.jsx';
import WelcomeScreen from './welcome-screen.jsx';
import LazyRender from './lazy-render.jsx';
import Content from './content.jsx';
import MobileScreen from './mobile-screen.jsx';
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
        if (this.props.installOnLoad) {
            this.offlineSupport();
        }
        this.ensureUserId();
        this.maybeRedirectWelcome();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userId !== this.props.userId) {
            storage.userId = this.props.userId;
        }

        if (prevProps.installOnLoad !== this.props.installOnLoad && this.props.installOnLoad) {
            this.firstTimeInstall();
        }
    }

    async firstTimeInstall() {
        this.props.startFirstTimeInstall();
        this.offlineSupport().then(() => {
            this.props.finishFirstTimeInstall();
        })
            .catch((e) => {
                this.props.failFirstTimeInstall(e);
            });
    }

    async offlineSupport() {
        // register service worker
        if ('serviceWorker' in navigator) {
            return navigator.serviceWorker.register('/service-worker.js')
                .then((reg) => {
                    return new Promise((resolve, reject) => {
                        const checkLoop = () => {
                            if (reg.installing === null) {
                                this.props.setInstalled();
                                resolve();
                            } else {
                                setTimeout(checkLoop, 500);
                            }
                        };
                        checkLoop();
                    });
                });
        } else {
            return Promise.reject(false);
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
    installOnLoad: PropTypes.bool.isRequired,
    startFirstTimeInstall: PropTypes.func.isRequired,
    finishFirstTimeInstall: PropTypes.func.isRequired,
    failFirstTimeInstall: PropTypes.func.isRequired,
    setInstalled: PropTypes.func.isRequired,
};

const ConnectedApp = connect(
    (state) => {
        const result = state.router.result || {};
        return {
            view: result.view || '',
            userId: state.scratchGui.project.userId,
            installOnLoad: state.scratchGui.offline.installOnLoad,
        };
    },
    (dispatch) => ({
        setUserId: (id) => dispatch(setUserId(id)),
        redirectWelcome: () => dispatch(replace('/welcome')),
        startFirstTimeInstall: () => dispatch(startFirstTimeInstall()),
        finishFirstTimeInstall: () => dispatch(finishFirstTimeInstall()),
        failFirstTimeInstall: () => dispatch(failFirstTimeInstall()),
        setInstalled: () => dispatch(setInstalled()),
    }),
)(App);

const WrappedApp = ErrorBoundaryHOC('Top Level App')(
    AppStateHOC(withTracking(ConnectedApp)),
);

WrappedApp.setAppElement = ReactModal.setAppElement;
export default WrappedApp;
