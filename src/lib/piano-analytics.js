import { pianoAnalytics } from 'piano-analytics-js'

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

export const EVENTS = {
  pageDisplay: 'page.display',
  clickNavigation: 'click.navigation',
  clickExit: 'click.exit',
  clickAction: 'click.action',
}

export const PROPERTIES = {
  siteLevel2: 'site_level2',
  brand: 'brand',
  redaction: 'editorial_department',
  platform: 'platform',
  siteTitle: 'page_title',
  pageLevel1: 'page_chapter1',
  pageLevel2: 'page_chapter2',
  pageLevel3: 'page_chapter3',
  siteType: 'page_type',
  publicationTimeAt: 'publication_time', // date
  reactionUpdatedAt: 'last_editorial_update', // date
  daysSincePublication: 'days_since_publication', // integer
  clickLabel: 'click',
  clickTarget: 'click_target',
  clickChapter1: 'click_chapter1',
  clickChapter2: 'click_chapter2',
}

const DEFAULT_PROPERTY_VALUES = {
  [PROPERTIES.siteLevel2]: 'Programmieren mit der Maus',
  [PROPERTIES.brand]: 'Die Maus',
  [PROPERTIES.redaction]: 'PG Kinder und Familie',
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

const clickEventEntries = () => {
  const { pageDisplay, ...otherEvents } = EVENTS

  return Object.entries(otherEvents).map(([eventName, eventKey]) => [
    eventName,
    (data) => sendEvent(eventKey, data),
  ])
}

const clickEvents = Object.fromEntries(clickEventEntries())

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
  ...clickEvents,
}
