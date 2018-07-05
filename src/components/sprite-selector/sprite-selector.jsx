import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import Box from '../box/box.jsx';
import SpriteInfo from '../../containers/sprite-info.jsx';
import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx';

import styles from './sprite-selector.css';
import itemStyles from '../sprite-selector-item/sprite-selector-item.css';

import spriteIcon from '../action-menu/icon--sprite.svg';

const messages = defineMessages({
    addSpriteFromLibrary: {
        id: 'gui.spriteSelector.addSpriteFromLibrary',
        description: 'Button to add a sprite in the target pane from library',
        defaultMessage: 'Choose a Sprite'
    },
    addSpriteFromPaint: {
        id: 'gui.spriteSelector.addSpriteFromPaint',
        description: 'Button to add a sprite in the target pane from paint',
        defaultMessage: 'Paint'
    },
    addSpriteFromSurprise: {
        id: 'gui.spriteSelector.addSpriteFromSurprise',
        description: 'Button to add a random sprite in the target pane',
        defaultMessage: 'Surprise'
    },
    addSpriteFromFile: {
        id: 'gui.spriteSelector.addSpriteFromFile',
        description: 'Button to add a sprite in the target pane from file',
        defaultMessage: 'Upload'
    }
});

const SpriteSelectorComponent = function (props) {
    const {
        editingTarget,
        hoveredTarget,
        intl,
        onChangeSpriteDirection,
        onChangeSpriteName,
        onChangeSpriteSize,
        onChangeSpriteVisibility,
        onChangeSpriteX,
        onChangeSpriteY,
        onDeleteSprite,
        onDuplicateSprite,
        onFileUploadClick,
        onNewSpriteClick,
        onPaintSpriteClick,
        onSelectSprite,
        onSpriteUpload,
        onSurpriseSpriteClick,
        raised,
        selectedId,
        spriteFileInput,
        sprites,
        ...componentProps
    } = props;
    let selectedSprite = sprites[selectedId];
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === 'undefined') {
        selectedSprite = {};
        spriteInfoDisabled = true;
    }
    return (
        <Box className={styles.itemsWrapper}>
            {Object.keys(sprites)
                // Re-order by list order
                .sort((id1, id2) => sprites[id1].order - sprites[id2].order)
                .map(id => sprites[id])
                .map(sprite => (
                    <SpriteSelectorItem
                        assetId={sprite.costume && sprite.costume.assetId}
                        className={hoveredTarget.sprite === sprite.id &&
                            sprite.id !== editingTarget &&
                            hoveredTarget.receivedBlocks ?
                            classNames(styles.sprite, styles.receivedBlocks) :
                            raised && sprite.id !== editingTarget ?
                                classNames(styles.sprite, styles.raised) : styles.sprite}
                        id={sprite.id}
                        key={sprite.id}
                        name={sprite.name}
                        selected={sprite.id === selectedId}
                        onClick={onSelectSprite}
                        onDeleteButtonClick={onDeleteSprite}
                        onDuplicateButtonClick={onDuplicateSprite}
                    />
                ))
            }
            <button
                aria-label={intl.formatMessage(messages.addSpriteFromLibrary)}
                className={classNames(styles.sprite, itemStyles.spriteSelectorItem, styles.addBox)}
                onClick={onNewSpriteClick}
            >
                <span>+</span>
            </button>
        </Box>
    );
};

SpriteSelectorComponent.propTypes = {
    editingTarget: PropTypes.string,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool
    }),
    intl: intlShape.isRequired,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteSize: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    raised: PropTypes.bool,
    selectedId: PropTypes.string,
    spriteFileInput: PropTypes.func,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            costume: PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired,
                bitmapResolution: PropTypes.number.isRequired,
                rotationCenterX: PropTypes.number.isRequired,
                rotationCenterY: PropTypes.number.isRequired
            }),
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired
        })
    })
};

export default injectIntl(SpriteSelectorComponent);
