import a000 from './assets/000.png'

export default {
  id: 'beispiel08',
  name: '1 x 1',
  subtitle: 'Übe das Einmaleins',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption: 'Übe das Einmaleins',
    },
  ],
}
