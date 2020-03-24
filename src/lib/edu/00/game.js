import aL00 from '../shared_assets/L00.jpg'
import agut_gemacht from '../shared_assets/gut_gemacht.jpg'
import ahand from './assets/hand.jpg'
import aa from './assets/a.mp4'
import ab from './assets/b.mp4'

export default {
  id: '00',
  name: 'Hallo Welt',
  subtitle: '00 Video: Erste Schritte',
  image: aL00,
  preVideo:
    'https://wdradaptiv-vh.akamaihd.net/i/medp/ondemand/weltweit/fsk0/191/1910629/,1910629_22682393,1910629_22682388,1910629_22682390,1910629_22682389,1910629_22682392,1910629_22682391,.mp4.csmil/master.m3u8',
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: aL00,
      caption: "➡️ Hier geht's los!",
      dim: true,
    },
    {
      asset: ahand,
      caption:
        "Hier in diesem Kasten lernst du Schritt für Schritt, wie das hier geht. Drücke nach jedem Schritt 'Weiter':",
    },
    {
      asset: aa,
      caption: 'Starte mit:',
    },
    {
      asset: ab,
      caption: 'Stoppe mit:',
    },
    {
      asset: agut_gemacht,
    },
  ],
  nextGame: '01',
  blocks: [
    {
      category: 'motion',
      blocks: ['turnright', 'turnleft', '--', 'glideto'],
    },
    {
      category: 'events',
      blocks: ['whenflagclicked'],
    },
    {
      category: 'control',
      blocks: ['wait', 'repeat', 'forever'],
    },
  ],
}
