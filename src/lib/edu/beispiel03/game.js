import a000 from './assets/000.png'

export default {
  id: 'beispiel03',
  name: 'Suchspiel',
  subtitle: 'Hilfe! Die Ente ist weg',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption: 'Bewege die Maus mit den Pfeilen und suche Elefant und Ente.',
    },
  ],
}
