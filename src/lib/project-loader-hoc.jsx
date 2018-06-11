import React from 'react';
import PropTypes from 'prop-types';

import log from './log';
import storage from './storage';
import {connect} from 'react-redux';
import {setProjectName, setProjectId} from '../reducers/project';
import {Views} from './routing';

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url) or by projectId prop passed in from
 * the parent (i.e. scratch-www)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function (WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
        constructor (props) {
            super(props);

            this.state = {
                projectData: null,
                fetchingProject: false,
            };
        }
        componentDidMount () {
            if (this.props.router.params.projectId) {
                this.props.dispatch(setProjectId(this.props.router.params.projectId));
                return;
            }
            this.loadProject(this.props.projectId || 0);
        }
        componentDidUpdate (prevProps) {
            if (prevProps.projectId !== this.props.projectId) {
                this.loadProject(this.props.projectId || 0);
            }

            const shouldGetProjectFromUrl =
                this.props.router.view === Views.project &&
                this.props.router.params.projectId &&
                prevProps.router.params.projectId !== this.props.router.params.projectId;
            if (shouldGetProjectFromUrl) {
                this.props.dispatch(setProjectId(this.props.router.params.projectId));
            }
        }
        loadProject (id) {
            this.setState({fetchingProject: true}, () => (async () => {
                const projectAsset = await storage.load(storage.AssetType.Project, id, storage.DataFormat.JSON);
                if (!projectAsset) {
                    return;
                }

                this.setState({
                    projectData: projectAsset.data.toString(),
                    fetchingProject: false,
                });

                const data = JSON.parse(projectAsset.data.toString());
                if (data.custom) {
                    this.props.dispatch(setProjectName(data.custom.name));
                }
            })().catch(log.error));
        }
        render () {
            const {
                dispatch, // eslint-disable-line no-unused-vars
                projectId, // eslint-disable-line no-unused-vars
                gameEnabled, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            if (!this.state.projectData) return null;
            return (
                <WrappedComponent
                    fetchingProject={this.state.fetchingProject}
                    projectData={this.state.projectData}
                    {...componentProps}
                />
            );
        }
    }
    ProjectLoaderComponent.propTypes = {
        projectId: PropTypes.string,
    };

    return connect(state => ({
        vm: state.scratchGui.vm,
        projectId: state.scratchGui.project.id,
        router: {
            view: state.router.result ? state.router.result.view : "",
            params: state.router.params,
        }
    }))(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default
};