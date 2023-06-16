import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { setProjectName, setProjectId } from '../reducers/project'
import log from './log'
import storage from './storage'

/* Higher Order Component to provide behavior for loading projects by id from
 * the window's hash (#this part in the url) or by projectId prop passed in from
 * the parent (i.e. scratch-www)
 * @param {React.Component} WrappedComponent component to receive projectData prop
 * @returns {React.Component} component with project loading behavior
 */
const ProjectLoaderHOC = function (WrappedComponent) {
  class ProjectLoaderComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        projectData: null,
        fetchingProject: true,
      }
      this.projectId = this.getProjectId(props)
    }

    getProjectId(props) {
      if (!props.match.params.eduId) return 0

      if (props.match.path.includes('/lernspiel/')) {
        return `edu/${props.match.params.eduId}`
      }
      return props.match.params.eduId
    }

    componentDidMount() {
      this.loadProject(this.getProjectId(this.props))
    }

    componentDidUpdate(prevProps) {
      const prevProjectId = this.getProjectId(prevProps)
      const currProjectId = this.getProjectId(this.props)

      if (prevProjectId !== currProjectId) {
        this.loadProject(currProjectId)
      }
    }

    loadProject(id) {
      this.props.setProjectId(id)

      this.setState({ fetchingProject: true }, () =>
        (async () => {
          const projectAsset = await storage.load(
            storage.AssetType.Project,
            id,
            storage.DataFormat.JSON
          )
          if (!projectAsset) {
            return
          }

          this.setState({
            projectData: projectAsset.data.toString(),
            fetchingProject: false,
          })

          const data = JSON.parse(projectAsset.data.toString())
          if (data.custom) {
            this.props.setProjectName(data.custom.name)
          }
        })().catch(log.error)
      )
    }

    render() {
      const {
        setProjectId, // eslint-disable-line no-unused-vars
        setProjectName, // eslint-disable-line no-unused-vars
        ...componentProps
      } = this.props

      return (
        <WrappedComponent
          fetchingProject={this.state.fetchingProject}
          projectData={this.state.projectData}
          {...componentProps}
        />
      )
    }
  }
  ProjectLoaderComponent.propTypes = {
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    setProjectName: PropTypes.func.isRequired,
    setProjectId: PropTypes.func,
  }

  return connect(
    () => ({}),
    (dispatch) => ({
      setProjectName: (name) => dispatch(setProjectName(name)),
      setProjectId: (id) => dispatch(setProjectId(id)),
    })
  )(ProjectLoaderComponent)
}

export { ProjectLoaderHOC as default }
