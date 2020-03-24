import a000 from './assets/000.png'

export default {
  id: 'beispiel07',
  name: 'Zahlen raten',
  subtitle: 'Errate die geheime Zahl',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption: 'Errätst Du die geheime Zahl?',
    },
  ],
}
