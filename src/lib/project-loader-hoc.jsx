import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import debounce from 'lodash.debounce';

import log from './log';
import storage, { s3userFile } from './storage';
import { connect } from 'react-redux';
import { setProjectName, setProjectId, setUserId } from '../reducers/project';
import { Views } from './routing';

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url) or by projectId prop passed in from
 * the parent (i.e. scratch-www)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function(WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
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

        constructor(props) {
            super(props);

            this.state = {
                projectData: null,
                fetchingProject: false,
            };

            this.loadProject = debounce(this.loadProject.bind(this), 2000, { leading: true });
        }
        async componentDidMount() {
            await this.createUserId();
            if (this.props.router.view === Views.project && this.props.router.params.projectId) {
                this.props.setProjectId(this.props.router.params.projectId);
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

            if (prevProps.userId !== this.props.userId) {
                storage.userId = this.props.userId;
            }
        }
        async createUserId() {
            const localStorage = window.localStorage;
            let userId = localStorage.getItem('deviceId');
            if (!userId) {
                while (!userId || await ProjectLoaderComponent.userIdExists(userId)) {
                    userId = uuid();
                }
                localStorage.setItem('deviceId', userId);
            }

            this.props.setUserId(userId);
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
                gameEnabled,
                userId,
                setProjectName,
                setProjectId,
                setUserId,
                ...componentProps
            } = this.props;
            /* eslint-enable */
            if (!this.state.projectData) {
                return null;
            }
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

    return connect(
        (state) => ({
            vm: state.scratchGui.vm,
            projectId: state.scratchGui.project.id,
            router: {
                view: state.router.result ? state.router.result.view : '',
                params: state.router.params || {},
            },
            userId: state.scratchGui.project.userId,
        }),
        (dispatch) => ({
            setProjectName: (name) => dispatch(setProjectName(name)),
            setProjectId: (projectId) => dispatch(setProjectId(projectId)),
            setUserId: (userId) => dispatch(setUserId(userId)),
        }),
    )(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default,
};
