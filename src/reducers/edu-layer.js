const INIT_SLIDES = 'scratch-gui/edu-layer/INIT_SLIDES'
const NEXT_SLIDE = 'scratch-gui/edu-layer/NEXT_SLIDE'
const PREVIOUS_SLIDE = 'scratch-gui/edu-layer/PREVIOUS_SLIDE'
const TOGGLE_FULLSCREEN = 'scratch-gui/edu-layer/TOGGLE_FULLSCREEN'

const initialState = {
    size: 0,
    index: 0,
    isFullscreen: false,
};

export default function (state = initialState, action) {
    switch(action.type) {
    case INIT_SLIDES:
        return {
            ...state,
            size: action.size,
            index: 0,
        };
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
        }
    default: 
        return state
    }
};

export function initSlides (size) {
    return {
        type: INIT_SLIDES,
        size
    }
} 

export function nextSlide () {
    return {
        type: NEXT_SLIDE,
    }
}

export function previousSlide () {
    return {
        type: PREVIOUS_SLIDE,
    }
}

export function toggleFullscreen () {
    return {
        type: TOGGLE_FULLSCREEN,
    }
}

export const eduLayerInitialState = initialState;