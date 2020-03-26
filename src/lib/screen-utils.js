import layout from './layout-constants.js'

const STAGE_SIZE_DEFAULTS = {
  heightSmall: 360,
  widthSmall: 480,
  spacingBorderAdjustment: 9,
  menuHeightAdjustment: 40,
}

const getStageSize = (isFullScreen = false) => {
  let height =
    (window.innerHeight - layout.topBarHeight - layout.stageHeaderHeight - 8) /
    2
  let width = Math.floor((height * 4) / 3)

  const stageSize = {
    defaultHeight: height,
    defaultWidth: width,
  }

  if (isFullScreen) {
    height =
      window.innerHeight -
      STAGE_SIZE_DEFAULTS.menuHeightAdjustment -
      STAGE_SIZE_DEFAULTS.spacingBorderAdjustment

    width = height + height / 3

    if (width > window.innerWidth) {
      width = window.innerWidth
      height = width * 0.75
    }
  }

  return {
    ...stageSize,
    height,
    width,
  }
}

export { getStageSize, STAGE_SIZE_DEFAULTS }
