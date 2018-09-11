import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import log from './log';
import storage from './storage';
import { connect } from 'react-redux';
import { setProjectName } from '../reducers/project';

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
        }
        async componentDidMount() {
            this.loadProject(this.props.projectId || 0);
        }
        componentDidUpdate(prevProps) {
            if (prevProps.projectId !== this.props.projectId) {
                this.loadProject(this.props.projectId || 0);
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
        setProjectName: PropTypes.func.isRequired,
    };

    return connect(
        (state) => ({
            projectId: state.scratchGui.project.id,
        }),
        (dispatch) => ({
            setProjectName: (name) => dispatch(setProjectName(name)),
        }),
    )(ProjectLoaderComponent);
};

export {
    ProjectLoaderHOC as default,
};
