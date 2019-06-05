import game00 from './00/game.js';
import game01 from './01/game.js';
import game02 from './02/game.js';
import game03 from './03/game.js';
import game04 from './04/game.js';
import game04_b from './04_b/game.js';
import game07 from './07/game.js';
import game04_c from './04_c/game.js';
import game05 from './05/game.js';
import game08 from './08/game.js';
import examples from './examples.js';

const games = [
    game00,
    game01,
    game02,
    game03,
    game04,
    game04_b,
    game07,
    game04_c,
    game05,
    game08,
];

export const gamesKeyed = {};

for (const game of games) {
    gamesKeyed[game.id] = game;
}

for (const example of examples) {
    gamesKeyed[example.id] = example;
}

export default games;
