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
  siteType: 'content_type',
  publicationTimeAt: 'publication_time', // date
  reactionUpdatedAt: 'last_editorial_update', // date
  daysSincePublication: 'days_since_publication', // integer
  clickLabel: 'click',
  clickTarget: 'click_target',
  clickChapter1: 'click_chapter1',
  clickChapter2: 'click_chapter2',
}

export const DEFAULT_PROPERTY_VALUES = {
  [PROPERTIES.siteLevel2]: 'Programmieren mit der Maus',
  [PROPERTIES.brand]: 'Die Maus',
  [PROPERTIES.redaction]: 'PG Kinder und Familie',
  [PROPERTIES.platform]: 'Web',
}

export const menuTabTitles = {
  0: 'Lernen',
  1: 'Meine Sachen',
  2: 'Beispiele',
  3: 'Videos',
}
