const SET_PROJECT_NAME = 'scratch-gui/project/SET_PROJECT_NAME';
const SET_PROJECT_ID = 'scratch-gui/project/SET_PROJECT_ID';
const SET_USER_ID = 'scratch-gui/project/SET_USER_ID';

const initialState = {
    name: '',
    id: '',
    userId: 'testuser',
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

export const projectInitialState = initialState;
