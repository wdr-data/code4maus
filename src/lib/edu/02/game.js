import aL02 from './assets/L02.png';
import aa from './assets/a.mp4';
import a001 from './assets/001.jpg';
import afrage from '../shared_assets/frage.jpg';
import ad from './assets/d.mp4';
import ax002 from './assets/x002.jpg';
import ax003 from './assets/x003.jpg';
import a003 from '../shared_assets/start.jpg';
import ax004 from './assets/x004.jpg';
import ax005 from './assets/x005.jpg';
import asuper from '../shared_assets/super.png';

export default {
    id: '02',
    name: 'Die Maus blinzelt',
    subtitle: 'Trickfilm',
    image: aL02,
    fetchProject: () => import('./project.json'),
    "slides": [
        {
            'asset': aL02,
            'caption': 'Du programmierst:',
        },
        {
            'asset': aa,
            'caption': '⬅ Ziehe diesen Block:',
        },
        {
            'asset': a001,
            'caption': 'Drücke ein paar Mal drauf:',
        },
        {
            'asset': afrage,
            'caption': 'Was macht die Maus?',
        },
        {
            'asset': ad,
        },
        {
            'asset': ax002,
            'caption': '⬅ Baue dieses Programm:',
        },
        {
            'asset': ax003,
            'caption': '⬅ Ändere die Zahlen:',
        },
        {
            'asset': a003,
            'caption': 'Teste dein Programm:',
        },
        {
            'asset': ax004,
            'caption': '⬅ 2. Programm: Für den Ton',
        },
        {
            'asset': ax005,
            'caption': '⬅ Ändere die Zahl:',
        },
        {
            'asset': a003,
            'caption': 'Fertig. Starte:',
        },
        {
            'asset': asuper,
            'caption': 'Fertig. 🍏 Iss oder trink etwas',
        },
    ],
    'nextGame': '03',
    'blocks': [
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
            'category': 'looks',
            'blocks': ['nextcostume'],
        },
        {
            'category': 'sound',
            'blocks': ['playuntildone'],
        },
        {
            'category': 'events',
            'blocks': ['whenflagclicked'],
        },
        {
            'category': 'control',
            'blocks': [
                'wait',
                'repeat',
                'forever',
            ],
        },
    ],
};
