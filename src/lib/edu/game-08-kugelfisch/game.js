import astart from '../shared_assets/start.jpg'
import asuper from '../shared_assets/super.jpg'
import aherz from '../shared_assets/herz.jpg'
import aL05 from './assets/L05.png'
import ax11 from './assets/x11.jpg'
import a000 from './assets/000.jpg'
import a001 from './assets/001.jpg'
import a002 from './assets/002.jpg'
import a003 from './assets/003.jpg'
import a05_01 from './assets/05_01.jpg'
import ax01 from './assets/x01.jpg'
import ax02 from './assets/x02.jpg'
import a09 from './assets/09.mp4'
import ax09 from './assets/x09.jpg'
import ax03 from './assets/x03.jpg'
import a004 from './assets/004.jpg'
import a01 from './assets/01.jpg'
import a02 from './assets/02.jpg'
import a03 from './assets/03.jpg'
import a005 from './assets/005.jpg'
import a006 from './assets/006.jpg'
import a007 from './assets/007.jpg'
import a008 from './assets/008.jpg'
import ax10 from './assets/x10.jpg'
import ax05 from './assets/x05.jpg'
import ax06 from './assets/x06.jpg'
import ax07 from './assets/x07.jpg'
import ax08 from './assets/x08.jpg'
import a009 from './assets/009.jpg'
import axx09 from './assets/xx09.jpg'
import aneu from './assets/neu.jpg'
import a04 from './assets/04.jpg'

export default {
  id: '05',
  name: 'Kugelfisch-Spiel',
  subtitle: '08 Dein Spiel',
  image: aL05,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: aL05,
    },
    {
      asset: ax11,
      caption: 'Ziel: Fange mit dem Fisch die Äpfel.',
    },
    {
      asset: a000,
      caption: 'Hintergrund: Unterwasser',
    },
    {
      asset: a001,
      caption: "Füge Figur 'Fisch' hinzu:",
    },
    {
      asset: a002,
      caption: "Noch eine Figur: 'Apfel'",
    },
    {
      asset: a003,
      caption: 'Lösche die Maus:',
    },
    {
      asset: a05_01,
      caption: "Los geht's beim Apfel:",
    },
    {
      asset: ax01,
      caption: '1. Block für den Apfel:',
    },
    {
      asset: ax02,
      caption: '2. Block für den Apfel:',
    },
    {
      asset: a09,
      caption: 'Zufallszahlen hinzufügen',
    },
    {
      asset: ax09,
      caption: 'Zahlen ändern',
    },
    {
      asset: ax03,
      caption: '3. Block für den Apfel:',
    },
    {
      asset: astart,
      caption: 'Teste dein Programm:',
    },
    {
      asset: asuper,
    },
    {
      asset: a004,
      caption: 'Nun zum Fisch:',
    },
    {
      asset: a01,
      caption: 'Code für den Fisch Teil 1:',
    },
    {
      asset: a02,
      caption: 'Wenn der Apfel berührt wird ...:',
    },
    {
      asset: a03,
      caption: 'Nachricht, Ton, Bewegung',
    },
    {
      asset: astart,
      caption: 'Teste dein Programm wieder:',
    },
    {
      asset: a005,
      caption: "Füge 2 mal Figur 'Pfeil' hinzu:",
    },
    {
      asset: a006,
      caption: "Wähle bei 'Pfeil': Kostüm 'links'",
    },
    {
      asset: a007,
      caption: "Bei 'Pfeil2': Kostüm 'rechts'",
    },
    {
      asset: a008,
      caption: 'So sollen die Figuren aussehen:',
    },
    {
      asset: ax10,
      caption: 'Ziehe die Figuren an ihren Platz:',
    },
    {
      asset: ax05,
      caption: "Code für 'Pfeil' links:",
    },
    {
      asset: ax06,
      caption: "Wähle 'Neue Nachricht'",
    },
    {
      asset: ax07,
      caption: "Gib 'links' ein:",
    },
    {
      asset: aherz,
      caption: 'Kannst du rechts alleine?',
    },
    {
      asset: ax08,
      caption: "Code für 'Pfeil2' rechts:",
    },
    {
      asset: a009,
      caption: 'Zurück zum Fisch:',
    },
    {
      asset: axx09,
      caption: 'Um den Fisch zu steuern:',
    },
    {
      asset: astart,
      caption: 'Teste dein Spiel',
    },
    {
      asset: asuper,
      caption: 'Fertig. Du hast alle Lernspiele geschafft.',
    },
    {
      asset: aneu,
      caption: 'Mache dein eigenes Spiel mit +',
    },
    {
      asset: a04,
      caption: "Ideen findest du unter 'Beispiele'.",
    },
  ],
  nextGame: '08',
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
      blocks: ['random', '--', 'gt', 'lt', 'equals', '--', 'and', 'or', 'not'],
    },
    {
      category: 'variables',
    },
  ],
}
