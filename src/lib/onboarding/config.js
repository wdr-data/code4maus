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

import block1 from '../edu/00/assets/block1.gif';
import block2 from '../edu/00/assets/block2.gif';
import block3 from '../edu/00/assets/block3.gif';
import block4 from '../edu/00/assets/block4.gif';
import block5 from '../edu/00/assets/block5.gif';
import emo1 from '../edu/00/assets/emo1.svg';
import code1 from '../edu/00/assets/code1.gif';
import play from '../edu/00/assets/play.png';

const onboardingConfig = {
    steps: [
        {
            text: 'Hallo, hier lernst du Schritt für Schritt, wie du Spiele programmierst.',
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
            text: 'Gut gemacht.\nJetzt lernst du, wie du bestimmst, was die Maus macht.\nMan nennt das programmieren.',
            buttons: [ BUTTON_NEXT ],
            image: emo1,
            loadProject: 0,
        },
        {
            text: 'Hier findest du Blöcke.\nJeder Block sagt der Maus eine Sache, die sie tun soll.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [ BUTTON_NEXT ],
        },
        {
            text: 'Um dein erstes Programm zu schreiben, ziehe den Block "drehe dich nach rechts um 15 Grad" rüber in die Mitte.',
            buttons: [ BUTTON_NEXT ],
            image: block1,
        },
        {
            text: 'Wenn du auf den Block drückst, macht die Maus das, was draufsteht.',
            buttons: [ BUTTON_NEXT ],
        },
        {
            text: 'Zieh den zweiten Block "gleite in 1 Sekude zu Zufallsposition" dazu. Die Blöcke kleben aneinander - wie Magnete.',
            buttons: [ BUTTON_NEXT ],
            image: block2,
        },
        {
            text: 'Wenn etwas nicht richtig ist, kannst du die Blöcke nach unten wieder auseinander ziehen. Probier das mal aus. Zieh die Blöcke dann wieder zusammen.',
            buttons: [ BUTTON_NEXT ],
            image: block3,
        },
        {
            text: 'Setze den Block "Wiederhole 10 mal" wie eine Klammer um die anderen herum, damit die Maus sich 10 mal dreht und gleitet.',
            buttons: [ BUTTON_NEXT ],
            image: block4,
        },
        {
            text: 'Jetzt setze noch den Block "Wenn die grüne Fahne angeklickt wird" an den Anfang.',
            buttons: [ BUTTON_NEXT ],
            image: block5,
        },
        {
            text: 'Dein erstes Programm ist fertig. Drücke auf den grünen Knopf und sieh Dir an, was die Maus macht.',
            buttons: [ BUTTON_NEXT ],
            image: play,
        },
        {
            text: 'Jetzt kommen die weißen Stellen in den Blöcken ins Spiel. Klick in die weiße Stelle und ändere die Zahl.',
            buttons: [ BUTTON_NEXT ],
            image: code1,
        },
        {
            text: 'Mit dem grünen Knopf noch mal starten.',
            buttons: [ BUTTON_NEXT ],
            image: play,
        },
        {
            text: 'Hast du’s gemerkt? Die Maus wird langsamer. Gib jetzt zum Beispiel mal 0.5 ein, damit sie schneller wird.',
            buttons: [ BUTTON_NEXT ],
            image: play,
        },
        {
            text: 'Super! Probiere gerne noch etwas herum. Wenn du fertig bist, klicke weiter.',
            buttons: [ BUTTON_NEXT ],
            image: emo1,
        },
        {
            text: 'Wenn du deine Änderungen behalten möchtest, drücke auf Speichern, gib deinem Programm einen Namen und drück dann auf den Speichern-Knopf.',
            arrowTo: TRIGGER_REFS.saveProject,
            buttons: [ BUTTON_NEXT ],
        },
        {
            text: 'Top! Nun weißt du das Wichtigste. Ab jetzt bekommst du immer hier im Fenster Tipps und Aufgaben.',
            buttons: [ BUTTON_NEXT ],
        },
        {
            text: 'Im Fenster wird gezeigt, was du machen sollst. Wenn du das geschafft hast, klicke auf "Weiter".',
            buttons: [ BUTTON_NEXT ],
        },
        {
            text: 'Unter Übersicht siehst du wie weit du schon gekommen bist. Dort findest du auch deine Spiele, die du mit einem Namen abgespeichert hast.',
            arrowTo: TRIGGER_REFS.menu,
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
