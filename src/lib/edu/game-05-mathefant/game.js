import astart from '../shared_assets/start.jpg'
import asteuerung from '../shared_assets/steuerung.jpg'
import aherz from '../shared_assets/herz.jpg'
import ablitz from '../shared_assets/blitz.svg'
import aMathefant from './assets/Mathefant.png'
import a01 from './assets/01.jpg'
import b01 from './assets/01.mp4'
import ap1 from './assets/p1.jpg'
import avariablen_hand from './assets/variablen_hand.jpg'
import av1 from './assets/v1.mp4'
import ax03 from './assets/x03.jpg'
import a02 from './assets/02.mp4'
import ax05 from './assets/x05.jpg'
import ay_01 from './assets/y_01.jpg'
import ax01_1 from './assets/x01_1.jpg'
import ax01_2 from './assets/x01_2.jpg'
import a03 from './assets/03.mp4'
import ay_02 from './assets/y_02.jpg'
import a06_2 from './assets/06_2.mp4'
import a07 from './assets/07.jpg'
import av2 from './assets/v2.mp4'
import ay_04 from './assets/y_04.jpg'
import ay_05 from './assets/y_05.jpg'
import ay_06 from './assets/y_06.jpg'
import ay_07 from './assets/y_07.jpg'
import ay_08 from './assets/y_08.jpg'
import ay_09 from './assets/y_09.jpg'
import ay_011 from './assets/y_011.jpg'
import ay_012 from './assets/y_012.jpg'
import a04 from './assets/04.mp4'
import ay_013 from './assets/y_013.jpg'

export default {
  id: '04_b',
  name: 'Mathefant',
  subtitle: '05 Verzweigungen',
  image: aMathefant,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: aMathefant,
    },
    {
      asset: a01,
      caption: 'Programmiere den Elefanten so, dass er Mathe-Aufgaben stellt.',
    },
    {
      asset: ap1,
      caption: 'Beginne ein Programm.',
    },
    {
      asset: avariablen_hand,
      caption: 'Klicke auf Variablen.',
    },
    {
      asset: av1,
      caption:
        "Füge zwei neue Variablen hinzu. Nenne sie 'Zahl 1' und 'Zahl 2'.",
    },
    {
      asset: ax03,
      caption: "Ziehe zwei Mal 'setze auf' rüber:",
    },
    {
      asset: b01,
      caption: "Ändere die 1. Variable zu 'Zahl 1'.",
    },
    {
      asset: a02,
      caption: "Ändere die 2. Variable zu 'Zahl 2'",
    },
    {
      asset: ax05,
      caption: 'Ändere die Zahlenwerte:',
    },
    {
      asset: ay_01,
      caption: "Klicke auf 'Aussehen'.",
    },
    {
      asset: ax01_1,
      caption: "Ziehe vier mal 'denke' dazu:",
    },
    {
      asset: ax01_2,
      caption: 'Ändere Texte und Sekunden so:',
    },
    {
      asset: avariablen_hand,
      caption: 'Klicke auf Variablen.',
    },
    {
      asset: a03,
      caption: "Ziehe 'Zahl 1' und 'Zahl 2' rein:",
    },
    {
      asset: ay_02,
      caption: "Klicke auf 'Fühlen'.",
    },
    {
      asset: a06_2,
      caption: "Ziehe 'frage' ans Ende:",
    },
    {
      asset: a07,
      caption: "Ändere den Text zu '?':",
    },
    {
      asset: astart,
      caption: 'Teste dein Programm:',
    },
    {
      asset: av2,
      caption: 'Das Programm wartet, bis du die Lösung tippst.',
    },
    {
      asset: ablitz,
      caption: 'Aber wie weiß das Programm die Lösung?',
    },
    {
      asset: asteuerung,
      caption: "Klicke auf 'Steuerung'.",
    },
    {
      asset: ay_04,
      caption: "Ziehe 'falls-dann-sonst' unter 'warte':",
    },
    {
      asset: ay_05,
      caption: 'Klicke auf Operatoren.',
    },
    {
      asset: ay_06,
      caption: "Ziehe ' = 100' rein:",
    },
    {
      asset: ay_02,
      caption: "Klicke auf 'Fühlen'.",
    },
    {
      asset: ay_07,
      caption: "Ziehe 'Antwort' rein:",
    },
    {
      asset: ay_08,
      caption: "Ziehe den Operator '+' dazu:",
    },
    {
      asset: avariablen_hand,
      caption: 'Klicke auf Variablen.',
    },
    {
      asset: ay_09,
      caption: 'Ziehe die Zahlen dazu:',
    },
    {
      asset: ay_011,
      caption: 'Wenn die Antwort richtig ist:',
    },
    {
      asset: ay_012,
      caption: 'Wenn die Antwort falsch ist:',
    },
    {
      asset: a04,
      caption: 'Füge “Für immer” ein:',
    },
    {
      asset: astart,
      caption: 'Teste noch einmal:',
    },
    {
      asset: ablitz,
      caption: 'Die Aufgabe bleibt immer gleich.',
    },
    {
      asset: ay_05,
      caption: 'Klicke auf Operatoren.',
    },
    {
      asset: ay_013,
      caption: 'Füge Zufallszahlen ein:',
    },
    {
      asset: astart,
      caption: 'Spiele dein Mathe-Spiel:',
    },
    {
      asset: aherz,
      caption: 'Das hast du super gemacht!',
    },
  ],
  nextGame: '07',
  blocks: [
    {
      category: 'looks',
      blocks: ['thinkforsecs', 'switchcostumeto', 'nextcostume'],
    },
    {
      category: 'events',
      blocks: ['whenflagclicked'],
    },
    {
      category: 'control',
      blocks: ['forever', 'if_else'],
    },
    {
      category: 'sensing',
      blocks: ['askandwait', 'answer'],
    },
    {
      category: 'operators',
      blocks: ['add', 'subtract', 'multiply', 'divide', 'random', 'equals'],
    },
    {
      category: 'variables',
    },
  ],
}
