import { pianoAnalytics } from 'piano-analytics-js'
import {
  EVENTS,
  PROPERTIES,
  DEFAULT_PROPERTY_VALUES,
  menuTabTitles,
} from './constants'
import { editorTabNames } from '../../reducers/editor-tab'

pianoAnalytics.setConfigurations({
  site: 621455,
  collectDomain: 'https://logs1414.xiti.com/',
})

export const paSetConfig = () => {
  let configurations

  if (process.env.NODE_ENV === 'production') {
    configurations = {
      site: 632700,
      collectDomain: 'https://ama.wdr.de/',
    }
  } else {
    configurations = {
      site: 621455,
      collectDomain: 'https://logs1414.xiti.com/',
    }
  }
  pianoAnalytics.setConfigurations(configurations)
}

export const guiTypePages = (gameId) => {
  if (!gameId) {
    return [menuTabTitles[1], 'New Project']
  }

  if (gameId.match(/beispiel(0|0\d{1})?$/gm)) {
    return [menuTabTitles[2], `Beispiel ${gameId}`]
  } else {
    return [menuTabTitles[0], `Lernspiel ${gameId}`]
  }
}

const pageLevelKeys = [
  PROPERTIES.pageLevel1,
  PROPERTIES.pageLevel2,
  PROPERTIES.pageLevel3,
]

const sendEvent = (eventKey, data) => {
  let properties = { ...DEFAULT_PROPERTY_VALUES }

  switch (typeof data) {
    case 'string':
      properties[PROPERTIES.pageLevel1] = data
      break

    case 'object':
      properties = { ...properties, ...data }
      break
  }

  return pianoAnalytics.sendEvent(eventKey, {
    ...getCustomProperties(properties),
    ...properties,
  })
}

const getCustomProperties = (data) => {
  const pageList = pageLevelKeys
    .filter((key) => key in data)
    .map((key) => data[key])
  const platform = window.navigator.userAgent.match(/^(.*?)\(/)

  return {
    page: [data[PROPERTIES.siteLevel2], ...pageList].join('_'),
    ...(pageList.length && { [PROPERTIES.siteTitle]: pageList.slice(-1)[0] }),
    ...(platform.length && { [PROPERTIES.platform]: platform.slice(-1)[0] }),
  }
}

export const paEvent = {
  pageDisplay: ({ pages, pageType }) => {
    let data = {}

    if (typeof pages === 'string') {
      data[PROPERTIES.pageLevel1] = pages
    } else {
      const pagesList = [...pages].slice(0, 3)
      pagesList.forEach((page, index) => {
        data[PROPERTIES[`pageLevel${index + 1}`]] = page
      })
    }

    if (pageType) data[PROPERTIES.siteType] = pageType
    return sendEvent(EVENTS.pageDisplay, data)
  },
  clickAction: (params) => clickEvent(EVENTS.clickAction, params),
  clickExit: (params) => clickEvent(EVENTS.clickExit, params),
}

export const buildGuiPage = (eduId, isNewProject, activeTab) => {
  let pages = []
  if (isNewProject) {
    pages = [menuTabTitles[1], 'New Project']
  } else if (eduId && eduId.match(/beispiel(0|0\d{1})?$/gm)) {
    pages = [menuTabTitles[2], `Beispiel ${eduId}`]
  } else if (eduId) {
    pages = [menuTabTitles[0], `Lernspiel ${eduId}`]
  }
  return [...pages, editorTabNames[activeTab || 0]]
}

const clickEvent = (
  eventName,
  { pages, pageType, chapter1, chapter2, target }
) => {
  let data = {}

  const pagesList = [...pages].slice(0, 3)
  pagesList.forEach((page, index) => {
    data[PROPERTIES[`pageLevel${index + 1}`]] = page
  })
  data[PROPERTIES.siteType] = pageType

  const clickProperties = {
    [PROPERTIES.clickChapter1]: chapter1,
    [PROPERTIES.clickChapter2]: chapter2,
    [PROPERTIES.clickTarget]: target,
  }

  return sendEvent(eventName, {
    ...data,
    ...clickProperties,
  })
}
