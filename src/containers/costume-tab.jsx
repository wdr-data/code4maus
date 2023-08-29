import PropTypes from 'prop-types'
import React from 'react'
import bindAll from 'lodash.bindall'
import { defineMessages, intlShape, injectIntl } from 'react-intl'
import VM from 'scratch-vm'

import { connect } from 'react-redux'
import AssetPanel from '../components/asset-panel/asset-panel.jsx'
import { emptyItem } from '../lib/default-project'
import { handleFileUpload, costumeUpload } from '../lib/file-uploader.js'
import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx'

import {
  closeCameraCapture,
  closeCostumeLibrary,
  closeBackdropLibrary,
  openCameraCapture,
  openCostumeLibrary,
} from '../reducers/modals'

import addLibraryIcon from '../../assets/icons/target_add.svg'
import fileUploadIcon from '../components/action-menu/icon--file-upload.svg'
import paintIcon from '../components/action-menu/icon--paint.svg'
import surpriseIcon from '../components/action-menu/icon--surprise.svg'

import costumeLibraryContent from '../lib/libraries/costumes.json'
import backdropLibraryContent from '../lib/libraries/backdrops.json'
import CameraModal from './camera-modal.jsx'
import BackdropLibrary from './backdrop-library.jsx'
import CostumeLibrary from './costume-library.jsx'
import PaintEditorWrapper from './paint-editor-wrapper.jsx'

const messages = defineMessages({
  addLibraryBackdropMsg: {
    defaultMessage: 'Wähle einen Hintergrund',
    description: 'Button to add a backdrop in the editor tab',
    id: 'gui.costumeTab.addBackdropFromLibrary',
  },
  addLibraryCostumeMsg: {
    defaultMessage: 'Wähle ein Kostüm',
    description: 'Button to add a costume in the editor tab',
    id: 'gui.costumeTab.addCostumeFromLibrary',
  },
  addBlankCostumeMsg: {
    defaultMessage: 'Malen',
    description: 'Button to add a blank costume in the editor tab',
    id: 'gui.costumeTab.addBlankCostume',
  },
  addSurpriseCostumeMsg: {
    defaultMessage: 'Überraschung',
    description: 'Button to add a surprise costume in the editor tab',
    id: 'gui.costumeTab.addSurpriseCostume',
  },
  addFileBackdropMsg: {
    defaultMessage: 'Hintergrund hochladen',
    description:
      'Button to add a backdrop by uploading a file in the editor tab',
    id: 'gui.costumeTab.addFileBackdrop',
  },
  addFileCostumeMsg: {
    defaultMessage: 'Kostüm hochladen',
    description:
      'Button to add a costume by uploading a file in the editor tab',
    id: 'gui.costumeTab.addFileCostume',
  },
})

class CostumeTab extends React.Component {
  constructor(props) {
    super(props)
    bindAll(this, [
      'handleSelectCostume',
      'handleDeleteCostume',
      'handleDuplicateCostume',
      'handleNewCostume',
      'handleNewBlankCostume',
      'handleSurpriseCostume',
      'handleSurpriseBackdrop',
      'handleFileUploadClick',
      'handleCostumeUpload',
      'handleCameraBuffer',
      'setFileInput',
    ])
    const { editingTarget, sprites, stage } = props
    const target =
      editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage
    if (target && target.currentCostume) {
      this.state = { selectedCostumeIndex: target.currentCostume }
    } else {
      this.state = { selectedCostumeIndex: 0 }
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { editingTarget, sprites, stage } = nextProps

    const target =
      editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage
    if (!target || !target.costumes) {
      return
    }

    if (this.props.editingTarget === editingTarget) {
      // If costumes have been added or removed, change costumes to the editing target's
      // current costume.
      const oldTarget = this.props.sprites[editingTarget]
        ? this.props.sprites[editingTarget]
        : this.props.stage
      // @todo: Find and switch to the index of the costume that is new. This is blocked by
      // https://github.com/LLK/scratch-vm/issues/967
      // Right now, you can land on the wrong costume if a costume changing script is running.
      if (oldTarget.costumeCount !== target.costumeCount) {
        this.setState({ selectedCostumeIndex: target.currentCostume })
      }
    } else {
      // If switching editing targets, update the costume index
      this.setState({ selectedCostumeIndex: target.currentCostume })
    }
  }
  handleSelectCostume(costumeIndex) {
    this.props.vm.editingTarget.setCostume(costumeIndex)
    this.setState({ selectedCostumeIndex: costumeIndex })
  }
  handleDeleteCostume(costumeIndex) {
    this.props.vm.deleteCostume(costumeIndex)
  }
  handleDuplicateCostume(costumeIndex) {
    this.props.vm.duplicateCostume(costumeIndex)
  }
  handleNewCostume(costume) {
    this.props.vm.addCostume(costume.md5, costume)
  }
  handleNewBlankCostume() {
    const name = this.props.vm.editingTarget.isStage ? `backdrop1` : `costume1`
    const vmCostume = {
      name: name,
      md5: emptyItem.md5,
      rotationCenterX: emptyItem.info[0],
      rotationCenterY: emptyItem.info[1],
      bitmapResolution: emptyItem.info.length > 2 ? emptyItem.info[2] : 1,
      skinId: null,
    }

    this.handleNewCostume(vmCostume)
  }
  handleSurpriseCostume() {
    const item =
      costumeLibraryContent[
        Math.floor(Math.random() * costumeLibraryContent.length)
      ]
    const split = item.md5.split('.')
    const type = split.length > 1 ? split[1] : null
    const rotationCenterX = type === 'svg' ? item.info[0] : item.info[0] / 2
    const rotationCenterY = type === 'svg' ? item.info[1] : item.info[1] / 2
    const vmCostume = {
      name: item.name,
      md5: item.md5,
      rotationCenterX,
      rotationCenterY,
      bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
      skinId: null,
    }
    this.handleNewCostume(vmCostume)
  }
  handleSurpriseBackdrop() {
    const item =
      backdropLibraryContent[
        Math.floor(Math.random() * backdropLibraryContent.length)
      ]
    const vmCostume = {
      name: item.name,
      md5: item.md5,
      rotationCenterX: item.info[0] && item.info[0] / 2,
      rotationCenterY: item.info[1] && item.info[1] / 2,
      bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
      skinId: null,
    }
    this.handleNewCostume(vmCostume)
  }
  handleCostumeUpload(e) {
    const storage = this.props.vm.runtime.storage
    handleFileUpload(e.target, (buffer, fileType, fileName) => {
      costumeUpload(buffer, fileType, fileName, storage, this.handleNewCostume)
    })
  }
  handleCameraBuffer(buffer) {
    const storage = this.props.vm.runtime.storage
    costumeUpload(
      buffer,
      'image/png',
      'costume1',
      storage,
      this.handleNewCostume
    )
  }
  handleFileUploadClick() {
    this.fileInput.click()
  }
  setFileInput(input) {
    this.fileInput = input
  }
  formatCostumeDetails(size, optResolution) {
    // If no resolution is given, assume that the costume is an SVG
    const resolution = optResolution ? optResolution : 1
    // Convert size to stage units by dividing by resolution
    // Round up width and height for scratch-flash compatibility
    // https://github.com/LLK/scratch-flash/blob/9fbac92ef3d09ceca0c0782f8a08deaa79e4df69/src/ui/media/MediaInfo.as#L224-L237
    return `${Math.ceil(size[0] / resolution)} x ${Math.ceil(
      size[1] / resolution
    )}`
  }
  render() {
    const {
      intl,
      onNewLibraryBackdropClick,
      onNewLibraryCostumeClick,
      backdropLibraryVisible,
      cameraModalVisible,
      costumeLibraryVisible,
      onRequestCloseBackdropLibrary,
      onRequestCloseCameraModal,
      onRequestCloseCostumeLibrary,
      editingTarget,
      sprites,
      stage,
      vm,
    } = this.props

    const target =
      editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage

    if (!target) {
      return null
    }

    const addLibraryMessage = target.isStage
      ? messages.addLibraryBackdropMsg
      : messages.addLibraryCostumeMsg
    const addFileMessage = target.isStage
      ? messages.addFileBackdropMsg
      : messages.addFileCostumeMsg
    const addSurpriseFunc = target.isStage
      ? this.handleSurpriseBackdrop
      : this.handleSurpriseCostume
    const addLibraryFunc = target.isStage
      ? onNewLibraryBackdropClick
      : onNewLibraryCostumeClick

    const costumeData = (target.costumes || []).map((costume) => ({
      name: costume.name,
      asset: costume.asset,
      details: costume.size
        ? this.formatCostumeDetails(costume.size, costume.bitmapResolution)
        : null,
    }))

    return (
      <AssetPanel
        buttons={[
          target.isStage
            ? null
            : {
                title: intl.formatMessage(addLibraryMessage),
                img: addLibraryIcon,
                onClick: addLibraryFunc,
              },
          {
            title: intl.formatMessage(addFileMessage),
            img: fileUploadIcon,
            onClick: this.handleFileUploadClick,
            fileAccept: '.svg, .png, .jpg, .jpeg',
            fileChange: this.handleCostumeUpload,
            fileInput: this.setFileInput,
          },
          {
            title: intl.formatMessage(messages.addSurpriseCostumeMsg),
            img: surpriseIcon,
            onClick: addSurpriseFunc,
          },
          {
            title: intl.formatMessage(messages.addBlankCostumeMsg),
            img: paintIcon,
            onClick: this.handleNewBlankCostume,
          },
        ].filter((o) => !!o)}
        items={costumeData}
        selectedItemIndex={this.state.selectedCostumeIndex}
        onDeleteClick={
          target && target.costumes && target.costumes.length > 1
            ? this.handleDeleteCostume
            : null
        }
        onDuplicateClick={this.handleDuplicateCostume}
        onItemClick={this.handleSelectCostume}
      >
        {target.costumes ? (
          <PaintEditorWrapper
            selectedCostumeIndex={this.state.selectedCostumeIndex}
          />
        ) : null}
        {costumeLibraryVisible ? (
          <CostumeLibrary
            vm={vm}
            onRequestClose={onRequestCloseCostumeLibrary}
          />
        ) : null}
        {backdropLibraryVisible ? (
          <BackdropLibrary
            vm={vm}
            onRequestClose={onRequestCloseBackdropLibrary}
          />
        ) : null}
        {cameraModalVisible ? (
          <CameraModal
            onClose={onRequestCloseCameraModal}
            onNewCostume={this.handleCameraBuffer}
          />
        ) : null}
      </AssetPanel>
    )
  }
}

CostumeTab.propTypes = {
  backdropLibraryVisible: PropTypes.bool,
  cameraModalVisible: PropTypes.bool,
  costumeLibraryVisible: PropTypes.bool,
  editingTarget: PropTypes.string,
  intl: intlShape,
  onNewCostumeFromCameraClick: PropTypes.func.isRequired,
  onNewLibraryBackdropClick: PropTypes.func.isRequired,
  onNewLibraryCostumeClick: PropTypes.func.isRequired,
  onRequestCloseBackdropLibrary: PropTypes.func.isRequired,
  onRequestCloseCameraModal: PropTypes.func.isRequired,
  onRequestCloseCostumeLibrary: PropTypes.func.isRequired,
  sprites: PropTypes.shape({
    id: PropTypes.shape({
      costumes: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
          name: PropTypes.string.isRequired,
          skinId: PropTypes.number,
        })
      ),
    }),
  }),
  stage: PropTypes.shape({
    sounds: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
  }),
  vm: PropTypes.instanceOf(VM),
}

const mapStateToProps = (state) => ({
  editingTarget: state.scratchGui.targets.editingTarget,
  sprites: state.scratchGui.targets.sprites,
  stage: state.scratchGui.targets.stage,
  cameraModalVisible: state.scratchGui.modals.cameraCapture,
  costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
  backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
})

const mapDispatchToProps = (dispatch) => ({
  onNewLibraryBackdropClick: (e) => {
    e.preventDefault()
    // no-op
  },
  onNewLibraryCostumeClick: (e) => {
    e.preventDefault()
    dispatch(openCostumeLibrary())
  },
  onNewCostumeFromCameraClick: () => {
    dispatch(openCameraCapture())
  },
  onRequestCloseBackdropLibrary: () => {
    dispatch(closeBackdropLibrary())
  },
  onRequestCloseCostumeLibrary: () => {
    dispatch(closeCostumeLibrary())
  },
  onRequestCloseCameraModal: () => {
    dispatch(closeCameraCapture())
  },
})

export default errorBoundaryHOC('Costume Tab')(
  injectIntl(connect(mapStateToProps, mapDispatchToProps)(CostumeTab))
)
