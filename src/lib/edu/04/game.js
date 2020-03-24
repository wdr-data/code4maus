import afrage from '../shared_assets/frage.jpg'
import aherz from '../shared_assets/herz.jpg'
import agut_gemacht from '../shared_assets/gut_gemacht.jpg'
import aspeichern from '../shared_assets/speichern.jpg'
import asuper from '../shared_assets/super.jpg'
import aL04 from './assets/L04.png'
import a03 from './assets/03.mp4'
import a001 from './assets/001.jpg'
import a04 from './assets/04.mp4'
import a002 from './assets/002.jpg'
import a12 from './assets/12.mp4'
import a004 from './assets/004.jpg'
import a005 from './assets/005.jpg'
import ablitz from './assets/blitz.png'
import an01 from './assets/n01.jpg'
import ax01 from './assets/x01.jpg'
import a19 from './assets/19.mp4'
import ax02 from './assets/x02.jpg'
import ax03 from './assets/x03.jpg'
import a007 from './assets/007.jpg'
import ax04 from './assets/x04.jpg'
import ax05 from './assets/x05.jpg'

export default {
  id: '04',
  name: 'Wimmelbild',
  subtitle: '04 Mehr Figuren',
  image: aL04,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: aL04,
      caption: 'Du programmierst:',
    },
    {
      asset: a03,
      caption: '⬅ Ändere den Anfang:',
    },
    {
      asset: a001,
      caption: '⬆️ Drücke auf die Maus:',
    },
    {
      asset: a04,
      caption: "Neue Figur 'Trötet':",
    },
    {
      asset: afrage,
      caption: 'Wie trötet der Elefant?',
    },
    {
      asset: a002,
      caption: 'Wechsle zur Maus:',
    },
    {
      asset: a12,
      caption: 'Kopiere die Programme:',
    },
    {
      asset: a004,
      caption: 'Zurück zum Elefanten:',
    },
    {
      asset: a005,
      caption: 'Klicke den Elefanten an:',
    },
    {
      asset: ablitz,
      caption: 'Wo ist der Ton?',
    },
    {
      asset: an01,
      caption: "Kein 'Klack'-Ton beim Elefanten:",
    },
    {
      asset: ax01,
      caption: "⬅ Wähle 'Trötet-2'",
    },
    {
      asset: ablitz,
      caption: 'Das passt noch nicht.',
    },
    {
      asset: a19,
      caption: '⬅ Nimm die Schleife raus:',
    },
    {
      asset: a005,
      caption: '⬆️ Drücke den Elefanten:',
    },
    {
      asset: aherz,
      caption: 'Baust du die Ente allein?',
    },
    {
      asset: ax02,
      caption: "1. Neue Figur 'Flattert'",
    },
    {
      asset: ax03,
      caption: '2. Kopiere von Maus zu Ente',
    },
    {
      asset: a007,
      caption: '⬆️ Drücke auf die Ente',
    },
    {
      asset: ax04,
      caption: '⬅ Passe den Ton an',
    },
    {
      asset: agut_gemacht,
    },
    {
      asset: ax05,
      caption: 'Füge gerne mehr Figuren hinzu',
    },
    {
      asset: aspeichern,
      caption: 'Speichern nicht vergessen!',
    },
    {
      asset: asuper,
      caption: '⏲️ Nimm dir eine Pause',
    },
  ],
  nextGame: '04_b',
  blocks: [
    {
      category: 'motion',
      blocks: ['turnright', 'turnleft', '--', 'glideto'],
    },
    {
      category: 'looks',
      blocks: ['nextcostume'],
    },
    {
      category: 'sound',
      blocks: ['playuntildone'],
    },
    {
      category: 'events',
      blocks: ['whenflagclicked', 'whenthisspriteclicked'],
    },
    {
      category: 'control',
      blocks: ['wait', 'repeat', 'forever'],
    },
  ],
}
