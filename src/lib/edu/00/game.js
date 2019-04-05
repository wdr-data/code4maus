import aL00 from '../shared_assets/L00.png';
import ahand from './assets/hand.jpg';
import aa from './assets/a.mp4';
import ab from './assets/b.mp4';
import agut_gemacht from '../shared_assets/gut_gemacht.png';

export default {
    id: '00',
    name: 'Hallo Welt',
    subtitle: '00 Erste Schritte',
    image: aL00,
    'slides': [
        {
            'asset': aL00,
            'caption': "➡️ Hier geht's los!",
            'dim': true,
        },
        {
            'asset': ahand,
            'caption': "Hier in diesem Kasten lernst du Schritt für Schritt, wie das hier geht. Drücke nach jedem Schritt 'Weiter':",
        },
        {
            'asset': aa,
            'caption': 'Starte mit:',
        },
        {
            'asset': ab,
            'caption': 'Stoppe mit:',
        },
        {
            'asset': agut_gemacht,
        },
    ],
    'nextGame': '01',
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
            'category': 'events',
            'blocks': [ 'whenflagclicked' ],
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
