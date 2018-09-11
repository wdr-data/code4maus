import { LOCATION_CHANGED } from "redux-little-router";

import { LOAD_GAME } from "./edu-layer";
import { Views } from "../lib/routing";

const SET_PROJECT_NAME = 'scratch-gui/project/SET_PROJECT_NAME';
const SET_PROJECT_ID = 'scratch-gui/project/SET_PROJECT_ID';
const SET_USER_ID = 'scratch-gui/project/SET_USER_ID';
const SET_CUSTOM_BLOCKS = 'scratch-gui/project/SET_CUSTOM_BLOCKS';

const initialState = {
    customBlocks: null,
    name: '',
    id: '',
    userId: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
    case SET_PROJECT_NAME:
        return {
            ...state,
            name: action.name,
        };
    case SET_PROJECT_ID:
        return {
            ...state,
            id: action.id,
        };
    case SET_USER_ID:
        return {
            ...state,
            userId: action.userId,
        };
    case SET_CUSTOM_BLOCKS:
        return {
            ...state,
            customBlocks: action.blocks,
        };
    case LOAD_GAME:
        if (action.gameId === null ||
            action.gameSpec === null ||
            typeof action.gameSpec !== 'object') {
            return state;
        }
        return {
            ...state,
            id: `edu/${action.gameId}`,
            customBlocks: action.gameSpec.blocks || null,
        };
    case LOCATION_CHANGED:
        if (action.payload.result.view === Views.project || action.payload.result.view === Views.edu) {
            return state;
        }
        return {
            ...state,
            customBlocks: null,
        };
    default:
        return state;
    }
}

export function setProjectName(name) {
    return {
        type: SET_PROJECT_NAME,
        name,
    };
}

export function setProjectId(id) {
    return {
        type: SET_PROJECT_ID,
        id,
    };
}

export function setUserId(userId) {
    return {
        type: SET_USER_ID,
        userId,
    };
}

export function setCustomBlocks(blocks) {
    return {
        type: SET_CUSTOM_BLOCKS,
        blocks,
    };
}

export const projectInitialState = initialState;
