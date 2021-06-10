import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'

import DOMElementRenderer from '../../containers/dom-element-renderer.jsx'
import Loupe from '../loupe/loupe.jsx'
import MonitorList from '../../containers/monitor-list.jsx'
import Question from '../../containers/question.jsx'
import Fullscreen from '../../containers/fullscreen.jsx'
import { useFeatureFlag, FEATURE_SHARING } from '../../lib/feature-flags.js'
import LazyRender from '../../containers/lazy-render.jsx'
import styles from './stage.css'

const StageComponent = (props) => {
  const {
    canvas,
    dragRef,
    height,
    isColorPicking,
    isFullScreen,
    width,
    colorInfo,
    onDeactivateColorPicker,
    question,
    onDoubleClick,
    onQuestionAnswered,
    useEditorDragStyle,
    ...boxProps
  } = props

  const showSharingToolbox = useFeatureFlag(FEATURE_SHARING)

  return (
    <div>
      <div
        className={classNames({
          [styles.stageWrapper]: !isFullScreen,
          [styles.stageWrapperOverlay]: isFullScreen,
          [styles.withColorPicker]: !isFullScreen && isColorPicking,
        })}
        onDoubleClick={onDoubleClick}
      >
        {isFullScreen && showSharingToolbox && (
          <LazyRender
            promise={import('../sharing-toolbox/sharing-toolbox.jsx')}
          />
        )}
        <DOMElementRenderer
          className={classNames(styles.stage, {
            [styles.stageOverlayContent]: isFullScreen,
          })}
          width={width}
          height={height}
          domElement={canvas}
          {...boxProps}
        />
        {isFullScreen ? null : <Fullscreen />}
        <div className={styles.monitorWrapper}>
          <MonitorList
            draggable={useEditorDragStyle}
            stageSize={{ height, width }}
          />
        </div>
        {isColorPicking && colorInfo ? (
          <div className={styles.colorPickerWrapper}>
            <Loupe colorInfo={colorInfo} />
          </div>
        ) : null}
        {question === null ? null : (
          <div
            className={classNames(
              styles.stageOverlayContent,
              styles.stageOverlayContentBorderOverride
            )}
          >
            <div className={styles.questionWrapper} style={{ width }}>
              <Question
                question={question}
                onQuestionAnswered={onQuestionAnswered}
              />
            </div>
          </div>
        )}
        <canvas
          className={styles.draggingSprite}
          height={0}
          ref={dragRef}
          width={0}
        />
      </div>
      {isColorPicking ? (
        <div
          className={styles.colorPickerBackground}
          onClick={onDeactivateColorPicker}
        />
      ) : null}
    </div>
  )
}
StageComponent.propTypes = {
  canvas: PropTypes.instanceOf(Element).isRequired,
  colorInfo: Loupe.propTypes.colorInfo,
  dragRef: PropTypes.func,
  height: PropTypes.number,
  isColorPicking: PropTypes.bool,
  isFullScreen: PropTypes.bool.isRequired,
  onDeactivateColorPicker: PropTypes.func,
  onQuestionAnswered: PropTypes.func,
  onDoubleClick: PropTypes.func,
  question: PropTypes.string,
  useEditorDragStyle: PropTypes.bool,
  width: PropTypes.number,
}
StageComponent.defaultProps = {
  dragRef: () => {},
}
export default StageComponent
