import a02 from '../shared_assets/variablen_hand.jpg'
import astart from '../shared_assets/start.jpg'
import asteuerung from '../shared_assets/steuerung.jpg'
import aoperatoren from '../shared_assets/operatoren.jpg'
import agut_gemacht from '../shared_assets/gut_gemacht.jpg'
import aherz from '../shared_assets/herz.jpg'
import aStern from '../shared_assets/super.jpg'
import aStadtLandEnte from './assets/StadtLandEnte.png'
import a12 from './assets/12.jpg'
import b02 from './assets/02.jpg'
import a03_1 from './assets/03_1.jpg'
import a03_02 from './assets/03_02.jpg'
import a03 from './assets/03.jpg'
import a05 from './assets/05.jpg'
import ax03 from './assets/x03.jpg'
import a08 from './assets/08.jpg'
import a09 from './assets/09.jpg'
import a10 from './assets/10.jpg'
import a11 from './assets/11.jpg'
import axx2 from './assets/xx2.jpg'
import aspannung from './assets/spannung.jpg'
import axx1 from './assets/xx1.jpg'
import a16 from './assets/16.jpg'
import a14 from './assets/14.jpg'
import aXX3 from './assets/XX3.jpg'
import aXX4 from './assets/XX4.jpg'
import a18 from './assets/18.jpg'
import a19 from './assets/19.jpg'
import ak1 from './assets/k1.jpg'
import ac from './assets/c.jpg'
import a20_2 from './assets/20_2.png'
import a21 from './assets/21.jpg'
import ak3 from './assets/k3.jpg'
import a23 from './assets/23.jpg'
import a24 from './assets/24.jpg'
import a25 from './assets/25.jpg'
import a26 from './assets/26.jpg'
import a27 from './assets/27.jpg'
import a28 from './assets/28.jpg'
import a29 from './assets/29.jpg'
import a30 from './assets/30.jpg'
import a31 from './assets/31.jpg'
import a32 from './assets/32.jpg'
import a33_1 from './assets/33_1.jpg'
import a33_2 from './assets/33_2.jpg'
import aq1 from './assets/q1.mp4'
import a36 from './assets/36.jpg'
import a37 from './assets/37.jpg'
import a38 from './assets/38.jpg'
import a39 from './assets/39.jpg'

export default {
  id: '08',
  name: 'Stadt-Land-Ente',
  subtitle: '09 Wort-Spiel',
  image: aStadtLandEnte,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: aStadtLandEnte,
    },
    {
      asset: a12,
      caption: 'Programmiere ein Stadt-Land-Fluss-Spiel.',
    },
    {
      asset: a02,
      caption: "Klicke auf 'Variablen'",
    },
    {
      asset: b02,
      caption: "Erstelle eine neue Liste, nenne sie 'Wörter'",
    },
    {
      asset: a03_1,
      caption: 'Schreibe ein Programm für die Abfrage:',
    },
    {
      asset: a03_02,
      caption: 'Verlängere dein Programm: ',
    },
    {
      asset: a03,
      caption: "Füge 'Antwort' hinzu",
    },
    {
      asset: a05,
      caption: 'Ändere den Frage-Text',
    },
    {
      asset: astart,
      caption: 'Teste dein Spiel',
    },
    {
      asset: ax03,
      caption: "Noch sind Wörter ohne 'E' und Doppelte möglich.",
    },
    {
      asset: asteuerung,
      caption: "Klicke auf 'Steuerung'",
    },
    {
      asset: a08,
      caption: 'Nutze falls-dann für den Test auf Doppelte:',
    },
    {
      asset: aoperatoren,
      caption: "Klicke auf 'Operatoren'",
    },
    {
      asset: a09,
      caption: "Füge Operator 'nicht' ein",
    },
    {
      asset: a10,
      caption: 'Nicht hinzufügen, wenn ...',
    },
    {
      asset: a11,
      caption: "... 'Antwort' nicht in 'Wörter' ist",
    },
    {
      asset: axx2,
      caption: 'Beim Start soll die Liste leer sein',
    },
    {
      asset: astart,
      caption: 'Teste noch mal',
    },
    {
      asset: a12,
      caption: 'Keine Doppelten mehr möglich',
    },
    {
      asset: agut_gemacht,
    },
    {
      asset: aspannung,
      caption: 'Damit das Spiel spannender wird, füge einen Countdown dazu...',
    },
    {
      asset: axx1,
      caption: "Klicke auf 'neue Variable', nenne sie 'Zeit'",
    },
    {
      asset: a16,
      caption: 'Schreibe das Zeit-Programm',
    },
    {
      asset: a14,
      caption: "Setze 'Zeit' auf 30",
    },
    {
      asset: aXX3,
      caption: 'Wiederhole bis ...',
    },
    {
      asset: aXX4,
      caption: "Füge den '=' Operator hinzu",
    },
    {
      asset: a02,
      caption: 'Klicke auf Variablen',
    },
    {
      asset: a18,
      caption: 'Ziehe "Zeit" rein und ändere zu "= 0"',
    },
    {
      asset: a19,
      caption: 'Pro Sekunde wird die Rest-Zeit weniger',
    },
    {
      asset: ak1,
      caption: "Klicke auf 'Ereignisse'",
    },
    {
      asset: ac,
      caption: "Wenn die Zeit vorbei ist: 'sende Nachricht'",
    },
    {
      asset: a20_2,
      caption: "Füge den Ton 'Boing' hinzu",
    },
    {
      asset: a21,
      caption: "'Boing' wird gespielt, wenn die Zeit um ist",
    },
    {
      asset: astart,
      caption: 'Teste und schau auf die Zeit',
    },
    {
      asset: aherz,
      caption: 'Klasse!',
    },
    {
      asset: ak3,
      caption: 'Am Ende soll gezeigt werden, wie viele Wörter gefunden wurden.',
    },
    {
      asset: a23,
      caption: "Mache noch ein 'Wenn'-Programm",
    },
    {
      asset: a02,
      caption: "Klicke auf 'Variablen'",
    },
    {
      asset: a24,
      caption: "'Länge von' zählt die Wörter",
    },
    {
      asset: astart,
      caption: 'Teste noch mal',
    },
    {
      asset: ak3,
      caption: 'Schöner wäre ein Satz, nicht nur die Zahl',
    },
    {
      asset: aoperatoren,
      caption: "Klicke auf 'Operatoren'",
    },
    {
      asset: a25,
      caption: "Ziehe 'Verbinde' rein",
    },
    {
      asset: a26,
      caption: 'Gib den Text ein',
    },
    {
      asset: a27,
      caption: 'So sieht das komplett aus:',
    },
    {
      asset: astart,
      caption: 'Teste noch mal',
    },
    {
      asset: aherz,
      caption:
        "Gut! Jetzt änderst Du, dass ein zufälliger Buchstabe statt 'E' gefragt wird.",
    },
    {
      asset: a02,
      caption: "Klicke auf 'Variablen'",
    },
    {
      asset: a28,
      caption: "Drücke auf 'Neue Variable', nenne sie 'A-Z'",
    },
    {
      asset: a29,
      caption: "Füge 'A-Z' im ersten Programm hinzu",
    },
    {
      asset: aoperatoren,
      caption: "Klicke auf 'Operatoren'",
    },
    {
      asset: a30,
      caption: "Ziehe 'Zeichen von' rein",
    },
    {
      asset: a31,
      caption: "Ziehe 'Zufallszahl' dazu",
    },
    {
      asset: a32,
      caption: 'Gib alle Zeichen von A-Z ein und ändere die Zahl',
    },
    {
      asset: astart,
      caption: 'Fast fertig.',
    },
    {
      asset: a12,
      caption: 'Passe noch dein Abfrage-Programm an',
    },
    {
      asset: a33_1,
      caption: "Ziehe 'verbinde' in 'frage':",
    },
    {
      asset: a33_2,
      caption: "Ändere und ziehe 'A-Z' rein",
    },
    {
      asset: astart,
      caption: 'Teste die Abfrage',
    },
    {
      asset: aStern,
      caption:
        'Top. Jetzt noch testen, ob die Wörter mit dem richtigen Buchstaben anfangen.',
    },
    {
      asset: aq1,
      caption: "Baue um zum 'und'-Operator:",
    },
    {
      asset: a36,
      caption: 'Du prüfst auf Doppelte und ...',
    },
    {
      asset: a37,
      caption: "Nutze den '='-Operator",
    },
    {
      asset: a38,
      caption: "Und den 'Zeichen von'-Operator",
    },
    {
      asset: a39,
      caption: 'Ziehe Antwort und A-Z rein',
    },
    {
      asset: astart,
      caption:
        'Jetzt kommen nur Wörter mit dem richtigen Anfangsbuchstaben in die Liste.',
    },
    {
      asset: agut_gemacht,
      caption: 'Geschafft, viel Spaß mit Stadt-Land-Ente!',
    },
  ],
  blocks: [
    {
      category: 'motion',
      blocks: [
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
      category: 'looks',
      blocks: [
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
      category: 'sound',
      blocks: ['playuntildone'],
    },
    {
      category: 'events',
      blocks: [
        'whenflagclicked',
        'whenthisspriteclicked',
        '--',
        'whenbroadcastreceived',
        'broadcast',
        'broadcastandwait',
      ],
    },
    {
      category: 'control',
      blocks: [
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
      category: 'sensing',
      blocks: [
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
      category: 'operators',
      blocks: [
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
      category: 'variables',
    },
  ],
}
