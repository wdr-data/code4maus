import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import DOMElementRenderer from '../../containers/dom-element-renderer.jsx';
import Loupe from '../loupe/loupe.jsx';
import MonitorList from '../../containers/monitor-list.jsx';
import Question from '../../containers/question.jsx';
import { getStageSize } from '../../lib/screen-utils.js';
import styles from './stage.css';
import Fullscreen from '../../containers/fullscreen.jsx';

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
    } = props;

    const stageDimensions = getStageSize(isFullScreen, height, width);

    return (
        <div>
            <Box
                className={classNames({
                    [styles.stageWrapper]: !isFullScreen,
                    [styles.stageWrapperOverlay]: isFullScreen,
                    [styles.withColorPicker]: !isFullScreen && isColorPicking,
                })}
                onDoubleClick={onDoubleClick}
            >
                <DOMElementRenderer
                    className={classNames(
                        styles.stage,
                        { [styles.stageOverlayContent]: isFullScreen }
                    )}
                    domElement={canvas}
                    height={stageDimensions.height}
                    width={stageDimensions.width}
                    {...boxProps}
                />
                {isFullScreen ? null :
                    <Fullscreen />
                }
                <Box className={styles.monitorWrapper}>
                    <MonitorList
                        draggable={useEditorDragStyle}
                        stageSize={stageDimensions}
                    />
                </Box>
                {isColorPicking && colorInfo ?
                    <Box className={styles.colorPickerWrapper}>
                        <Loupe colorInfo={colorInfo} />
                    </Box>
                    : null}
                {question === null ? null :
                    <div
                        className={classNames(
                            styles.stageOverlayContent,
                            styles.stageOverlayContentBorderOverride
                        )}
                    >
                        <div
                            className={styles.questionWrapper}
                            style={{ width: stageDimensions.width }}
                        >
                            <Question
                                question={question}
                                onQuestionAnswered={onQuestionAnswered}
                            />
                        </div>
                    </div>
                }
                <canvas
                    className={styles.draggingSprite}
                    height={0}
                    ref={dragRef}
                    width={0}
                />
            </Box>
            {isColorPicking ?
                <Box
                    className={styles.colorPickerBackground}
                    onClick={onDeactivateColorPicker}
                />
                : null}
        </div>
    );
};
StageComponent.propTypes = {
    canvas: PropTypes.instanceOf(Element).isRequired,
    colorInfo: Loupe.propTypes.colorInfo,
    dragRef: PropTypes.func,
    height: PropTypes.number,
    isColorPicking: PropTypes.bool,
    isFullScreen: PropTypes.bool.isRequired,
    onDeactivateColorPicker: PropTypes.func,
    onQuestionAnswered: PropTypes.func,
    question: PropTypes.string,
    useEditorDragStyle: PropTypes.bool,
    width: PropTypes.number,
};
StageComponent.defaultProps = {
    dragRef: () => {},
};
export default StageComponent;
