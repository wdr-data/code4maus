import { routerForBrowser } from 'redux-little-router';

export const Views = {
    edu: 'VIEW_EDU',
    menu: 'VIEW_MENU',
    onboarding: 'VIEW_ONBOARDING',
    project: 'VIEW_PROJECT',
    content: 'content',
    welcome: 'welcome',
};

export const MenuTabs = {
    edugames: 'lernspiele',
    examples: 'beispiele',
    projects: 'projekte',
};

export const ContentPages = {
    parents: 'parents',
};

export const eduUrl = (eduId) => `/lernspiel/${eduId}`;
export const projectUrl = (projectId) => `/projekt/${projectId}`;

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
    '/lernspiel/:eduId': {
        view: Views.edu,
    },
    '/welcome': {
        view: Views.welcome,
    },
    '/onboarding': {
        '/:step': {
            view: Views.onboarding,
        },
        view: Views.onboarding,
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
    '/inhalte': {
        '/eltern': {
            view: Views.content,
            page: ContentPages.parents,
        },
    },
};

export const { reducer, middleware, enhancer } = routerForBrowser({ routes });
