import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setHoveredSprite } from '../reducers/hovered-target';
import { updateAssetDrag } from '../reducers/asset-drag';
import storage from '../lib/storage';
import { getEventXY } from '../lib/touch-utils';
import VM from '@wdr-data/scratch-vm';
import { SVGRenderer } from 'scratch-svg-renderer';
import getCostumeUrl from '../lib/get-costume-url';

import SpriteSelectorItemComponent from '../components/sprite-selector-item/sprite-selector-item.jsx';

const dragThreshold = 3; // Same as the block drag threshold
// Contains 'font-family', but doesn't only contain 'font-family="none"'
const HAS_FONT_REGEXP = 'font-family(?!="none")';

class SpriteSelectorItem extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'getCostumeUrl',
            'handleClick',
            'handleDelete',
            'handleDuplicate',
            'handleMouseEnter',
            'handleMouseLeave',
            'handleMouseDown',
            'handleMouseMove',
            'handleMouseUp',
        ]);
        this.svgRenderer = new SVGRenderer();
        // Asset ID of the SVG currently in SVGRenderer
        this.decodedAssetId = null;
    }
    shouldComponentUpdate(nextProps) {
        // Ignore dragPayload due to https://github.com/LLK/scratch-gui/issues/3172.
        // This function should be removed once the issue is fixed.
        for (const property in nextProps) {
            if (property !== 'dragPayload' && this.props[property] !== nextProps[property]) {
                return true;
            }
        }
        return false;
    }
    getCostumeData() {
        if (this.props.costumeURL) {
            return this.props.costumeURL;
        }
        if (!this.props.asset) {
            return null;
        }

        return getCostumeUrl(this.props.asset);
    }
    handleMouseUp() {
        if (this.props.disableDrag) {
            return;
        }

        this.initialOffset = null;
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('touchend', this.handleMouseUp);
        window.removeEventListener('touchmove', this.handleMouseMove);
        this.props.onDrag({
            img: null,
            currentOffset: null,
            dragging: false,
        });
    }
    handleMouseMove(e) {
        if (this.props.disableDrag) {
            return;
        }

        const currentOffset = getEventXY(e);
        const dx = currentOffset.x - this.initialOffset.x;
        const dy = currentOffset.y - this.initialOffset.y;
        if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
            this.props.onDrag({
                img: this.getCostumeData(),
                currentOffset: currentOffset,
                dragging: true,
            });
        }
        e.preventDefault();
    }
    handleMouseDown(e) {
        if (this.props.disableDrag) {
            return;
        }

        this.initialOffset = getEventXY(e);
        window.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('touchmove', this.handleMouseMove);
    }
    handleClick(e) {
        e.preventDefault();
        this.props.onClick(this.props.id);
    }
    handleDelete(e) {
        e.stopPropagation(); // To prevent from bubbling back to handleClick
        // @todo add i18n here
        // eslint-disable-next-line no-alert
        if (window.confirm('Wirklich löschen?')) {
            this.props.onDeleteButtonClick(this.props.id);
        }
    }
    handleDuplicate(e) {
        e.stopPropagation(); // To prevent from bubbling back to handleClick
        this.props.onDuplicateButtonClick(this.props.id);
    }
    handleMouseLeave() {
        this.props.dispatchSetHoveredSprite(null);
    }
    handleMouseEnter() {
        this.props.dispatchSetHoveredSprite(this.props.id);
    }
    render() {
        const {
            /* eslint-disable no-unused-vars */
            asset,
            disableDrag,
            id,
            onClick,
            onDeleteButtonClick,
            onDuplicateButtonClick,
            receivedBlocks,
            costumeURL,
            vm,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <SpriteSelectorItemComponent
                costumeURL={this.getCostumeUrl()}
                onClick={this.handleClick}
                onDeleteButtonClick={onDeleteButtonClick ? this.handleDelete : null}
                onDuplicateButtonClick={onDuplicateButtonClick ? this.handleDuplicate : null}
                onMouseDown={this.handleMouseDown}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                {...props}
            />
        );
    }
}

SpriteSelectorItem.propTypes = {
    asset: PropTypes.instanceOf(storage.Asset),
    costumeURL: PropTypes.string,
    dispatchSetHoveredSprite: PropTypes.func.isRequired,
    disableDrag: PropTypes.bool,
    id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    name: PropTypes.string,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDrag: PropTypes.func.isRequired,
    onDuplicateButtonClick: PropTypes.func,
    receivedBlocks: PropTypes.bool.isRequired,
    selected: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
};

const mapStateToProps = (state, { id }) => ({
    dragging: state.scratchGui.assetDrag.dragging,
    receivedBlocks: state.scratchGui.hoveredTarget.receivedBlocks &&
            state.scratchGui.hoveredTarget.sprite === id,
    vm: state.scratchGui.vm,
});
const mapDispatchToProps = (dispatch) => ({
    dispatchSetHoveredSprite: (spriteId) => {
        dispatch(setHoveredSprite(spriteId));
    },
    onDrag: (data) => dispatch(updateAssetDrag(data)),
});

const ConnectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(SpriteSelectorItem);

export {
    ConnectedComponent as default,
    HAS_FONT_REGEXP, // Exposed for testing
};
