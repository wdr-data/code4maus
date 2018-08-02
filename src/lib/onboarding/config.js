import { push } from 'redux-little-router';

export const NEXT_STEP = 'onboarding/NEXT_STEP';

export const BUTTON_TEXTS = {
    start: "Los geht's",
    next: "Weiter",
};

export const TRIGGER_REFS = {
    startButton: 'startButton',
    stopButton: 'stopButton',
    blocksToolbox: 'blocksToolbox',
    saveProject: 'saveProject',
    menu: 'menu',
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
            text: 'Willkommen zu Programmieren mit der Maus.\nDie Welt wird digitaler. Programmieren ist in dieser Welt eine Grundfertigkeit, um selbst aktiv werden, mitgestalten und auch Kritik üben zu können. Mit dieser Anwendung programmieren Kinder Schritt für Schritt erste eigene Bildergeschichten und kleine Spiele. Dabei lernen sie Variablen, Schleifen und Verzweigungen kennen.',
            buttons: [
                {
                    text: BUTTON_TEXTS.start,
                    action: NEXT_STEP,
                },
            ],
            dim: true,
            loadProject: 'edu/00',
        },
        {
            text: 'Hallo, hier lernst du Schritt für Schritt, wie du Spiele programmierst.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
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
            timeout: 2000,
        },
        {
            text: 'Falls das Programm nicht von selbst stoppt, kannst du es mit dem roten Knopf wieder anhalten.',
            arrowTo: TRIGGER_REFS.stopButton,
            trigger: TRIGGER_REFS.stopButton,
            loadProject: 'edu/00',
        },
        {
            text: 'Gut gemacht.\nJetzt lernst du, wie du bestimmst, was die Maus macht.\nMan nennt das programmieren.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: emo1,
            loadProject: 0,
        },
        {
            text: 'Hier findest du Blöcke.\nJeder Block sagt der Maus eine Sache, die sie tun soll.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Um dein erstes Programm zu schreiben, ziehe den Block "drehe dich nach rechts um 15 Grad" rüber in die Mitte.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: block1,
        },
        {
            text: 'Wenn du auf den Block drückst, macht die Maus das, was draufsteht.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Zieh den zweiten Block "gleite in 1 Sekude zu Zufallsposition" dazu. Die Blöcke kleben aneinander - wie Magnete.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: block2,
        },
        {
            text: 'Wenn etwas nicht richtig ist, kannst du die Blöcke nach unten wieder auseinander ziehen. Probier das mal aus. Zieh die Blöcke dann wieder zusammen.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: block3,
        },
        {
            text: 'Setze den Block "Wiederhole 10 mal" wie eine Klammer um die anderen herum, damit die Maus sich 10 mal dreht und gleitet.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: block4,
        },
        {
            text: 'Jetzt setze noch den Block "Wenn die grüne Fahne angeklickt wird" an den Anfang.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: block5,
        },
        {
            text: 'Dein erstes Programm ist fertig. Drücke auf den grünen Knopf und sieh Dir an, was die Maus macht.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: play,
        },
        {
            text: 'Jetzt kommen die weißen Stellen in den Blöcken ins Spiel. Klick in die weiße Stelle und ändere die Zahl.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: code1,
        },
        {
            text: 'Mit dem grünen Knopf noch mal starten.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: play,
        },
        {
            text: 'Hast du’s gemerkt? Die Maus wird langsamer. Gib jetzt zum Beispiel mal 0.5 ein, damit sie schneller wird.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: play,
        },
        {
            text: 'Super! Probiere gerne noch etwas herum. Wenn du fertig bist, klicke weiter.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
            image: emo1,
        },
        {
            text: 'Wenn du deine Änderungen behalten möchtest, drücke auf Speichern, gib deinem Programm einen Namen und drück dann auf den Speichern-Knopf.',
            arrowTo: TRIGGER_REFS.saveProject,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Top! Nun weißt du das Wichtigste. Ab jetzt bekommst du immer hier im Fenster Tipps und Aufgaben.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Im Fenster wird gezeigt, was du machen sollst. Wenn du das geschafft hast, klicke auf "Weiter".',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
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
