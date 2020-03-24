import a000 from './assets/000.png'

export default {
  id: 'beispiel09',
  name: 'Schlaue Maus',
  subtitle: 'Die Maus findet deine Zahl',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption:
        'Die Maus findet in zehn Fragen jede Zahl zwischen 1 und 1.000 heraus.',
    },
  ],
}
