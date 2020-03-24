import astart from '../shared_assets/start.jpg'
import title from './assets/000.png'
import astart_blume from './assets/start_blume.jpg'
import a001 from './assets/001.jpg'

export default {
  id: 'beispiel00',
  name: '#MausArt',
  subtitle: 'Kunst mit Maus und Code',
  image: title,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: title,
      caption: 'Willkommen zu #MausArt. Klicke weiter.',
    },
    {
      asset: astart_blume,
      caption: 'Lass die Blume wachsen:',
    },
    {
      asset: astart,
      caption: 'Starte ein paar Mal',
    },
    {
      asset: a001,
      caption: 'Ändere die Zahlen für Größe, Farbe und Anzahl der Blätter:',
    },
  ],
}
