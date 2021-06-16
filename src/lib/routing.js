import { routerForBrowser } from 'redux-little-router'

export const Views = {
  edu: 'VIEW_EDU',
  menu: 'VIEW_MENU',
  project: 'VIEW_PROJECT',
  content: 'content',
  welcome: 'welcome',
}

export const MenuTabs = {
  edugames: 'lernspiele',
  examples: 'beispiele',
  projects: 'projekte',
  videos: 'videos',
}

export const eduUrl = (eduId) => `/lernspiel/${eduId}`
export const projectUrl = (projectId) => `/projekt/${projectId}`

const routes = {
  '/': {
    view: Views.menu,
  },
  '/lernspiele': {
    view: Views.menu,
    tab: MenuTabs.edugames,
  },
  '/projekte': {
    view: Views.menu,
    tab: MenuTabs.projects,
  },
  '/beispiele': {
    view: Views.menu,
    tab: MenuTabs.examples,
  },
  '/videos': {
    view: Views.menu,
    tab: MenuTabs.videos,
  },
  '/lernspiel/:eduId': {
    view: Views.edu,
  },
  '/welcome': {
    view: Views.welcome,
  },
  '/projekt': {
    '/neu': {
      view: Views.project,
      newProject: true,
    },
    '/:projectId': {
      view: Views.project,
    },
  },
  '/:page': {
    view: Views.content,
  },
}

export const { reducer, middleware, enhancer } = routerForBrowser({ routes })
