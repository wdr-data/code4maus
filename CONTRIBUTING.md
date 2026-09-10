# Contributing

## Initial Setup

Use the Node version from `.nvmrc` (`nvm use`). Yarn 1 is pinned via `packageManager` in `package.json`, so corepack picks it up automatically.

To install the dependencies, run:

```sh
yarn install
```

Build failure for the optional native module `printer` can be ignored. It is only needed for `yarn start:printer` and requires `libcups2-dev`.

Copy the file `.env.example` to `.env`:

```sh
cp .env.example .env
```

## Prepare runtime assets

Build-time assets (logos, icons, block media, and the default project's embedded media) are tracked under `assets/`. The runtime sprite, costume, backdrop, sound, and educational-project media are loaded from the S3 bucket's `data/assets/` prefix.

Keep downloaded runtime media in `assets/runtime/`. Git ignores its contents. The preparation command checks references in the source libraries, default project, and educational projects, copies matching files from your asset archive and the tracked default assets, and reports anything missing:

```sh
yarn assets:prepare --from stuff/assets
```

You can provide another directory with `--from /path/to/assets`. Your original files are left in place. A complete copy needs no AWS access. To fill gaps from the dev project's bucket, run this explicit one-time preparation step on the host:

```sh
aws sso login --profile code4maus-sso
AWS_PROFILE=code4maus-sso yarn assets:prepare --from stuff/assets --download
```

Downloads read only missing source-referenced objects under `data/assets/`; they do not copy users' projects or sharing results. Use `--bucket <bucket-name>` to select another source bucket. The separate `assets/` prefix in the dev bucket contains an incomplete asset copy; it is not the runtime path used by the frontend.

Check completeness any time, including after adding library entries or educational projects:

```sh
yarn assets:check
```

## Run with Docker Compose

Once the assets are prepared:

```sh
docker compose up
```

Open http://localhost:8601 after the frontend finishes compiling. Stop host instances of `yarn start` and `yarn start:backend` before starting Compose on the same ports.

Compose starts the frontend, backend, and a pinned SeaweedFS S3 service. A one-shot `dependencies` service installs from the lockfile, and `storage-seed` waits for storage, creates the `code4maus-local` bucket, configures browser CORS and public reads under `data/`, and uploads missing seed assets through the S3 API. Seeding leaves existing assets, projects, and sharing results untouched. Missing seed files stop startup with a preparation command rather than leaving an incomplete bucket.

The frontend routes `/api` to the backend and `/data` to the local bucket. The backend accesses `http://storage:8333` inside Docker and signs browser uploads for `http://localhost:8333`. All storage writes and reads are local; no AWS profile, SSO login, or `~/.aws` mount is used by Compose. The fixed credentials in Compose are only for this local service. Keep the browser at `http://localhost:8601`, which the local bucket permits for uploads.

The bucket persists in the `storage_data` Docker volume. `assets/runtime/` holds the seed inputs, not the storage server's internal files. Do not copy files into the volume directly. `docker compose stop` and `docker compose down` retain data; adding `--volumes` to `down` deletes local projects and other named-volume contents. The next startup recreates and seeds an empty bucket from `assets/runtime/`.

Source files are mounted for backend restarts and frontend reloads, with polling for Docker bind mounts. Container dependencies, build output, and caches use named volumes. After dependency or environment changes, run `docker compose down` followed by `docker compose up`. To add newly prepared assets to an already running bucket, run:

```sh
docker compose run --rm --no-deps storage-seed
```

## Run the app processes on the host

You can use local storage from Docker while running the frontend and backend directly:

```sh
cp .env.backend.example .env.backend
docker compose up -d storage
docker compose run --rm storage-seed
# In separate terminals:
yarn start:backend
yarn start
```

The example environment files target the local bucket and API. The backend listens on `127.0.0.1:3000` and rebuilds/restarts when its source changes. Restart it after editing `.env.backend`; restart the frontend after editing `.env`. `BACKEND_HOST` and `BACKEND_PORT` override the backend listener.

The Express server calls the same three Lambda handlers as CDK: `POST /api/prepareAssetUpload`, `POST /api/saveProject`, and `POST /api/prepareShareResult`. No API stage prefix is needed. `GET /health` checks the HTTP server, not bucket access. Request bodies are limited to 6 MB.

### Optional deployed backend

For a host frontend using the deployed dev API and bucket, set `PROXY_TARGET=https://dev.maus.metahost.org` in `.env`, unset `API_PROXY_TARGET`, and restart `yarn start`. This mode writes real dev data. It needs no AWS credentials because the deployed API handles writes. Compose always overrides these settings to use local services.

To run a host backend against AWS, follow the remote-mode notes in `.env.backend.example`: remove local endpoint and credential settings, select the remote bucket and AWS profile, and log in with the AWS CLI. Point the host frontend's `/api` at that backend and its `/data` at the matching deployed stage.

### Backend checks

```sh
yarn test:backend
```

These tests cover the HTTP handlers with mocked S3 calls, request validation, storage errors, and separate internal/browser storage endpoints. They need no AWS credentials and write no AWS data.

Deployment migration is maintained separately on `deploy-2026`. Serverless dependencies have been removed here; the legacy deployment scripts and workflows are pending replacement on that branch and cannot run with this dependency set.

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
