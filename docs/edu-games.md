# Educational games

## File structure

Configurations for educational games are placed inside `src/lib/edu`. Each game is stored inside a directory named by an id, which can be referenced by going to `/lernspiel/<id>` in the app.

## Game configuration

### Initial project

To define a project that should be loaded initially as part of the game, put a Scratch 3 `project.json` into the edu game folder.

### Slides

Slides can be defined for the game. They will be displayed in the bottom right and have these properties:

- Minimum size: `600 x 400 Pixels`
- File format: `svg` (recommended), `png`, `jpg` or `gif`
- Available inside an `assets` directory in the edu game directory

Download as .pdf from Google Slides, convert to .png using `convert -density 90 Lernspiel01_Geistermaus.pdf %03d.png`

### Limit available blocks

To limit the kinds of blocks that are available in the game the settings `blocks` can be used. It will contain Elements in this manner:

- `category`: Identifier of the category whose blocks are being selected. These are available:
  - `motion`
  - `looks`
  - `sound`
  - `events`
  - `control`
  - `sensing`
  - `operators`
  - `variables`
- `blocks`: List of block identifiers which should be shown in this category. Together with the category identifier they determine the `type` property of the resulting block. Take a look at [this file](../src/lib/make-toolbox-xml.js) to find possible values.

### Example `game.yml`

```yaml
---
slides:
  - asset: spiel01_bewegung.png
  - asset: green_flag_move_ten_steps.gif
  - asset: green_flag.gif
  - asset: cat_moves_ten_steps.gif
  - asset: maus_question.svg
  - asset: cat_moves_minus_ten_steps.gif
  - asset: maus_solution.svg
  - asset: move_minus_ten_steps.gif
  - asset: green_flag.gif
  - asset: glides_one_sec_to_random.gif
  - asset: green_flag.gif
  - asset: forever_point_to_mousepointer.gif
  - asset: green_flag.gif
  - asset: maus_question.svg
  - asset: cat_forever_move_ten_steps_bounce.gif
  - asset: maus_solution.svg
  - asset: forever_move_ten_steps_bounce_rotate_left_right.gif
  - asset: twinkle.gif

blocks:
  - category: motion
    blocks:
      - movesteps
      - --
      - turnright
      - turnleft
      - --
      - goto
  - category: events
    blocks:
      - whenflagclicked
      - broadcast
```
