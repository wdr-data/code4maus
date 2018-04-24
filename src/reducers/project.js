const SET_PROJECT_NAME = 'scratch-gui/project/SET_PROJECT_NAME' 

const initialState = {
    name: ""
};

export default function(state = initialState, action) {
    switch(action.type) {
    case SET_PROJECT_NAME:
        return {
            ...state,
            name: action.name
        }
    default: 
        return state
    }
}

export function setProjectName(name) {
    return {
        type: SET_PROJECT_NAME,
        name
    }
}

export const projectInitialState = initialState;
