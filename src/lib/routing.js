import { routerForBrowser } from 'redux-little-router';

export const Views = {
    edu: 'VIEW_EDU',
    menu: 'VIEW_MENU',
    project: 'VIEW_PROJECT',
};

export const MenuTabs = {
    edugames: 'lernspiele',
    examples: 'beispiele',
    projects: 'projekte',
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
    '/projekt': {
        '/neu': {
            view: Views.project,
        },
        '/:projectId': {
            view: Views.project,
        },
        view: Views.project,
    },
};

export const { reducer, middleware, enhancer } = routerForBrowser({ routes });
