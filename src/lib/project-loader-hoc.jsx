import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { setProjectName, setProjectId } from '../reducers/project'
import log from './log'
import storage from './storage'
import { TextDecoder } from 'text-encoding'

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
        loadingError: null,
      }
      this.projectId = this.getProjectId(props)
      // Incremented per load so results of superseded requests are ignored
      this.loadGeneration = 0
    }

    getProjectId(props) {
      if (!props.match.params.eduId && !props.match.params.projectId) return 0

      if (props.match.params.projectId) return props.match.params.projectId

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

    componentWillUnmount() {
      this.loadGeneration++
    }

    loadProject(id) {
      const generation = ++this.loadGeneration
      const isCurrent = () => generation === this.loadGeneration
      this.props.setProjectId(id)

      this.setState({ fetchingProject: true }, () =>
        (async () => {
          const projectAsset = await storage.load(
            storage.AssetType.Project,
            id,
            storage.DataFormat.JSON
          )
          if (!isCurrent()) return
          if (!projectAsset) {
            throw new Error(`Project ${id} not found`)
          }

          const decodedData =
            projectAsset.data.constructor == Uint8Array
              ? new TextDecoder().decode(projectAsset.data)
              : projectAsset.data.toString()

          this.setState({
            projectData: decodedData,
            fetchingProject: false,
          })

          const data = JSON.parse(decodedData)
          if (data.custom) {
            this.props.setProjectName(data.custom.name)
          }
        })().catch((e) => {
          if (!isCurrent()) return
          log.error(e)
          this.setState({ loadingError: e })
        })
      )
    }

    render() {
      if (this.state.loadingError) {
        throw new Error(`Failed to load project: ${this.state.loadingError}`)
      }
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
