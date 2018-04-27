import React from 'react';
import PropTypes from 'prop-types';

import analytics from './analytics';
import log from './log';
import storage from './storage';
import {connect} from 'react-redux';
import {serializeSounds, serializeCostumes} from 'scratch-vm/src/serialization/serialize-assets';
import {setProjectName} from '../reducers/project';
import {loadGame} from '../reducers/edu-layer';

const registeredUrlViews = [
    'lernspiel',
];

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
            this.fetchProjectId = this.fetchProjectId.bind(this);
            this.updateProject = this.updateProject.bind(this);
            this.saveProject = this.saveProject.bind(this);
            this.onNameInputChange = e => this.props.dispatch(setProjectName(e.target.value));
            this.state = {
                projectId: null,
                userId: 'testuser',
                projectData: null,
                fetchingProject: false,
                idCreatedFlag: false,
                view: '_project',
                subId: null,
            };
            storage.userId = this.state.userId;
        }
        componentDidMount () {
            window.addEventListener('popstate', this.updateProject);
            window.addEventListener('hashchange', this.updateProject);
            this.updateProject();
        }
        componentWillUpdate (nextProps, nextState) {
            if (this.state.userId !== nextState.userId) {
                storage.userId = nextState.userId;
            }

            if (this.state.subId !== nextState.subId && nextState.view === 'lernspiel') {
                this.setState({fetchingProject: true}, () =>
                    this.loadGame(nextState.subId)
                        .then(project => this.setState({fetchingProject: false, projectData: project.data.toString()}))
                );
            }

            if (nextState.view === '_project' &&
                (this.state.projectId !== nextState.projectId || this.state.view !== nextState.view)) {
                if (nextState.projectId && this.fetchProjectId() !== nextState.projectId) {
                    window.location.hash = `#${nextState.projectId}`;
                }
                if (this.state.idCreatedFlag || nextState.idCreatedFlag) {
                    this.setState({idCreatedFlag: false});
                    return;
                }

                this.setState({fetchingProject: true}, () => {
                    storage
                        .load(storage.AssetType.Project, this.state.projectId, storage.DataFormat.JSON)
                        .then(projectAsset => {
                            if (!projectAsset) {
                                return;
                            }

                            this.setState({
                                projectData: projectAsset.data.toString(),
                                fetchingProject: false
                            });
                            const data = JSON.parse(projectAsset.data.toString());
                            if (data.custom) {
                                this.props.dispatch(setProjectName(data.custom.name));
                            }
                        })
                        .catch(err => log.error(err));
                });
            }
        }
        componentDidUpdate () {
            if (this.state.view === 'lernspiel' && this.state.subId === null) {
                history.replaceState({}, null, '/');
                this.updateProject();
            }
        }
        componentWillUnmount () {
            window.removeEventListener('hashchange', this.updateProject);
        }
        fetchProjectId () {
            return window.location.hash.substring(1);
        }
        updateProject () {
            const [urlView, subId] = window.location.pathname.split('/').slice(1);
            const view = registeredUrlViews.includes(urlView) ? urlView : '_project';
            const updatedState = {};
            if (view !== this.state.view) {
                updatedState.view = view;
            }
            if (subId !== this.state.subId) {
                updatedState.subId = subId || null;
            }

            let projectId = this.props.projectId || this.fetchProjectId();
            if (projectId !== this.state.projectId) {
                if (projectId.length < 1) projectId = 0;
                updatedState.projectId = projectId;

                if (projectId !== 0) {
                    analytics.event({
                        category: 'project',
                        action: 'Load Project',
                        value: projectId,
                        nonInteraction: true
                    });
                }
            }
            this.setState(updatedState);
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
                        body: asset.fileContent
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
            if (this.state.projectId) {
                payload.id = this.state.projectId;
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
        loadGame (id) {
            const url = `/lernspiel/${id}`;
            if (location.pathname !== url) {
                history.pushState({}, null, url);
            }

            return fetch(`/edu-games/game-${id}.json`)
                .then(res => res.json())
                .then(game => {
                    this.props.dispatch(loadGame(id, game));
                    return storage.load(storage.AssetType.Project, game.projectId, storage.DataFormat.JSON);
                });
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
                    saveProject={this.saveProject}
                    onNameInputChange={this.onNameInputChange}
                    {...componentProps}
                />
            );
        }
    }
    ProjectLoaderComponent.propTypes = {
        gameEnabled: PropTypes.bool,
        projectId: PropTypes.string,
    };

    return connect(state => ({
        vm: state.vm,
        projectName: state.project.name,
        gameEnabled: state.eduLayer.enabled,
    }))(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default
};