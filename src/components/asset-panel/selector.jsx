import PropTypes from 'prop-types'
import React from 'react'

import SpriteSelectorItem from '../../containers/sprite-selector-item.jsx'

import ActionMenu from '../action-menu/action-menu.jsx'
import styles from './selector.css'

const Selector = (props) => {
  const {
    buttons,
    items,
    selectedItemIndex,
    onDeleteClick,
    onDuplicateClick,
    onItemClick,
  } = props

  let newButtonSection = null

  if (buttons.length > 0) {
    newButtonSection = (
      <div className={styles.newButtons}>
        <ActionMenu moreButtons={buttons} />
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.listArea}>
        {items.map((item, index) => (
          <SpriteSelectorItem
            asset={item.asset}
            className={styles.listItem}
            costumeURL={item.url}
            details={item.details}
            dragPayload={item.dragPayload}
            id={index}
            index={index}
            name={item.name}
            key={item.name}
            number={index + 1 /* 1-indexed */}
            selected={index === selectedItemIndex}
            onClick={onItemClick}
            onDeleteButtonClick={onDeleteClick}
            onDuplicateButtonClick={onDuplicateClick}
          />
        ))}
      </div>
      {newButtonSection}
    </div>
  )
}

Selector.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ),
  onDeleteClick: PropTypes.func,
  onDuplicateClick: PropTypes.func,
  onItemClick: PropTypes.func.isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
}

export default Selector
