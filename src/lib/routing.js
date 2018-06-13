import { routerForBrowser } from 'redux-little-router';

export const Views = {
    start: 'VIEW_START',
    edu: 'VIEW_EDU',
    project: 'VIEW_PROJECT',
    listing: 'VIEW_LISTING',
};

export const eduUrl = (eduId) => `/lernspiel/${eduId}`;
export const projectUrl = (projectId) => `/projekt/${projectId}`;

const routes = {
    '/': {
        view: Views.start,
    },
    '/lernspiel/:eduId': {
        view: Views.edu,
    },
    '/projekt/:projectId': {
        view: Views.project,
    },
    '/projekte': {
        view: Views.listing,
    },
};

export const { reducer, middleware, enhancer } = routerForBrowser({ routes });
