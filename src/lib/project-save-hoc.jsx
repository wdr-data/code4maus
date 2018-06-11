import {connect} from 'react-redux';
import {push} from 'redux-little-router';
import {setProjectName} from '../reducers/project';
import React from 'react';
import {projectUrl} from './routing';
import {serializeSounds, serializeCostumes} from '@wdr-data/scratch-vm/src/serialization/serialize-assets';
import storage from './storage';

const ProjectSaveHOC = WrappedComponent => {
    class ProjectSaveComponent extends React.Component {
        constructor (props) {
            super(props);

            this.state = {
                nameInput: "",
                error: "",
                userId: "testuser",
            };
            storage.userId = this.state.userId;

            this.saveProject = this.saveProject.bind(this);
            this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
        }
        componentDidUpdate(prevProps) {
            if (this.state.nameInput === "" && prevProps.projectName !== this.props.projectName) {
                this.setState({ nameInput: this.props.projectName });
            }
        }
        handleProjectNameChange (nameInput) {
            this.setState({ nameInput });
        }
        saveProject () {
            const name = this.state.nameInput;
            if (!name) {
                return this.setError("Du hast vergessen, dem Spiel einen Namen zu geben.");
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
                .then(res => {
                    this.props.dispatch(setProjectName(name));
                    this.props.dispatch(push(projectUrl(res.id)));
                })
                .catch(() => {
                    return this.setError("Das hat leider nicht geklappt");
                });
        }
        setError (text) {
            this.setState({ error: text });
            return Promise.reject(new Error(text));
        }
        render () {
            const {
                projectId,
                projectName,
                dispatch,
                vm,
                ...componentProps
            } = this.props;

            return (
                <WrappedComponent
                    onProjectNameChange={this.handleProjectNameChange}
                    projectName={this.state.nameInput}
                    onSaveProject={this.saveProject}
                    saveProjectError={this.state.error}
                    {...componentProps}
                />
            );
        }
    }

    return connect(state => ({
        projectId: state.scratchGui.project.id,
        projectName: state.scratchGui.project.name,
        vm: state.scratchGui.vm,
    }))(ProjectSaveComponent);
}

export default ProjectSaveHOC;