import React from 'react';
import PropTypes from 'prop-types';

import analytics from './analytics';
import log from './log';
import storage from './storage';
import {connect} from 'react-redux';
import {serializeSounds, serializeCostumes} from 'scratch-vm/src/serialization/serialize-assets';
import {setProjectName} from '../reducers/project';

/* Higher Order Component to provide behavior for loading projects by id. If
 * there's no id, the default project is loaded.
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function (WrappedComponent) {
    class ProjectLoaderComponent extends React.Component {
        constructor (props) {
            super(props);
            this.updateProject = this.updateProject.bind(this);
            this.saveProject = this.saveProject.bind(this);
            this.onNameInputChange = e => this.props.dispatch(setProjectName(e.target.value));
            this.state = {
                userId: 'testuser',
                projectData: null,
                fetchingProject: false,
                idCreatedFlag: false
            };
        }
        componentDidMount () {
            if (this.props.projectId || this.props.projectId === 0) {
                this.updateProject(this.props.projectId);
            }
        }
        componentWillUpdate (nextProps, nextState) {
            if (this.props.projectId !== nextProps.projectId) {
                if (nextProps.projectId && this.fetchProjectId() !== nextProps.projectId) {
                    window.location.hash = `#${nextProps.projectId}`;
                }
                if (this.state.idCreatedFlag || nextState.idCreatedFlag) {
                    this.setState({idCreatedFlag: false});
                    return;
                }

                this.setState({fetchingProject: true}, () => {
                    this.updateProject(nextProps.projectId);
                });
            }
        }
        updateProject (projectId) {
            storage
                .load(storage.AssetType.Project, projectId, storage.DataFormat.JSON)
                .then(projectAsset => projectAsset && this.setState({
                    projectData: projectAsset.data,
                    fetchingProject: false
                }))
                .then(() => {
                    if (projectId !== 0) {
                        analytics.event({
                            category: 'project',
                            action: 'Load Project',
                            label: projectId,
                            nonInteraction: true
                        });
                    }
                })
                .catch(err => log.error(err));
        }
        saveProject () {
            const name = this.props.projectName;
            if (!name) {
                return Promise.reject(new Error('Du hast vergessen, dem Spiel einen Namen zu geben.'));
            }
            // save assets
            const costumeAssets = serializeCostumes(this.props.vm.runtime);
            const soundAssets = serializeSounds(this.props.vm.runtime);
            const assetPromises = [].concat(costumeAssets).concat(soundAssets).map(asset =>
                fetch('/api/prepareAssetUpload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: asset.fileName
                    })
                })
                    .then(res => res.json())
                    .then(({uploadUrl}) => fetch(uploadUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(asset.fileContent)
                    }))
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('HTTP Request failed');
                        }
                        return res;
                    })
            );

            // save project
            const data = this.props.vm.toJSON();
            const payload = {
                data,
                name,
                userId: this.state.userId,
            };
            if (this.props.projectId) {
                payload.id = this.props.projectId;
            }

            return Promise.all(assetPromises)
                .then(() => fetch('/api/saveProject', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }))
                .then(res => res.json())
                .then(res => this.setState({
                    projectId: res.id,
                    idCreatedFlag: true
                }))
                .catch(() => {
                    throw new Error('Das hat leider nicht geklappt');
                });
        }
        render () {
            const {
                dispatch, // eslint-disable-line no-unused-vars
                projectId, // eslint-disable-line no-unused-vars
                ...componentProps
            } = this.props;
            if (!this.state.projectData) return null;
            return (
                <WrappedComponent
                    fetchingProject={this.state.fetchingProject}
                    projectData={this.state.projectData}
                    saveProject={this.saveProject}
                    onNameInputChange={this.onNameInputChange}
                    {...componentProps}
                />
            );
        }
    }
    ProjectLoaderComponent.propTypes = {
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };
    ProjectLoaderComponent.defaultProps = {
        projectId: 0
    };

    return connect(state => ({
        vm: state.vm,
        projectName: state.project.name
    }))(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default
};
