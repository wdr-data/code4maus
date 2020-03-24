import a000 from './assets/000.png'

export default {
  id: 'beispiel01',
  name: 'Kühlschrank-Memo',
  subtitle: 'Merke dir das Essen',
  image: a000,
  fetchProject: () => import('./project.json'),
  slides: [
    {
      asset: a000,
      caption:
        'Merke Dir, auf was der Elefant zeigt. Jede Runde kommt eine Sache dazu.',
    },
  ],
}
