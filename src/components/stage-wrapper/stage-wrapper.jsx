import PropTypes from 'prop-types'
import React from 'react'
import VM from 'scratch-vm'

import Stage from '../../containers/stage.jsx'

import styles from './stage-wrapper.css'

const StageWrapperComponent = function (props) {
  const { stageSize, vm } = props

  return (
    <div className={styles.stageWrapper} aria-label="Bühne">
      <div className={styles.stageCanvasWrapper}>
        <Stage
          height={stageSize.height}
          shrink={0}
          vm={vm}
          width={stageSize.width}
        />
      </div>
    </div>
  )
}

StageWrapperComponent.propTypes = {
  isRendererSupported: PropTypes.bool.isRequired,
  stageSize: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }).isRequired,
  vm: PropTypes.instanceOf(VM).isRequired,
}

export default StageWrapperComponent
