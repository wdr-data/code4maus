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
            loadProject: 'edu/00',
        },
        {
            text: 'Mit dem grünen Knopf wird ein Programm gestartet.',
            arrowTo: TRIGGER_REFS.startButton,
            trigger: TRIGGER_REFS.startButton,
            loadProject: 'edu/00',
        },
        {
            text: 'Mit dem roten Knopf stoppst du das Programm wieder.',
            arrowTo: TRIGGER_REFS.stopButton,
            trigger: TRIGGER_REFS.stopButton,
            loadProject: 'edu/00',
        },
        {
            text: '👍 Gut gemacht.\nJetzt lernst du, wie du bestimmst, was die Maus macht.\nMan nennt das programmieren.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
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
            text: 'Um dein erstes Programm zu schreiben,\n ziehe einen Block rüber in die Mitte.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Wenn du auf den Block drückst,\nmacht die Maus das, was draufsteht.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Wenn du den zweiten Block zum ersten ziehst,\ndann kleben sie aneinander - wie Magnete.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Wenn etwas nicht richtig ist, kannst du die Blöcke\nnach unten wieder auseinander ziehen.\nProbier das mal aus.\nZieh die Blöcke dann wieder zusammen.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Setze den Block "Für immer" wie eine Klammer um die anderen herum,\n damit die Maus sich immer wieder dreht und gleitet.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Jetzt setze noch den Block\n "Wenn die grüne Fahne angeklickt wird"\n an den Anfang.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: '👍 Dein erstes Programm ist fertig.\nDrücke auf den grünen Knopf\n und sieh Dir an, was die Maus macht.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Jetzt kommen die weißen Stellen in den Blöcken ins Spiel.\nKlick in die weiße Stelle und ändere die Zahl.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Mit dem grünen Knopf noch mal starten.',
            arrowTo: TRIGGER_REFS.startButton,
            trigger: TRIGGER_REFS.startButton,
        },
        {
            text: 'Hast du’s gemerkt? Die Maus wird langsamer. Gib jetzt zum Beispiel mal 0.5 ein, damit sie schneller wird.',
            arrowTo: TRIGGER_REFS.startButton,
            trigger: TRIGGER_REFS.startButton,
        },
        {
            text: 'Super!\nProbiere gerne noch etwas herum.\nWenn du fertig bist, klicke weiter.',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Wenn du deine Änderungen behalten möchtest, drücke auf ‘Speichern’\nund gib deinem Programm einen Namen. ',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Top! Nun weißt du das Wichtigste :) Ab jetzt bekommst du immer hier im Fenster Tipps und Aufgaben.',
            arrowTo: TRIGGER_REFS.blocksToolbox,
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Im Fenster wird gezeigt, was du machen sollst.\nWenn du das geschafft hast,\nklicke auf "Weiter".',
            buttons: [
                {
                    text: BUTTON_TEXTS.next,
                    action: NEXT_STEP,
                },
            ],
        },
        {
            text: 'Im Menü siehst du, wie weit du schon gekommen bist.\nDort findest du auch deine Spiele,\ndie du mit einem Namen abgespeichert hast.\n[weiter lernen]\n[zum Menü]',
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
