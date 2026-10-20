import title from './assets/000.png'

export default {
  id: 'beispiel0',
  name: 'Die Band',
  subtitle: 'Musik mit Blöcken',
  image: title,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: title,
      caption: 'Die Band spielt einen Song',
    },
  ],
}
