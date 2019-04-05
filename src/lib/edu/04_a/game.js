import aStadtLandEnte from './assets/StadtLandEnte.png';
import a12 from './assets/12.png';
import avariablen_hand from '../shared_assets/variablen_hand.png';
import a02 from './assets/02.png';
import a03_1 from './assets/03_1.png';
import a03_02 from './assets/03_02.png';
import a01 from './assets/01.gif';
import a05 from './assets/05.png';
import axx2 from './assets/xx2.png';
import astart from '../shared_assets/start.png';
import aherz from '../shared_assets/herz.png';
import a28 from './assets/28.png';
import a29 from './assets/29.png';
import aoperatoren from '../shared_assets/y_05.png';
import a30 from './assets/30.png';
import a31 from './assets/31.png';
import a32 from './assets/32.png';
import a33_1 from './assets/33_1.png';
import a33_2 from './assets/33_2.png';
import agut_gemacht from '../shared_assets/gut_gemacht.png';

export default {
    id: '04_a',
    name: 'Stadt-Land-Ente',
    subtitle: 'Listen & Abfrage',
    image: aStadtLandEnte,
    hidden: true,
    'slides': [
        {
            'asset': aStadtLandEnte,
        },
        {
            'asset': a12,
            'caption': 'Programmiere ein Stadt-Land-Fluss-Spiel.',
        },
        {
            'asset': avariablen_hand,
            'caption': "Klicke auf 'Variablen'",
        },
        {
            'asset': a02,
            'caption': "Erstelle eine neue Liste, nenne sie 'Wörter'",
        },
        {
            'asset': a03_1,
            'caption': 'Schreibe ein Programm für die Abfrage:',
        },
        {
            'asset': a03_02,
            'caption': 'Verlängere dein Programm: ',
        },
        {
            'asset': a01,
            'caption': "Füge 'Antwort' hinzu",
        },
        {
            'asset': a05,
            'caption': 'Ändere den Frage-Text',
        },
        {
            'asset': axx2,
            'caption': "Füge 'lösche alles aus' hinzu",
        },
        {
            'asset': astart,
            'caption': 'Teste dein Spiel',
        },
        {
            'asset': aherz,
            'caption': "Gut! Jetzt änderst Du, dass ein zufälliger Buchstabe statt 'E' gefragt wird.",
        },
        {
            'asset': avariablen_hand,
            'caption': "Klicke auf 'Variablen'",
        },
        {
            'asset': a28,
            'caption': "Drücke auf 'Neue Variable', nenne sie 'A-Z'",
        },
        {
            'asset': a29,
            'caption': "Füge 'setze A-Z' hinzu",
        },
        {
            'asset': aoperatoren,
            'caption': "Klicke auf 'Operatoren'",
        },
        {
            'asset': a30,
            'caption': "Ziehe 'Zeichen von' rein",
        },
        {
            'asset': a31,
            'caption': "Ziehe 'Zufallszahl' dazu",
        },
        {
            'asset': a32,
            'caption': 'Gib alle Zeichen von A-Z ein und ändere die Zahl',
        },
        {
            'asset': astart,
            'caption': 'Fast fertig.',
        },
        {
            'asset': a33_1,
            'caption': "Ziehe 'verbinde' in 'frage':",
        },
        {
            'asset': a33_2,
            'caption': "Ersetze und ziehe 'A-Z' rein:",
        },
        {
            'asset': astart,
            'caption': 'Teste die Frage',
        },
        {
            'asset': agut_gemacht,
            'caption': 'Geschafft, viel Spaß mit Stadt-Land-Ente!',
        },
    ],
    'nextGame': '05',
    'blocks': [
        {
            'category': 'motion',
            'blocks': [
                'movesteps',
                'turnright',
                'turnleft',
                '--',
                'goto',
                'gotoxy',
                'glideto',
                'glidesecstoxy',
                '--',
                'changexby',
                'setx',
                'changeyby',
                'sety',
            ],
        },
        {
            'category': 'looks',
            'blocks': [
                'sayforsecs',
                'say',
                'thinkforsecs',
                'think',
                'switchcostumeto',
                'nextcostume',
                '--',
                'changesizeby',
                'setsizeto',
                '--',
                'show',
                'hide',
                '--',
                'size',
            ],
        },
        {
            'category': 'sound',
            'blocks': ['playuntildone'],
        },
        {
            'category': 'events',
            'blocks': [
                'whenflagclicked',
                'whenthisspriteclicked',
                '--',
                'whenbroadcastreceived',
                'broadcast',
                'broadcastandwait',
            ],
        },
        {
            'category': 'control',
            'blocks': [
                'wait',
                'repeat',
                'forever',
                '--',
                'if',
                'if_else',
                'wait_until',
                'repeat_until',
                '--',
                'stop',
                '--',
                'start_as_clone',
                'create_clone_of',
                'delete_this_clone',
            ],
        },
        {
            'category': 'sensing',
            'blocks': [
                'touchingobject',
                'askandwait',
                'answer',
                '--',
                'mousedown',
                'mousex',
                'mousey',
                'setdragmode',
                '--',
                'timer',
                'resettimer',
                '--',
                'of',
                '--',
                'current',
            ],
        },
        {
            'category': 'operators',
            'blocks': [
                'random',
                '--',
                'gt',
                'lt',
                'equals',
                '--',
                'and',
                'or',
                'not',
                'join',
                'letter_of',
            ],
        },
        {
            'category': 'variables',
        },
    ],
};
