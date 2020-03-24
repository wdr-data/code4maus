import a000 from './assets/000.png'

export default {
  id: 'beispiel04',
  name: 'Weltraum-Abenteuer',
  subtitle: 'Fange den Elefanten ein',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption:
        'Das Raumschiff des Elefanten ist außer Kontrolle. Kannst du ihn einfangen?',
    },
  ],
}
