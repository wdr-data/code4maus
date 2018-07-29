import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { push } from 'redux-little-router';

import MenuComponent from '../components/menu/menu.jsx';
import { MenuTabs } from '../lib/routing';

const tabIdToTab = {
    0: MenuTabs.edugames,
    1: MenuTabs.projects,
    2: MenuTabs.examples,
};

const bucketUrl = process.env.S3_BUCKET_URL_PROJECT;

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
        };
    }
    componentDidMount() {
        this.loadUserProjects();
    }
    async loadUserProjects() {
        const userProjects = await (await fetch(`${bucketUrl}/projects/${this.props.userId}/index.json`)).json();
        const projects = Object.entries(userProjects)
            .map(([ key, proj ]) => ({
                key,
                title: proj.name,
                note: new Date(proj.updated_at).toLocaleDateString(),
                linkTo: `/projekt/${key}`,
                _sort: proj.updated_at,
            }))
            .sort((a, b) => b._sort - a._sort);
        this.setState({ projects });
    }
    static getTabId(tab) {
        const tabEntry = Object.entries(tabIdToTab).find(([ key, val ]) => val === tab);
        if (!tabEntry) {
            return 0;
        }
        return parseInt(tabEntry[0]);
    }
    render() {
        /* eslint-disable no-unused-vars */
        const {
            router,
            userId,
            ...props
        } = this.props;
        /* eslint-enable */

        return (
            <MenuComponent projects={this.state.projects} selectedTab={Menu.getTabId(router.tab)} {...props} />
        );
    }
}

Menu.propTypes = {
    router: PropTypes.shape({
        tab: PropTypes.string.isRequired,
    }),
    userId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    router: state.router.result || {},
    userId: state.scratchGui.project.userId,
});

const mapDispatchToProps = (dispatch) => ({
    handleTabSelected: (tabId) => dispatch(push(`/${tabIdToTab[tabId]}`)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Menu);
