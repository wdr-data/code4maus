import aL00 from '../shared_assets/L00.png';
import astart_blume from './assets/start_blume.jpg';
import astart from '../shared_assets/start.jpg';
import a001 from '../shared_assets/start.jpg';
import adrucken from './assets/drucken.jpg';

export default {
    id: '06',
    name: '#MausArt',
    subtitle: 'Kunst mit Maus und Code',
    image: aL00,
    'slides': [
        {
            'asset': aL00,
            'caption': 'Willkommen zu Programmieren mit der Maus. Klicke weiter.',
        },
        {
            'asset': astart_blume,
            'caption': 'Lass die Blume wachsen:',
        },
        {
            'asset': astart,
            'caption': 'Starte ein paar Mal',
        },
        {
            'asset': a001,
            'caption': 'Ändere die Zahlen für Größe, Farbe und Anzahl der Blätter:',
        },
        {
            'asset': adrucken,
            'caption': 'Drucke oder teile dein Werk!',
        },
    ],
    'nextGame': '04_c',
};
