import bindAll from 'lodash.bindall';
import React from 'react';

import { connect } from 'react-redux';

import {
    openSpriteLibrary,
    closeSpriteLibrary,
} from '../reducers/modals';

import { activateTab, COSTUMES_TAB_INDEX } from '../reducers/editor-tab';
import { setHoveredSprite, setReceivedBlocks } from '../reducers/hovered-target';

import TargetPaneComponent from '../components/target-pane/target-pane.jsx';
import spriteLibraryContent from '../lib/libraries/sprites.json';
import { handleFileUpload, spriteUpload } from '../lib/file-uploader.js';

const SpriteSelectorItemWidth = 62;

class TargetPane extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleBlockDragEnd',
            'handleChangeSpriteDirection',
            'handleChangeSpriteName',
            'handleChangeSpriteSize',
            'handleChangeSpriteVisibility',
            'handleChangeSpriteX',
            'handleChangeSpriteY',
            'handleDeleteSprite',
            'handleDuplicateSprite',
            'handleNewSprite',
            'handleSelectSprite',
            'handleSurpriseSpriteClick',
            'handlePaintSpriteClick',
            'handleFileUploadClick',
            'handleSpriteUpload',
            'handleGlobalTouchMove',
            'setFileInput',
        ]);

        this.spriteSelectorRef = React.createRef();
    }
    componentDidMount() {
        this.props.vm.addListener('BLOCK_DRAG_END', this.handleBlockDragEnd);
        document.body.addEventListener('touchmove', this.handleGlobalTouchMove);
    }
    componentWillUnmount() {
        this.props.vm.removeListener('BLOCK_DRAG_END', this.handleBlockDragEnd);
        document.body.removeEventListener('touchmove', this.handleGlobalTouchMove);
    }
    handleChangeSpriteDirection(direction) {
        this.props.vm.postSpriteInfo({ direction });
    }
    handleChangeSpriteName(name) {
        this.props.vm.renameSprite(this.props.editingTarget, name);
    }
    handleChangeSpriteSize(size) {
        this.props.vm.postSpriteInfo({ size });
    }
    handleChangeSpriteVisibility(visible) {
        this.props.vm.postSpriteInfo({ visible });
    }
    handleChangeSpriteX(x) {
        this.props.vm.postSpriteInfo({ x });
    }
    handleChangeSpriteY(y) {
        this.props.vm.postSpriteInfo({ y });
    }
    handleDeleteSprite(id) {
        this.props.vm.deleteSprite(id);
    }
    handleDuplicateSprite(id) {
        this.props.vm.duplicateSprite(id);
    }
    handleSelectSprite(id) {
        this.props.vm.setEditingTarget(id);
    }
    handleSurpriseSpriteClick() {
        const item = spriteLibraryContent[Math.floor(Math.random() * spriteLibraryContent.length)];
        this.props.vm.addSprite(JSON.stringify(item.json));
    }
    handlePaintSpriteClick() {
        // @todo this is brittle, will need to be refactored for localized libraries
        const emptyItem = spriteLibraryContent.find((item) => item.name === 'Empty');
        if (emptyItem) {
            this.props.vm.addSprite(JSON.stringify(emptyItem.json)).then(() => {
                setTimeout(() => { // Wait for targets update to propagate before tab switching
                    this.props.onActivateTab(COSTUMES_TAB_INDEX);
                });
            });
        }
    }
    handleNewSprite(spriteJSONString) {
        this.props.vm.addSprite(spriteJSONString);
    }
    handleFileUploadClick() {
        this.fileInput.click();
    }
    handleSpriteUpload(e) {
        const storage = this.props.vm.runtime.storage;
        handleFileUpload(e.target, (buffer, fileType, fileName) => {
            spriteUpload(buffer, fileType, fileName, storage, this.handleNewSprite);
        });
    }
    setFileInput(input) {
        this.fileInput = input;
    }
    handleBlockDragEnd(blocks) {
        if (this.props.hoveredTarget.sprite && this.props.hoveredTarget.sprite !== this.props.editingTarget) {
            this.props.vm.shareBlocksToTarget(blocks, this.props.hoveredTarget.sprite);
            this.props.onReceivedBlocks(true);
        }
    }
    handleGlobalTouchMove(event) {
        if (event.touches.length < 1) {
            return this.resetHoveredTarget();
        }

        const selector = this.spriteSelectorRef.current;
        if (!selector) {
            return this.resetHoveredTarget();
        }

        const bbox = selector.getBoundingClientRect();
        const startX = bbox.x + 8;
        const startY = bbox.y + 8;
        const stopY = bbox.bottom - 8;
        const touch = event.touches.item(0);

        if (touch.clientY < startY || touch.clientY > stopY) {
            return this.resetHoveredTarget();
        }

        const i = Math.floor((touch.clientX - startX) / SpriteSelectorItemWidth);
        if (i < 0 || i > Object.keys(this.props.sprites).length) {
            return this.resetHoveredTarget();
        }

        const sprites = Object.values(this.props.sprites)
            .sort((sprite1, sprite2) => sprite1.order - sprite2.order);
        this.props.onHoveredSprite(sprites[i].id);
    }
    resetHoveredTarget() {
        if (this.props.hoveredTarget) {
            this.props.onHoveredSprite(null);
        }
    }
    render() {
        const {
            onActivateTab, // eslint-disable-line no-unused-vars
            onReceivedBlocks, // eslint-disable-line no-unused-vars
            onHoveredSprite, // eslint-disable-line no-unused-vars
            ...componentProps
        } = this.props;
        return (
            <TargetPaneComponent
                {...componentProps}
                fileInputRef={this.setFileInput}
                onChangeSpriteDirection={this.handleChangeSpriteDirection}
                onChangeSpriteName={this.handleChangeSpriteName}
                onChangeSpriteSize={this.handleChangeSpriteSize}
                onChangeSpriteVisibility={this.handleChangeSpriteVisibility}
                onChangeSpriteX={this.handleChangeSpriteX}
                onChangeSpriteY={this.handleChangeSpriteY}
                onDeleteSprite={this.handleDeleteSprite}
                onDuplicateSprite={this.handleDuplicateSprite}
                onFileUploadClick={this.handleFileUploadClick}
                onPaintSpriteClick={this.handlePaintSpriteClick}
                onSelectSprite={this.handleSelectSprite}
                onSpriteUpload={this.handleSpriteUpload}
                onSurpriseSpriteClick={this.handleSurpriseSpriteClick}
                spriteSelectorRef={this.spriteSelectorRef}
            />
        );
    }
}

const {
    onSelectSprite, // eslint-disable-line no-unused-vars
    spriteSelectorRef, // eslint-disable-line no-unused-vars
    ...targetPaneProps
} = TargetPaneComponent.propTypes;

TargetPane.propTypes = {
    ...targetPaneProps,
};

const mapStateToProps = (state) => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    hoveredTarget: state.scratchGui.hoveredTarget,
    sprites: Object.keys(state.scratchGui.targets.sprites).reduce((sprites, k) => {
        let { direction, size, x, y, ...sprite } = state.scratchGui.targets.sprites[k];
        if (typeof direction !== 'undefined') {
            direction = Math.round(direction);
        }
        if (typeof x !== 'undefined') {
            x = Math.round(x);
        }
        if (typeof y !== 'undefined') {
            y = Math.round(y);
        }
        if (typeof size !== 'undefined') {
            size = Math.round(size);
        }
        sprites[k] = { ...sprite, direction, size, x, y };
        return sprites;
    }, {}),
    stage: state.scratchGui.targets.stage,
    raiseSprites: state.scratchGui.blockDrag,
    spriteLibraryVisible: state.scratchGui.modals.spriteLibrary,
});
const mapDispatchToProps = (dispatch) => ({
    onNewSpriteClick: (e) => {
        e.preventDefault();
        dispatch(openSpriteLibrary());
    },
    onRequestCloseSpriteLibrary: () => {
        dispatch(closeSpriteLibrary());
    },
    onActivateTab: (tabIndex) => {
        dispatch(activateTab(tabIndex));
    },
    onReceivedBlocks: (receivedBlocks) => {
        dispatch(setReceivedBlocks(receivedBlocks));
    },
    onHoveredSprite: (spriteId) => dispatch(setHoveredSprite(spriteId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TargetPane);
