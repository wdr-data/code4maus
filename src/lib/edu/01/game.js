import aL01 from './assets/L01.png';
import an001 from './assets/n001.gif';
import an002 from './assets/n002.gif';
import an003 from './assets/n003.gif';
import aloeschen from './assets/loeschen.gif';
import an005 from './assets/n005.gif';
import an006 from './assets/n006.gif';
import ax02 from './assets/x02.png';
import a001 from '../shared_assets/start.png';
import an007 from './assets/n007.gif';
import an12 from './assets/n12.png';
import an13 from './assets/n13.png';
import aherz from '../shared_assets/herz.png';
import ax03 from './assets/x03.png';
import apeek from './assets/peek.gif';
import avergroessern from './assets/vergroessern.png';
import agut_gemacht from '../shared_assets/gut_gemacht.png';
import an008 from './assets/n008.gif';
import a003 from '../shared_assets/start.png';
import an009 from './assets/n009.gif';
import a004 from './assets/004.png';

export default {
    id: '01',
    name: 'Die Weltraum-Maus',
    subtitle: '01 Bewegung',
    image: aL01,
    "slides": [
        {
            "asset": aL01,
            "caption": "Du programmierst:"
        },
        {
            "asset": an001,
            "caption": "⬅ Ziehe Block 1 rüber:"
        },
        {
            "asset": an002,
            "caption": "⬅ Drücke auf Block 1:"
        },
        {
            "asset": an003,
            "caption": "⬅ Ziehe Block 2 darunter:"
        },
        {
            "asset": aloeschen,
            "caption": "⬅ So kannst du löschen:"
        },
        {
            "asset": an005,
            "caption": "⬅ Ziehe Block 3 darunter:"
        },
        {
            "asset": an006,
            "caption": " Ziehe 'Für immer' drumherum:"
        },
        {
            "asset": ax02,
            "caption": "Setze an den Anfang:"
        },
        {
            "asset": a001,
            "caption": "Fertig! Start:"
        },
        {
            "asset": an007,
            "caption": "️️️️⬅ Gib eine andere Zahl ein:"
        },
        {
            "asset": a001,
            "caption": "Was passiert?"
        },
        {
            "asset": an12,
            "caption": "🐢 Langsam ... "
        },
        {
            "asset": ax02,
            "caption": "⬅ Gib 0.2 ein:"
        },
        {
            "asset": an13,
            "caption": "🐇 Schnell!"
        },
        {
            "asset": aherz,
            "caption": "⬅ Jetzt Du:"
        },
        {
            "asset": ax03,
            "caption": "⬅ Ändere, wie du magst:"
        },
        {
            "asset": apeek,
            "caption": "Wenn Dir etwas zu klein ist:"
        },
        {
            "asset": avergroessern,
            "caption": "Vergößere und verkleinere mit der Lupe"
        },
        {
            "asset": a001
        },
        {
            "asset": agut_gemacht
        },
        {
            "asset": aherz,
            "caption": "Mache dein eigenes Spiel daraus. Ändere Hintergrund und Kostüme."
        },
        {
            "asset": an008,
            "caption": "Wähle Hintergrund: Weltall"
        },
        {
            "asset": a003,
            "caption": "Zurück zur Maus:"
        },
        {
            "asset": an009,
            "caption": "Kostüm: Maus im Weltall"
        },
        {
            "asset": a001
        },
        {
            "asset": a004,
            "caption": "⬆️ Wichtig: Speichern!"
        },
        {
            "asset": agut_gemacht,
            "caption": "Fertig 🍵 Mach mal eine Pause"
        }
    ],
    "nextGame": "02",
    "blocks": [
        {
            "category": "motion",
            "blocks": [
                "turnright",
                "turnleft",
                "--",
                "glideto"
            ]
        },
        {
            "category": "events",
            "blocks": [
                "whenflagclicked"
            ]
        },
        {
            "category": "control",
            "blocks": [
                "wait",
                "repeat",
                "forever"
            ]
        }
    ]
}