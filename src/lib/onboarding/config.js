import { push } from 'redux-little-router';

export const NEXT_STEP = 'onboarding/NEXT_STEP';

export const BUTTON_TEXTS = {
    start: "Los geht's",
    next: 'Weiter',
};

export const TRIGGER_REFS = {
    startButton: 'startButton',
    stopButton: 'stopButton',
    blocksToolbox: 'blocksToolbox',
    saveProject: 'saveProject',
    menu: 'menu',
};

const BUTTON_NEXT = {
    text: BUTTON_TEXTS.next,
    action: NEXT_STEP,
};

export const customBlocks = [
    {
        'category': 'motion',
        'blocks': [
            'turnright',
            'turnleft',
            '--',
            'glideto',
        ],
    },
    {
        'category': 'events',
        'blocks': [ 'whenflagclicked' ],
    },
    {
        'category': 'control',
        'blocks': [ 'repeat' ],
    },
];

export const customOffsets = {
    blocksToolbox: {
        x: 100,
        y: -150,
    },
};

const onboardingConfig = {
    steps: [
        {
            text: 'Hallo,\nhier lernst du Schritt für Schritt, wie du Spiele programmierst.',
            buttons: [ BUTTON_NEXT ],
            dim: true,
            loadProject: 'edu/00',
        },
        {
            text: 'Mit dem grünen Knopf wird ein Programm gestartet.',
            arrowTo: TRIGGER_REFS.startButton,
            trigger: TRIGGER_REFS.startButton,
            loadProject: 'edu/00',
        },
        {
            text: 'Falls das Programm nicht von selbst stoppt, kannst du es mit dem roten Knopf wieder anhalten.',
            arrowTo: TRIGGER_REFS.stopButton,
            buttons: [ BUTTON_NEXT ],
            loadProject: 'edu/00',
        },
        {
            text: 'Gut gemacht.\nJetzt lernst du, wie DU bestimmst, was die Maus macht.\nMan nennt das Programmieren.',
            buttons: [ BUTTON_NEXT ],
            loadProject: 'edu/01',
        },
        {
            text: 'Ab jetzt steht hier im Fenster, was Du als nächstes machen sollst. Wenn du das geschafft hast, klicke auf "Weiter".',
            buttons: [ BUTTON_NEXT ],
            loadProject: 'edu/01',
            arrowTo: TRIGGER_REFS.stopButton,
            buttons: [
                {
                    text: 'Weiter Lernen',
                    action: () => push(`/lernspiel/01`),
                },
            ],
        },
    ],
};

export default onboardingConfig;
