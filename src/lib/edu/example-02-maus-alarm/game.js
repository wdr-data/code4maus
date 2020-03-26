import a000 from './assets/000.png'

export default {
  id: 'beispiel02',
  name: 'Maus-Alarm',
  subtitle: 'Füttere den Elefanten',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption:
        'Bewege die Maus mit den Pfeilen, fange das Obst und füttere den Elefanten.',
    },
  ],
}
