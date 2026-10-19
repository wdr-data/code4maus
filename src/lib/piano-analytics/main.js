import { editorTabNames } from '../../reducers/editor-tab'
import {
  EVENTS,
  PROPERTIES,
  DEFAULT_PROPERTY_VALUES,
  menuTabTitles,
} from './constants'

const SITES = {
  production: {
    site: 632700,
    collectDomain: 'https://lwqvhgk.pa-cd.com/',
  },
  test: {
    site: 621455,
    collectDomain: 'https://logs1414.xiti.com/',
  },
}

// Compared against the DefinePlugin constant so webpack drops the library when tracking is off
const pianoAnalytics =
  process.env.TRACKING_MODE !== 'off'
    ? require('piano-analytics-js').pianoAnalytics
    : null

const OPTOUT_MODE = 'optout'
const VISITOR_COOKIES = ['_pcid', '_pctx']

export const paIsOptedOut = () =>
  !!pianoAnalytics && pianoAnalytics.privacy.getMode() === OPTOUT_MODE

// The SDK stores the mode in its pa_privacy cookie and keeps the visitor ID
// cookies on opt-out, so remove them here.
export const paSetOptOut = (optOut) => {
  if (!pianoAnalytics) return
  pianoAnalytics.privacy.setMode(optOut ? OPTOUT_MODE : 'optin')
  if (optOut) {
    VISITOR_COOKIES.forEach((name) => {
      document.cookie = `${name}=; path=/; max-age=0`
    })
  }
}

export const paSetConfig = () => {
  if (!pianoAnalytics) return
  pianoAnalytics.setConfigurations(SITES[process.env.TRACKING_MODE])
}

const pageLevelKeys = [
  PROPERTIES.pageLevel1,
  PROPERTIES.pageLevel2,
  PROPERTIES.pageLevel3,
]

const sendEvent = (eventKey, data) => {
  if (!pianoAnalytics) return

  // Skipping the SDK entirely also keeps it from writing visitor ID cookies.
  if (paIsOptedOut()) return

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

  return {
    page: [data[PROPERTIES.siteLevel2], ...pageList].join('_'),
    ...(pageList.length && { [PROPERTIES.siteTitle]: pageList.slice(-1)[0] }),
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

// eduId set: Lernspiel or Beispiel; otherwise a new or saved own project
export const buildGuiPage = (eduId, isNewProject, activeTab) => {
  let pages
  if (eduId) {
    pages = eduId.startsWith('beispiel')
      ? [menuTabTitles[2], `Beispiel ${eduId}`]
      : [menuTabTitles[0], `Lernspiel ${eduId}`]
  } else if (isNewProject) {
    pages = [menuTabTitles[1], 'New Project']
  } else {
    pages = [menuTabTitles[1], 'Projekt']
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
    [PROPERTIES.clickLabel]: chapter2,
  }

  return sendEvent(eventName, {
    ...data,
    ...clickProperties,
  })
}
