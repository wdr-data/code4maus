import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { activateTab, COSTUMES_TAB_INDEX } from '../reducers/editor-tab';
import { setHoveredSprite } from '../reducers/hovered-target';

import StageSelectorComponent from '../components/stage-selector/stage-selector.jsx';

import backdropLibraryContent from '../lib/libraries/backdrops.json';
import { emptyItem } from '../lib/default-project';
import { handleFileUpload, costumeUpload } from '../lib/file-uploader.js';

class StageSelector extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleNewBackdrop',
            'handleSurpriseBackdrop',
            'handleEmptyBackdrop',
            'addBackdropFromLibraryItem',
            'handleFileUploadClick',
            'handleBackdropUpload',
            'handleMouseEnter',
            'handleMouseLeave',
            'setFileInput',
        ]);
    }
    addBackdropFromLibraryItem(item) {
        const vmBackdrop = {
            name: item.name,
            md5: item.md5,
            rotationCenterX: item.info[0] && item.info[0] / 2,
            rotationCenterY: item.info[1] && item.info[1] / 2,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null,
        };
        this.handleNewBackdrop(vmBackdrop);
    }
    handleClick() {
        this.props.onSelect(this.props.id);
    }
    handleNewBackdrop(backdrop) {
        this.props.vm.addBackdrop(backdrop.md5, backdrop).then(() =>
            this.props.onActivateTab(COSTUMES_TAB_INDEX));
    }
    handleSurpriseBackdrop() {
        // @todo should this not add a backdrop you already have?
        const item = backdropLibraryContent[Math.floor(Math.random() * backdropLibraryContent.length)];
        this.addBackdropFromLibraryItem(item);
    }
    handleEmptyBackdrop() {
        if (emptyItem) {
            this.addBackdropFromLibraryItem(emptyItem);
        }
    }
    handleBackdropUpload(e) {
        const storage = this.props.vm.runtime.storage;
        handleFileUpload(e.target, (buffer, fileType, fileName) => {
            costumeUpload(buffer, fileType, fileName, storage, this.handleNewBackdrop);
        });
    }
    handleFileUploadClick() {
        this.fileInput.click();
    }
    handleMouseEnter() {
        this.props.dispatchSetHoveredSprite(this.props.id);
    }
    handleMouseLeave() {
        this.props.dispatchSetHoveredSprite(null);
    }
    setFileInput(input) {
        this.fileInput = input;
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            asset,
            dispatchSetHoveredSprite,
            id,
            onActivateTab,
            onSelect,
            /* eslint-enable no-unused-vars */
            ...componentProps
        } = this.props;
        return (
            <StageSelectorComponent
                fileInputRef={this.setFileInput}
                onBackdropFileUpload={this.handleBackdropUpload}
                onBackdropFileUploadClick={this.handleFileUploadClick}
                onClick={this.handleClick}
                onEmptyBackdropClick={this.handleEmptyBackdrop}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onSurpriseBackdropClick={this.handleSurpriseBackdrop}

                {...componentProps}
            />
        );
    }
}
StageSelector.propTypes = {
    ...StageSelectorComponent.propTypes,
    id: PropTypes.string,
    onSelect: PropTypes.func,
};

const mapStateToProps = (state, { asset, id }) => ({
    url: asset && asset.encodeDataURI(),
    vm: state.scratchGui.vm,
    receivedBlocks: state.scratchGui.hoveredTarget.receivedBlocks &&
            state.scratchGui.hoveredTarget.sprite === id,
    raised: state.scratchGui.blockDrag,
});

const mapDispatchToProps = (dispatch) => ({
    onNewBackdropClick: (e) => {
        e.preventDefault();
        dispatch(activateTab(COSTUMES_TAB_INDEX));
    },
    onActivateTab: (tabIndex) => {
        dispatch(activateTab(tabIndex));
    },
    dispatchSetHoveredSprite: (spriteId) => {
        dispatch(setHoveredSprite(spriteId));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageSelector);
