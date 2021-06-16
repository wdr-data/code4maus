import keyBy from 'lodash.keyby'

function importAll(context) {
  return context
    .keys()
    .sort()
    .map((key) => context(key).default)
}

// This is a Webpack-specific method to load modules according to the given regex
const gamesContext = require.context('./', true, /game.+\/game\.js$/)
const examplesContext = require.context('./', true, /example.+\/game\.js$/)
const videosContext = require.context('./', true, /video.+\/video\.js$/)

export const games = importAll(gamesContext)
export const examples = importAll(examplesContext)
export const videos = importAll(videosContext)
export const gamesKeyed = keyBy([...games, ...examples], 'id')

export default games
