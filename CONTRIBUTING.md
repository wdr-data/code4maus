# Contributing

## Initial Setup

To install the dependencies, run:

```sh
yarn install
```

Copy the file `.env.example` to `.env`:

```sh
cp .env.example .env
```

Currently, the assets (in `./assets`) are not part of this repository, so you'll have to get them first. For that, you need the AWS CLI and access to the `hackingstudio` AWS profile.

```sh
export AWS_PROFILE=hackingstudio
yarn assets:download
```

## Run the project

```sh
yarn start
```

Open http://localhost:8601 and wait for the build to finish.

To also use the save functionality, run:

```sh
yarn start:backend
```

This will only work if you have a current AWS_PROFILE with access to the buckets.

## Add a new Game

The games and examples are placed inside `src/lib/edu`. They are loaded automatically as long as the folders have the `game` or `example` prefix. In the frontend, they are ordered alpabetically by the name of their folder. (So you can use numbers to sort them!)

A game folder should consist of a Scratch 3 `project.json` file and a `game.js`.

The `id` property of the game data (inside each `game.js`) will be used as the slug for the URL. Example: The game with `id: "00"` can be seen at https://programmieren.wdrmaus.de/lernspiel/00

To create your `project.json`, create your project on the [programmieren.wdrrmaus.de](https://programmieren.wdrmaus.de) website and download it.

```sh
# make sure you're in the right folder
cd /path/to/code4maus

# create a game folder
mkdir ./src/lib/edu/example-your-cool-project

# sb3 files are basically zips! So unzip it into the folder you just created
unzip /your/downloaded.sb3 -d ./src/lib/edu/example-your-cool-project

# Automatically format the project file
yarn prettier --write ./src/lib/edu/example-your-cool-project/project.json
```

You can now create the `game.js` and configure your game. Look at the other games to see what to put into your `game.js`.

⚠️ `unzip` will also put the project's asset files (images, sounds, etc) into your game folder. You need to move those into `./assets/project-assets` and sync them to S3. Currently, they should not be uploaded to GitHub.

### Slides

You can add slides to a game that are displayed in the bottom right. Add a `slides` array to your `game.js`:

```js
// game.js

export default {
  id: 'your-game',
  // ...
  slides: [
    {
      // The asset can be a `svg`, `png`, `jpg`, `gif` or `mp4`
      asset: require('./assets/slide-01.svg'),
      // You can define a caption that is display above the asset
      caption: 'Where is my green pullover?',
    },
  ],
}
```

### Limit available blocks

If you want to overwrite the categories and blocks in your game, you can add a `blocks` array to your `game.js`. (By default, all categories and blocks will be displayed.)

```js
// game.js

export default {
  id: 'your-game',
  // ...
  blocks: [
    {
      category: 'motion',
      blocks: ['movesteps', 'turnright', 'turnleft', '--', 'gotoxy'],
    },
    {
      category: 'sound',
      blocks: ['playuntildone'],
    },
  ],
}
```

`category` can have these values:

- `motion`
- `looks`
- `sound`
- `events`
- `control`
- `sensing`
- `operators`
- `variables`

`blocks`: List of blocks to display in the category. Inside the [./src/lib/make-toolbox-xml.js](../src/lib/make-toolbox-xml.js) there are arrays of the default blocks. Take a look at those to see which blocks are available.

## Add a costume or sprite

- In programmieren.wdrmaus.de frontend choose upload.
- Import svg for each costume and import sound.
- save project
- download project and change .sb to .zip
- unpack .zip
- open project.json in vs code, str+shift+p `format document`
- then change the name of the new sprites in project.json
- In your terminal in folder code4maus run `yarn import-sprites all ../sprites_import/wurst/project.json start` with adjusted path to the folder you just downloaded
  This will change these files:
  src/lib/libraries/sprites.json
  src/lib/libraries/costumes.json
  src/lib/libraries/sounds.json

  Add tags for the new sprites and costumes, list of tags can be found here:
  src/lib/libraries/sprite-tags.json

  To update a backdrop do the same as with sprites, but add the backdrop as well in 
  src/lib/default-project/project.json

  Note: 
  Uploading a new sprite/costume/backdrop on programmmieren.wdrmaus.de will upload the asset into the production bucket. If you want to use this locally also upload it in the staging environment code4maus.de - this will upload the asset into the staging bucket. Recommended: Start by uploading new sprites in staging, download the .sb3 and run the `import-sprites` command, check locally, merge into staging and then upload the .sb3 in programmieren.wdrmaus.de before production deploy.

## Patched block translations

Some of the official Scratch translations may be a bit hard to understand for kids, so we overwrite some of them. All translations can be found in `src/scratch-patches/german.json`

When you update `scratch-blocks` (`yarn install scratch-blocks@latest`), make sure to run `node ./scripts/extract-german-translations.js` to extract the latest versions of the german translation. After that, you should change your `git diff` to make sure to keep all custom translations that you want to keep.
