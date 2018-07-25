const NEXT_SLIDE = 'scratch-gui/edu-layer/NEXT_SLIDE';
const PREVIOUS_SLIDE = 'scratch-gui/edu-layer/PREVIOUS_SLIDE';
const TOGGLE_FULLSCREEN = 'scratch-gui/edu-layer/TOGGLE_FULLSCREEN';
const LOAD_GAME = 'scratch-gui/edu-layer/LOAD_GAME';

const initialState = {
    size: 0,
    index: 0,
    isFullscreen: false,
    enabled: false,
    gameId: null,
    gameSpec: null,
};

export default function(state = initialState, action) {
    switch (action.type) {
    case NEXT_SLIDE:
        if (state.index >= state.size - 1) {
            return state;
        }
        return {
            ...state,
            index: state.index + 1,
        };
    case PREVIOUS_SLIDE:
        if (state.index <= 0) {
            return state;
        }
        return {
            ...state,
            index: state.index - 1,
        };
    case TOGGLE_FULLSCREEN:
        return {
            ...state,
            isFullscreen: !state.isFullscreen,
        };
    case LOAD_GAME:
        return {
            ...state,
            size: action.gameSpec ? action.gameSpec.slides.length : 0,
            enabled: action.gameId !== null,
            gameId: action.gameId,
            gameSpec: action.gameSpec,
        };
    default:
        return state;
    }
}

export function nextSlide() {
    return {
        type: NEXT_SLIDE,
    };
}

export function previousSlide() {
    return {
        type: PREVIOUS_SLIDE,
    };
}

export function toggleFullscreen() {
    return {
        type: TOGGLE_FULLSCREEN,
    };
}

export const eduLayerInitialState = initialState;

export function loadGame(gameId, gameSpec) {
    return {
        type: LOAD_GAME,
        gameId,
        gameSpec,
    };
}
