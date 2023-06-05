import { pianoAnalytics } from 'piano-analytics-js'
import {
  EVENTS,
  PROPERTIES,
  DEFAULT_PROPERTY_VALUES,
  menuTabTitles,
} from './constants'

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

const pageValuesToData = ({ pages, pageType }) => {
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
  return data
}

const clickEventEntries = () => {
  return Object.entries(EVENTS).map(([eventName, eventKey]) => [
    eventName,
    (data) => sendEvent(eventKey, pageValuesToData(data)),
  ])
}

export const paEvent = Object.fromEntries(clickEventEntries())
