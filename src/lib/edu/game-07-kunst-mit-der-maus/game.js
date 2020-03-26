import astart from '../shared_assets/start.jpg'
import astop from '../shared_assets/stop.jpg'
import asteuerung from '../shared_assets/steuerung.jpg'
import aL007 from './assets/L007.jpg'
import az08 from './assets/z08.jpg'
import az01 from './assets/z01.jpg'
import az02 from './assets/z02.jpg'
import az03 from './assets/z03.png'
import az05 from './assets/z05.png'
import az06 from './assets/z06.png'
import av01 from './assets/v01.jpg'

export default {
  id: '04_c',
  name: '#Mausprobiert',
  subtitle: '07 Kunst mit der Maus',
  image: aL007,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: aL007,
      caption: 'Kunst mit Maus und Code',
    },
    {
      asset: astart,
      caption: 'Drücke zum Testen',
    },
    {
      asset: astop,
      caption: 'Zum Stoppen',
    },
    {
      asset: asteuerung,
      caption: 'Klicke auf Steuerung',
    },
    {
      asset: az08,
      caption: 'Füge ein drittes Programm hinzu',
    },
    {
      asset: az01,
      caption: "Dazu 'für immer' und 'gehe'",
    },
    {
      asset: az02,
      caption: 'Ändere Schritte zu 1',
    },
    {
      asset: astart,
      caption: 'Was passiert?',
    },
    {
      asset: az03,
      caption: "Ziehe 'ändere Effekt' dazu",
    },
    {
      asset: astart,
      caption: "Wie sieht's aus?",
    },
    {
      asset: az05,
      caption: 'Spiele mit den Effekten...',
    },
    {
      asset: az06,
      caption: 'Ändere die Größe...',
    },
    {
      asset: av01,
      caption: "Elefant, Ente? Klicke links auf 'nächstes Kostüm'",
    },
  ],
  nextGame: '05',
  blocks: [
    {
      category: 'motion',
      blocks: ['turnright', 'turnleft', 'movesteps', 'gotoxy'],
    },
    {
      category: 'looks',
      blocks: [
        'setsizeto',
        'nextcostume',
        'changeeffectby',
        'changesizeby',
        'seteffectto',
        'cleargraphiceffects',
        'show',
        'hide',
      ],
    },
    {
      category: 'events',
      blocks: ['whenflagclicked'],
    },
    {
      category: 'control',
      blocks: [
        'forever',
        'wait',
        'if',
        'create_clone_of',
        'start_as_clone',
        'delete_this_clone',
      ],
    },
    {
      category: 'sensing',
      blocks: ['touchingobject'],
    },
  ],
}
