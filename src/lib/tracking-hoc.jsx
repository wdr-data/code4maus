import React from 'react';
import PropTypes from 'prop-types';
import zepto from 'zepto';
import { connect } from 'react-redux';

import { Views } from '../lib/routing';

const baseGroups = [
    'WDR',
    'Fernsehen',
    'Kinder',
    'Die Sendung mit der Maus',
    'Programmieren mit der Maus',
];

const extendZepto = ($) => {
    $.ajaxSetup = (opts) => {
        $.ajaxSettings = $.extend($.ajaxSettings, opts);
    };
    $.getScript = (url, success, error) => {
        const script = document.createElement('script');
        script.src = url;

        const $script = $(script);
        $script.bind('load', success);
        $script.bind('error', error);

        $('body').append(script);
    };
    return $;
};

const withTracking = (WrappedComponent) => {
    class WDRTracking extends React.Component {
        constructor(props) {
            super(props);
            this.tracker = null;

            if (!window.trackingInserted) {
                this.insertTracking();
            }
        }

        componentDidUpdate(prevProps) {
            if (this.props.view !== prevProps.view || this.props.params !== prevProps.params) {
                this.updateTracking();
            }
        }

        insertTracking() {
            window.trackingInserted = true;
            window.jQuery = extendZepto(zepto);
            window.wdrWebtrekkBuildArr=[];

            const s = document.createElement('script');
            s.src = 'https://www.wdr.de/themen/global/tracker/tracker.min.js';
            s.async = true;
            s.addEventListener('load', () => {
                this.tracker = window.wdrTrackerObject;
                this.updateTracking();
            });
            document.body.appendChild(s);
        }

        updateTracking() {
            if (!this.tracker) {
                if (!window.wdrTrackerObject) {
                    console.warn('WDR tracker object not found.');
                    return;
                }
                this.tracker = window.wdrTrackerObject;
            }

            window.wdrWebtrekkBuildArr = this.buildContentGroups();
            this.tracker.update();
        }

        buildContentGroups() {
            switch (this.props.view) {
            case Views.welcome:
                return baseGroups.concat('Startscreen');
            case Views.menu:
                return baseGroups.concat('Menü');
            case Views.edu:
                return baseGroups.concat('Lernspiel', this.props.params.eduId);
            case Views.project:
                return baseGroups.concat('Projekt', this.props.params.projectId);
            case Views.content:
                return baseGroups.concat('Inhalte', this.props.params.page);
            }
        }

        render() {
            return <WrappedComponent />;
        }
    }
    const mapStateToProps = (state) => {
        const result = state.router.result || {};
        return {
            view: result.view,
            params: state.router.params,
        };
    };

    WDRTracking.propTypes = {
        view: PropTypes.oneOf(Object.values(Views)),
        params: PropTypes.objectOf(PropTypes.string),
    };

    return connect(mapStateToProps)(WDRTracking);
};

export default withTracking;
