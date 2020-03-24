import a000 from './assets/000.png'

export default {
  id: 'beispiel06',
  name: 'Luftballon-Spiel',
  subtitle: 'Lauf vor der Ente weg',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption:
        'Mit deinem Finger oder der Computermaus: Lass den Luftballon vor der Ente weglaufen.',
    },
  ],
}
