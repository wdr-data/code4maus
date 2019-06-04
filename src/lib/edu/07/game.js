import a00 from './assets/00.jpg';
import a001 from './assets/001.jpg';
import a1 from './assets/1.jpg';
import a2 from './assets/2.mp4';
import a3 from './assets/3.mp4';
import a3_1 from './assets/3.1.mp4';
import a5_1 from './assets/5.1.jpg';
import a5_2 from './assets/5.2.jpg';
import a6_1 from './assets/6.1.jpg';
import a4_1 from './assets/4.1.mp4';
import a6_2 from './assets/6.2.jpg';
import a6_4 from './assets/6.4.jpg';
import a6_5 from './assets/6.5.jpg';
import a6_6 from './assets/6.6.jpg';
import a7 from './assets/7.jpg';
import a9_1 from './assets/9.1.jpg';
import a10_1 from './assets/10.1.mp4';
import a10_2 from './assets/10.2.mp4';
import a10_3 from './assets/10.3.mp4';
import a11 from './assets/11.mp4';
import a12 from './assets/12.jpg';
import a13 from './assets/13.jpg';
import a14 from './assets/14.jpg';
import a15_1 from './assets/15.1.mp4';
import a15_2 from './assets/15.2.jpg';
import a16 from './assets/16.jpg';
import a15_3 from './assets/15.3.mp4';
import a17_1 from './assets/17.1.mp4';
import a17_2 from './assets/17.2.jpg';
import a19 from './assets/19.jpg';
import a20 from './assets/20.jpg';
import a17 from './assets/17.mp4';

export default {
    id: '07',
    hidden: true,
    fetchProject: () => import('./project.json'),
    'slides': [
        {
            'caption': 'Tiere raten',
        },
        {
            'asset': a00,
            'caption': 'Ein Kind denkt sich 3 Tiere aus...',
        },
        {
            'asset': a001,
            'caption': '... und ein zweites muss sie erraten.',
        },
        {
            'asset': a1,
            'caption': 'Klickt auf Variablen.',
        },
        {
            'asset': a1,
            'caption': "Erstellt zwei neue Listen. Nennt sie 'Wörter'...",
        },
        {
            'asset': a2,
            'caption': "und 'Geraten'.",
        },
        {
            'asset': a3,
            'caption': "Fügt eine neue Variable hinzu. Nennt sie 'A-Z'.",
        },
        {
            'asset': a2,
            'caption': 'Baut diesen Block.',
        },
        {
            'asset': a3,
            'caption': 'Klickt auf Operatoren.',
        },
        {
            'asset': a3_1,
            'caption': "Ändert 'meine Variable zu 'A-Z' und fügt den Block 'Zwischen ... und ...' hinzu'.",
        },
        {
            'asset': a5_1,
            'caption': 'Diese Buchstaben können vorkommen.',
        },
        {
            'asset': a5_2,
            'caption': 'Der Buchstabe wird zufällig ausgewählt, ändert die Zahl 10 zu 6.',
        },
        {
            'asset': a6_1,
            'caption': 'Wiederholt bis...',
        },
        {
            'asset': a4_1,
            'caption': '... die Liste der Wörter gleich 3 ist.',
        },
        {
            'asset': a6_2,
            'caption': "Bei 'Fühlen': 'Frage ... und warte'",
        },
        {
            'asset': a6_4,
            'caption': "Verbindt 'Ein Tier mit ' und die Variable 'A-Z'.",
        },
        {
            'asset': a6_5,
            'caption': "Fügt 'Ding' zu 'Geraten' hinzu.",
        },
        {
            'asset': a6_6,
            'caption': "Ersetzt 'Ding' durch 'Antwort'.",
        },
        {
            'caption': 'Probiert mal!',
        },
        {
            'asset': a7,
            'caption': 'Baut ein zweites Programm,',
        },
        {
            'asset': a9_1,
            'caption': '... damit das zweite Kind raten kann.',
        },
        {
            'asset': a10_1,
            'caption': 'So soll die Frage aussehen.',
        },
        {
            'asset': a10_2,
            'caption': "Für die Antwort: Zieht 'Enthält' rein.",
        },
        {
            'asset': a10_3,
            'caption': "Und 'Antwort' aus der Kategorie 'Fühlen'",
        },
        {
            'asset': a11,
            'caption': 'Wurde richtig geraten? Wenn ja:',
        },
        {
            'asset': a12,
            'caption': "Die Antwort wird in die 'Geraten' Liste geschrieben.",
        },
        {
            'asset': a13,
            'caption': 'Wenn die Antwort falsch ist:',
        },
        {
            'asset': a14,
            'caption': 'Testet euer Programm.',
        },
        {
            'caption': 'Man kann nur einmal raten!',
        },
        {
            'asset': a15_1,
            'caption': "Benutzt 'Wiederhole bis'",
        },
        {
            'asset': a15_2,
            'caption': "Zieht den 'x = 100' Operator rein.",
        },
        {
            'asset': a16,
            'caption': "Zieht 2 mal 'Länge von' dazu.",
        },
        {
            'asset': a15_3,
            'caption': 'So werden die Listen verglichen.',
        },
        {
            'asset': a17_1,
            'caption': "Zieht 'sage' ganz nach unten.",
        },
        {
            'asset': a17_2,
            'caption': 'Ändert den Text.',
        },
        {
            'asset': a19,
            'caption': "Zieht 'zeige' und 'verstecke' in euer Programm.",
        },
        {
            'asset': a20,
            'caption': "Zieht 2 mal 'lösche alles' rein.",
        },
        {
            'caption': 'So könnt ihr immer wieder spielen.',
        },
        {
            'asset': a16,
            'caption': 'Spieler 1 klickt auf > und schreibt 3 Tiere in die Liste.',
        },
        {
            'asset': a17,
            'caption': 'Spieler 2 klickt auf die Ente und muss raten.',
        },
        {
            'caption': 'Viel Spaß beim Spielen!',
        },
    ],
};
