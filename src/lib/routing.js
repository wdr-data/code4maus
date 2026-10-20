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
