import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import log from './log';
import storage from './storage';
import { connect } from 'react-redux';
import { setProjectName, setProjectId } from '../reducers/project';
import { Views } from './routing';

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url) or by projectId prop passed in from
 * the parent (i.e. scratch-www)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function(WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                projectData: null,
                fetchingProject: true,
            };

            this.loadProject = debounce(this.loadProject.bind(this), 2000, { leading: true, trailing: false });
        }
        async componentDidMount() {
            if (this.props.router.view === Views.project && this.props.router.params.projectId) {
                this.props.setProjectId(this.props.router.params.projectId);
                return;
            }
            if (this.props.router.isNewProject) {
                this.props.setProjectId(0);
                return;
            }
            this.loadProject(this.props.projectId || 0);
        }
        componentDidUpdate(prevProps) {
            if (prevProps.projectId !== this.props.projectId) {
                this.loadProject(this.props.projectId || 0);
            }

            const shouldGetProjectFromUrl =
                this.props.router.view === Views.project &&
                this.props.router.params.projectId &&
                prevProps.router.params.projectId !== this.props.router.params.projectId;
            if (shouldGetProjectFromUrl) {
                this.props.setProjectId(this.props.router.params.projectId);
            }
        }
        loadProject(id) {
            this.setState({ fetchingProject: true }, () => (async () => {
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
                    this.props.setProjectName(data.custom.name);
                }
            })().catch(log.error));
        }
        render() {
            /* eslint-disable no-unused-vars */
            const {
                projectId,
                setProjectName,
                setProjectId,
                ...componentProps
            } = this.props;
            /* eslint-enable */
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
        projectId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        router: PropTypes.shape({
            view: PropTypes.string.isRequired,
            params: PropTypes.object,
            isNewProject: PropTypes.bool,
        }),
        setProjectName: PropTypes.func.isRequired,
        setProjectId: PropTypes.func.isRequired,
    };

    return connect(
        (state) => ({
            vm: state.scratchGui.vm,
            projectId: state.scratchGui.project.id,
            router: {
                view: state.router.result ? state.router.result.view : '',
                isNewProject: !!(state.router.result || {}).newProject,
                params: state.router.params || {},
            },
        }),
        (dispatch) => ({
            setProjectName: (name) => dispatch(setProjectName(name)),
            setProjectId: (projectId) => dispatch(setProjectId(projectId)),
        }),
    )(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default,
};
