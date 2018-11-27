import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { setHoveredSprite } from '../reducers/hovered-target';
import { updateAssetDrag } from '../reducers/asset-drag';
import { getEventXY } from '../lib/touch-utils';

import SpriteSelectorItemComponent from '../components/sprite-selector-item/sprite-selector-item.jsx';

const dragThreshold = 3; // Same as the block drag threshold

class SpriteSelectorItem extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleDelete',
            'handleDuplicate',
            'handleMouseEnter',
            'handleMouseLeave',
            'handleMouseDown',
            'handleMouseMove',
            'handleMouseUp',
        ]);
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
                img: this.props.costumeURL,
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
            assetId,
            disableDrag,
            id,
            onClick,
            onDeleteButtonClick,
            onDuplicateButtonClick,
            receivedBlocks,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <SpriteSelectorItemComponent
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
    assetId: PropTypes.string,
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
};

const mapStateToProps = (state, { assetId, costumeURL, id }) => ({
    costumeURL: costumeURL || assetId && state.scratchGui.vm.runtime.storage.get(assetId).encodeDataURI(),
    dragging: state.scratchGui.assetDrag.dragging,
    receivedBlocks: state.scratchGui.hoveredTarget.receivedBlocks &&
            state.scratchGui.hoveredTarget.sprite === id,
});
const mapDispatchToProps = (dispatch) => ({
    dispatchSetHoveredSprite: (spriteId) => {
        dispatch(setHoveredSprite(spriteId));
    },
    onDrag: (data) => dispatch(updateAssetDrag(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SpriteSelectorItem);
