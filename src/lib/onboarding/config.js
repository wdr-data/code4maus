export const NEXT_STEP = 'onboarding/NEXT_STEP';

export const BUTTON_TEXTS = {
    next: 'Weiter',
};

export const TRIGGER_REFS = {
    startButton: 'startButton',
    stopButton: 'stopButton',
    blocksToolbox: 'blocksToolbox',
};

export const customOffsets = {
    blocksToolbox: {
        x: 100,
        y: -150,
    },
};

const onboardingConfig = {
    steps: [
        {
            text: 'Hallo, hier lernst du Schritt für Schritt, wie du Spiele programmierst.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            dim: true,
        },
        {
            text: 'Mit dem grünen Knopf wird ein Programm gestartet.',
            arrowTo: TRIGGER_REFS.startButton,
            trigger: TRIGGER_REFS.startButton,
        },
        {
            text: 'Mit dem roten Knopf stoppst Du das Programm wieder.',
            arrowTo: TRIGGER_REFS.stopButton,
            trigger: TRIGGER_REFS.stopButton,
        },
        {
            text: '👍 Gut gemacht.\nJetzt lernst Du, wie Du bestimmst, was die Maus macht. Man nennt das programmieren.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Hier findest Du Blöcke.\nJeder Block sagt der Maus eine Sache, die sie tun soll.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
    ],
};

export default onboardingConfig;
