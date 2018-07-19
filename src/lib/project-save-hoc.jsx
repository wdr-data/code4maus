import {connect} from 'react-redux';
import {push} from 'redux-little-router';
import {setProjectName, setProjectId} from '../reducers/project';
import React from 'react';
import {projectUrl} from './routing';
import {serializeSounds, serializeCostumes} from '@wdr-data/scratch-vm/src/serialization/serialize-assets';
import storage from './storage';
import { v4 as uuid } from 'uuid';
import { UserIdContext } from './project-loader-hoc.jsx';

const contentTypes = {
    'jpg': 'image/jpeg',
    'json': 'application/json',
    'mp3': 'audio/mp3',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'wav': 'audio/wav'
}
const getContentType = filename => {
    const parts = filename.split('.');
    const ext = parts[parts.length-1];
    if (ext in contentTypes) {
        return contentTypes[ext];
    }
    return 'text/plain';
}

const ProjectSaveHOC = WrappedComponent => {
    class ProjectSaveComponent extends React.Component {
        constructor (props) {
            super(props);

            this.state = {
                nameInput: "",
                error: "",
            };

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
        async saveProject () {
            if (!this.state.nameInput) {
                return this.setError("Du hast vergessen, dem Spiel einen Namen zu geben.");
            }

            try {
                await this.saveAssets().then(this.saveMeta.bind(this));
            } catch(e) {
                console.error(e);
                return this.setError("Das hat leider nicht geklappt");
            }
        }
        async saveAssets () {
            const costumeAssets = serializeCostumes(this.props.vm.runtime);
            const soundAssets = serializeSounds(this.props.vm.runtime);
            return Promise.all([].concat(costumeAssets).concat(soundAssets).map(async (asset) => {
                const res = await fetch('/api/prepareAssetUpload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filename: asset.fileName
                    })
                });
                if (!res.ok && res.status !== 409) {
                    throw new Error(`uploading an asset failed: ${asset.filename}`)
                }

                const body = await res.json();
                if (!!body.exists) {
                    return;
                }

                const saveRes = await fetch(body.uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': getContentType(asset.fileName)
                    },
                    body: asset.fileContent
                });
                if (!saveRes.ok) {
                    throw new Error('HTTP Request failed');
                }
            }));
        }
        async saveMeta () {
            const payload = {
                data: this.props.vm.toJSON(),
                name: this.state.nameInput,
                userId: this.props.userId,
            };
            if (this.props.projectId) {
                payload.id = this.props.projectId;
            }

            const res = await (await fetch('/api/saveProject', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })).json();

            this.props.dispatch(setProjectName(this.state.nameInput));
            this.props.dispatch(setProjectId(res.id));
            this.props.dispatch(push(projectUrl(res.id)));
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
                userId,
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

    const ProjectLoaderConnected = connect(state => ({
        projectId: state.scratchGui.project.id,
        projectName: state.scratchGui.project.name,
        vm: state.scratchGui.vm,
    }))(ProjectSaveComponent);

    return props => (
        <UserIdContext.Consumer>
            {userId => (
                <ProjectLoaderConnected {...props} userId={userId} />
            )}
        </UserIdContext.Consumer>
    );
}

export default ProjectSaveHOC;
