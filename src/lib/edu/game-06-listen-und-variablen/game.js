import a003 from '../shared_assets/frage.jpg'
import a13 from '../shared_assets/start.jpg'
import a24 from '../shared_assets/blitz.svg'
import a33 from '../shared_assets/herz.jpg'
import a35 from '../shared_assets/gut_gemacht.jpg'
import maus01 from './assets/Maus_TiereRaten.svg'
import a00 from './assets/00.jpg'
import a001 from './assets/001.jpg'
import a002 from './assets/n10.jpg'
import a004 from './assets/ausrufezeichen.svg'
import a1 from './assets/1.jpg'
import a2 from './assets/1.mp4'
import a3 from './assets/2.mp4'
import a4 from './assets/3.mp4'
import a5 from './assets/n1.png'
import a6 from './assets/3.jpg'
import a7 from './assets/n2.mp4'
import a8 from './assets/n3.png'
import a9 from './assets/n4.mp4'
import a10 from './assets/n5.png'
import a11 from './assets/n6.mp4'
import a12 from './assets/n7.png'
import a14 from './assets/n8.mp4'
import a15 from './assets/7.jpg'
import a16 from './assets/9.1.jpg'
import a17 from './assets/10.1.mp4'
import a18 from './assets/10.2.mp4'
import a19 from './assets/10.3.mp4'
import a20 from './assets/11.mp4'
import a21 from './assets/12.jpg'
import a22 from './assets/13.jpg'
import a23 from './assets/14.jpg'
import a25 from './assets/15.1.mp4'
import a26 from './assets/15.2.jpg'
import a27 from './assets/16.jpg'
import a28 from './assets/15.3.mp4'
import a29 from './assets/17.1.mp4'
import a30 from './assets/17.2.jpg'
import a31 from './assets/19.jpg'
import a32 from './assets/20.jpg'
import a34 from './assets/n9.mp4'

export default {
  id: '07',
  name: 'Tiere raten',
  subtitle: '06 Listen & Variablen',
  image: maus01,
  fetchProject: () => import('./project.json'),
  nextGame: '04_c',
  slides: [
    {
      asset: maus01,
      caption: 'Tiere raten',
    },
    {
      asset: a002,
      caption: 'Programmiere ein Ratespiel für zwei!',
    },
    {
      asset: a00,
      caption: 'Ein Kind denkt sich 3 Tiere aus...',
    },
    {
      asset: a001,
      caption: '... und ein zweites muss sie erraten.',
    },
    {
      asset: a003,
      caption:
        'Zuerst baust du ein Programm für die Rate-Wörter mit einer Liste.',
    },
    {
      asset: a1,
      caption: 'Klicke auf Variablen.',
    },
    {
      asset: a2,
      caption: "Erstelle zwei neue Listen. Nenne sie 'Wörter' ...",
    },
    {
      asset: a3,
      caption: "und 'Geraten'.",
    },
    {
      asset: a4,
      caption: "Füge eine neue Variable hinzu. Nenne sie 'A-Z'.",
    },
    {
      asset: a5,
      caption: 'Baue dieses Programm.',
    },
    {
      asset: a6,
      caption: 'Klicke auf Operatoren.',
    },
    {
      asset: a7,
      caption: "Ziehe 'Zeichen von' rein.",
    },
    {
      asset: a8,
      caption: 'Diese Buchstaben können vorkommen.',
    },
    {
      asset: a9,
      caption: 'Der Buchstabe wird zufällig ausgewählt.',
    },
    {
      asset: a10,
      caption: 'Ändere die Zahl.',
    },
    {
      asset: a11,
      caption: "Ziehe 'verbinde' rein.",
    },
    {
      asset: a12,
      caption: 'Das soll die Ente fragen:',
    },
    {
      asset: a13,
      caption: 'Teste dein Programm.',
    },
    {
      asset: a14,
      caption: 'Schreibe 3 Tiere in die Liste.',
    },
    {
      asset: a004,
      caption: 'Klicke auf den freien Platz unter den Wörtern.',
    },
    {
      asset: a003,
      caption: 'Programmiere jetzt das Raten.',
    },
    {
      asset: a15,
      caption: 'Baue ein zweites Programm,',
    },
    {
      asset: a16,
      caption: 'damit später ein zweites Kind raten kann.',
    },
    {
      asset: a17,
      caption: 'So soll die Frage aussehen.',
    },
    {
      asset: a18,
      caption: "Für die Antwort: Ziehe 'Enthält' rein.",
    },
    {
      asset: a19,
      caption: "...und 'Antwort' aus der Kategorie 'Fühlen'.",
    },
    {
      asset: a20,
      caption: 'Wurde richtig geraten? Wenn ja:',
    },
    {
      asset: a21,
      caption: "Die Antwort soll in die 'Geraten' Liste geschrieben werden.",
    },
    {
      asset: a22,
      caption: 'Wenn die Antwort falsch ist:',
    },
    {
      asset: a23,
      caption: 'Teste dein Programm.',
    },
    {
      asset: a24,
      caption: 'Man kann nur einmal raten!',
    },
    {
      asset: a25,
      caption: "Benutze 'Wiederhole bis'",
    },
    {
      asset: a26,
      caption: "Ziehe den 'x = 100' Operator rein.",
    },
    {
      asset: a27,
      caption: "Ziehe 2 mal 'Länge von' dazu.",
    },
    {
      asset: a28,
      caption: 'So werden die Listen verglichen.',
    },
    {
      asset: a29,
      caption: "Ziehe 'sage' ganz nach unten.",
    },
    {
      asset: a30,
      caption: 'Ändere den Text.',
    },
    {
      asset: a31,
      caption: "Ziehe 'zeige' und 'verstecke' in deine Programme.",
    },
    {
      asset: a32,
      caption: "Ziehe 2 mal 'lösche alles' rein.",
    },
    {
      asset: a33,
      caption: 'Jetzt kanst du mit einem 2. Kind spielen!',
    },
    {
      asset: a14,
      caption:
        'Kind 1 klickt auf > und schreibt 3 Tiere in die Liste und klickt auf die Ente.',
    },
    {
      asset: a34,
      caption: 'Kind 2 darf jetzt schauen und muss raten.',
    },
    {
      asset: a35,
      caption: 'Viel Spaß beim Spielen!',
    },
  ],
}
