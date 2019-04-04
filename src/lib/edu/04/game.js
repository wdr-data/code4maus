import aL04 from './assets/L04.png';
import a03 from './assets/03.gif';
import a001 from '../shared_assets/start.png';
import a04 from './assets/04.gif';
import afrage from '../shared_assets/frage.png';
import a002 from './assets/002.png';
import a12 from './assets/12.gif';
import a004 from './assets/004.png';
import a005 from './assets/005.png';
import ablitz from './assets/blitz.png';
import an01 from './assets/n01.png';
import ax01 from './assets/x01.png';
import a19 from './assets/19.gif';
import aherz from '../shared_assets/herz.png';
import ax02 from './assets/x02.png';
import ax03 from './assets/x03.png';
import a007 from './assets/007.png';
import ax04 from './assets/x04.png';
import agut_gemacht from '../shared_assets/gut_gemacht.png';
import ax05 from './assets/x05.png';
import aspeichern from '../shared_assets/speichern.png';
import asuper from '../shared_assets/super.png';

export default {
    id: '04',
    name: 'Wimmelbild',
    subtitle: '04 Mehr Figuren',
    image: aL04,
    "slides": [
        {
            "asset": aL04,
            "caption": "Du programmierst:"
        },
        {
            "asset": a03,
            "caption": "⬅ Ändere den Anfang:"
        },
        {
            "asset": a001,
            "caption": "⬆️ Drücke auf die Maus:"
        },
        {
            "asset": a04,
            "caption": "Neue Figur 'Trötet':"
        },
        {
            "asset": afrage,
            "caption": "Wie trötet der Elefant?"
        },
        {
            "asset": a002,
            "caption": "Wechsle zur Maus:"
        },
        {
            "asset": a12,
            "caption": "Kopiere die Programme:"
        },
        {
            "asset": a004,
            "caption": "Zurück zum Elefanten:"
        },
        {
            "asset": a005,
            "caption": "Klicke den Elefanten an:"
        },
        {
            "asset": ablitz,
            "caption": "Wo ist der Ton?"
        },
        {
            "asset": an01,
            "caption": "Kein 'Klack'-Ton beim Elefanten:"
        },
        {
            "asset": ax01,
            "caption": "⬅ Wähle 'Trötet-2'"
        },
        {
            "asset": ablitz,
            "caption": "Das passt noch nicht."
        },
        {
            "asset": a19,
            "caption": "⬅ Nimm die Schleife raus:"
        },
        {
            "asset": a005,
            "caption": "⬆️ Drücke den Elefanten:"
        },
        {
            "asset": aherz,
            "caption": "Baust du die Ente allein?"
        },
        {
            "asset": ax02,
            "caption": "1. Neue Figur 'Flattert'"
        },
        {
            "asset": ax03,
            "caption": "2. Kopiere von Maus zu Ente"
        },
        {
            "asset": a007,
            "caption": "⬆️ Drücke auf die Ente"
        },
        {
            "asset": ax04,
            "caption": "⬅ Passe den Ton an"
        },
        {
            "asset": agut_gemacht
        },
        {
            "asset": ax05,
            "caption": "Füge gerne mehr Figuren hinzu"
        },
        {
            "asset": aspeichern,
            "caption": "Speichern nicht vergessen!"
        },
        {
            "asset": asuper,
            "caption": "⏲️ Nimm dir eine Pause"
        }
    ],
    "nextGame": "05",
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
            "category": "looks",
            "blocks": [
                "nextcostume"
            ]
        },
        {
            "category": "sound",
            "blocks": [
                "playuntildone"
            ]
        },
        {
            "category": "events",
            "blocks": [
                "whenflagclicked",
                "whenthisspriteclicked"
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