import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import React from 'react'
import PropTypes from 'prop-types'
import {
  serializeSounds,
  serializeCostumes,
} from 'scratch-vm/src/serialization/serialize-assets'
import { setProjectName, setProjectId } from '../reducers/project'
import { setProjectUnchanged } from '../reducers/project-changed'
import { projectUrl } from './routing'

const contentTypes = {
  jpg: 'image/jpeg',
  json: 'application/json',
  mp3: 'audio/mp3',
  png: 'image/png',
  svg: 'image/svg+xml',
  wav: 'audio/wav',
}
const getContentType = (filename) => {
  const parts = filename.split('.')
  const ext = parts[parts.length - 1]
  if (ext in contentTypes) {
    return contentTypes[ext]
  }
  return 'text/plain'
}

const ProjectSaveHOC = (WrappedComponent) => {
  class ProjectSaveComponent extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        nameInput: props.projectName,
        error: '',
        isSaving: false,
      }
      this.isSaving = false
      this.requestCancelSave = false

      this.saveProject = this.saveProject.bind(this)
      this.saveAssets = this.saveAssets.bind(this)
      this.saveMeta = this.saveMeta.bind(this)
      this.handleProjectNameChange = this.handleProjectNameChange.bind(this)
      this.cancelSave = this.cancelSave.bind(this)
    }
    componentDidUpdate(prevProps) {
      if (prevProps.projectName !== this.props.projectName) {
        this.setState({ nameInput: this.props.projectName })
      }
    }
    handleProjectNameChange(nameInput) {
      this.setState({ nameInput })
    }
    async saveProject() {
      if (this.isSaving) {
        return
      }

      this.setError('')

      if (!this.state.nameInput) {
        return this.setError(
          'Du hast vergessen, dem Spiel einen Namen zu geben.'
        )
      }

      this.isSaving = true // used to immediately block multiple clicks
      this.setState({ isSaving: true }) // component state (async) used to reflect state on button

      let errPromise
      try {
        await this.saveAssets()
        await this.saveMeta()
      } catch (e) {
        if (!this.requestCancelSave) {
          errPromise = this.setError('Das hat leider nicht geklappt')
        } else {
          errPromise = Promise.reject()
        }
      } finally {
        if (this.requestCancelSave) {
          this.requestCancelSave = false
        }
        this.isSaving = false
        this.setState({ isSaving: false })
      }
      return errPromise
    }

    saveAssets() {
      const costumeAssets = serializeCostumes(this.props.vm.runtime)
      const soundAssets = serializeSounds(this.props.vm.runtime)
      return Promise.all(
        []
          .concat(costumeAssets)
          .concat(soundAssets)
          .map(async (asset) => {
            const res = await fetch('/api/prepareAssetUpload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                filename: asset.fileName,
              }),
            })
            if (!res.ok && res.status !== 409) {
              throw new Error(`uploading an asset failed: ${asset.filename}`)
            }

            const body = await res.json()
            if (body.exists) {
              return
            }

            const saveRes = await fetch(body.uploadUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': getContentType(asset.fileName),
              },
              body: asset.fileContent,
            })
            if (!saveRes.ok) {
              throw new Error('HTTP Request failed')
            }
          })
      )
    }
    async saveMeta() {
      if (this.requestCancelSave) {
        return
      }

      const payload = {
        data: this.props.vm.toJSON(),
        name: this.state.nameInput,
        userId: this.props.userId,
      }
      if (this.props.routeProject) {
        payload.id = this.props.routeProject
      }

      const res = await fetch('/api/saveProject', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      let resObj = null
      try {
        resObj = await res.json()
      } catch (e) {
        throw new Error(`Saving failed: ${await res.text()}`)
      }
      if (!res.ok) {
        throw new Error(`Saving failed: ${resObj.error}`)
      }

      if (this.requestCancelSave) {
        return
      }

      this.props.dispatch(setProjectUnchanged())
      this.props.dispatch(setProjectName(this.state.nameInput))
      if (this.props.routeProject !== resObj.id) {
        this.props.dispatch(setProjectId(resObj.id))
        this.props.dispatch(push(projectUrl(resObj.id)))
      }
    }
    cancelSave() {
      if (!this.isSaving) {
        return
      }
      this.requestCancelSave = true
      this.isSaving = false
      this.setState({ isSaving: false })
    }
    setError(text) {
      this.setState({ error: text })
      return Promise.reject(new Error(text))
    }
    render() {
      /* eslint-disable no-unused-vars */
      const {
        isEduGame,
        projectId,
        projectName,
        dispatch,
        vm,
        userId,
        routeProject,
        ...componentProps
      } = this.props
      /* eslint-enable */

      return (
        <WrappedComponent
          onProjectNameChange={this.handleProjectNameChange}
          projectName={this.state.nameInput}
          onSaveProject={this.saveProject}
          saveProjectError={this.state.error}
          isSaving={this.state.isSaving}
          cancelSave={this.cancelSave}
          {...componentProps}
        />
      )
    }
  }

  ProjectSaveComponent.propTypes = {
    isEduGame: PropTypes.bool,
    projectId: PropTypes.string,
    projectName: PropTypes.string,
    userId: PropTypes.string,
    routeProject: PropTypes.string,
    vm: PropTypes.object,
    dispatch: PropTypes.func,
  }

  return connect((state) => ({
    isEduGame: state.scratchGui.eduLayer.enabled,
    projectId: state.scratchGui.project.id,
    projectName: state.scratchGui.project.name,
    routeProject: (state.router.params || {}).projectId || null,
    userId: state.scratchGui.project.userId,
    vm: state.scratchGui.vm,
  }))(ProjectSaveComponent)
}

export default ProjectSaveHOC
