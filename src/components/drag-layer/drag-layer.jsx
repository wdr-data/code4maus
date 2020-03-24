import React from 'react'
import PropTypes from 'prop-types'
import styles from './drag-layer.css'

const DragLayer = (props) => {
  const { dragging, img, currentOffset } = props
  if (!dragging) return null

  return (
    <div className={styles.dragLayer}>
      <div
        className={styles.imageWrapper}
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        }}
      >
        <img className={styles.image} src={img} />
      </div>
    </div>
  )
}

DragLayer.propTypes = {
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  dragging: PropTypes.bool.isRequired,
  img: PropTypes.string,
}

export default DragLayer
