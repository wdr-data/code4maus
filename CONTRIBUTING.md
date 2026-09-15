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

## Project media

UI assets and the default project's embedded media are checked into Git. The sprite, costume, backdrop, sound, and educational-project libraries also reference media served from the project bucket under `data/assets/<filename>`.

Keep untracked project media in `assets/runtime/`. Either copy a bundle from another contributor directly into that directory, or download the files referenced by the current checkout:

```sh
yarn assets:download
```

Downloads use the public dev site, so no AWS credentials are needed. Only missing files are downloaded; existing local files are kept. Tracked default-project media is reused directly from `assets/project-assets/`. To use another deployed environment as the source:

```sh
yarn assets:download --source https://programmieren.wdrmaus.de
```

Check the local collection after switching branches or adding project/library references:

```sh
yarn assets:check
```

The check reports missing files, invalid content, filename-hash mismatches, and files not referenced by the current checkout. Missing files, empty files, and HTML error pages fail the check. Hash mismatches are warnings because some existing published media has a filename that no longer matches its content. Downloads never replace existing files; back up a conflicting file before removing it and downloading a replacement.

To delete the unreferenced local files listed by the check:

```sh
yarn assets:check --prune
```

Pruning only removes files from `assets/runtime/`, preserving `.gitkeep`. It does not touch bundled media or any bucket. Files for unfinished work or another branch may still be useful, so review the list first.

### Publish new project media

Place new images and sounds in `assets/runtime/` with the filenames referenced by the project/library JSON, then run `yarn assets:check`. To try them in a running local stack, seed its bucket again:

```sh
docker compose run --rm --no-deps storage-seed
```

Maintainers publish this media separately from the frontend build. Choose the destination environment's project bucket explicitly, and use an AWS profile with read/write access to that bucket and its encryption key. For an SSO profile, log in first with `aws sso login --profile <profile>`.

```sh
# Preview which source-referenced files are missing from the destination.
AWS_PROFILE=<profile> yarn assets:upload --bucket <project-bucket> --dry-run

# Upload the missing files.
AWS_PROFILE=<profile> yarn assets:upload --bucket <project-bucket>
```

The upload command uses `data/assets/` in the selected bucket and includes any referenced bundled default media. It defaults to region `eu-central-1`; set `AWS_REGION` for another region. Existing objects are compared with the local files before uploading, and differing content stops the operation. No existing objects are overwritten or deleted: saved user projects can reference media that is absent from the current source tree. New assets must be published to each destination before deploying frontend changes that reference them. UI assets and slides imported by the frontend are included in its normal build and deployment.

For contributions with new untracked media, provide the files to a maintainer as an archive alongside the code review. The JSON references belong in Git; files in `assets/runtime/` do not. Contributors do not need AWS access to develop or submit changes.

## Run with Docker Compose

Once `yarn assets:check` passes:

```sh
docker compose up
```

Open http://localhost:8601 after the frontend finishes compiling. Stop host instances of `yarn start` and `yarn start:backend` before starting Compose on the same ports.

Compose starts the frontend, backend, and a pinned SeaweedFS S3 service. A one-shot `dependencies` service installs from the lockfile, and `storage-seed` waits for storage, creates the `code4maus-local` bucket, configures browser CORS and public reads under `data/`, and uploads missing seed assets through the S3 API. Seeding leaves existing assets, projects, and sharing results untouched. Missing or invalid seed files stop startup with an asset-check error.

The frontend routes `/api` to the backend and `/data` to the local bucket. The backend accesses `http://storage:8333` inside Docker and signs browser uploads for `http://localhost:8333`. All storage writes and reads are local; no AWS profile, SSO login, or `~/.aws` mount is used by Compose. The fixed credentials in Compose are only for this local service. Keep the browser at `http://localhost:8601`, which the local bucket permits for uploads.

The bucket persists in the `storage_data` Docker volume. `assets/runtime/` and the tracked default media supply the seed inputs; the storage server maintains its own files in the volume. Do not copy files into the volume directly. `docker compose stop` and `docker compose down` retain data; adding `--volumes` to `down` deletes local projects and other named-volume contents. The next startup recreates and seeds an empty bucket from the local media files.

Source files are mounted for backend restarts and frontend reloads, with polling for Docker bind mounts. Container dependencies, build output, and caches use named volumes. After dependency or environment changes, run `docker compose down` followed by `docker compose up`. To add new media to an already running bucket, run:

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

### Development checks

```sh
yarn test:backend
yarn test:assets
```

These tests cover the HTTP handlers with mocked S3 calls, request validation, storage errors, and separate internal/browser storage endpoints. The asset tests cover public downloads, local checks/pruning, and publishing behavior using temporary files and a local HTTP server. These tests need no AWS credentials and write no AWS data.

## Add a new Game

The games and examples are placed inside `src/lib/edu`. They are loaded automatically as long as the folders have the `game` or `example` prefix. In the frontend, they are ordered alpabetically by the name of their folder. (So you can use numbers to sort them!)

A game folder should consist of a Scratch 3 `project.json` file and a `game.js`.

The `id` property of the game data (inside each `game.js`) will be used as the slug for the URL. Example: The game with `id: "00"` can be seen at https://programmieren.wdrmaus.de/lernspiel/00

To create your `project.json`, create a project in the local app and download it as an `.sb3` file.

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

`unzip` also puts the project's images and sounds into the game folder. Move those media files into `assets/runtime/`, keeping `project.json` in the game folder. Follow [Publish new project media](#publish-new-project-media) to check, test, and publish them. Keep slide images and other media imported by `game.js` beside the game code and commit them to Git.

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

1. In the local app, import the costumes and sounds, name the sprites, and download the project as an `.sb3` file.
2. Unzip the project into a temporary directory. Move its media files into `assets/runtime/` and keep `project.json` for the import command.
3. Import the library entries with the path to that JSON:

   ```sh
   yarn import-sprites all /path/to/extracted/project.json start
   ```

   This updates `src/lib/libraries/sprites.json`, `costumes.json`, and `sounds.json`. Review the generated entries and add tags from `src/lib/libraries/sprite-tags.json`.
4. Run `yarn assets:check`, seed the local bucket again, and test the library entries. Follow [Publish new project media](#publish-new-project-media) to make the media available in each deployed environment.

If a change also updates the default project, update `src/lib/default-project/project.json` and its bundled media imports in `src/lib/default-project/index.js`. Those embedded files belong in the tracked `assets/project-assets/` directory.

## Patched block translations

Some of the official Scratch translations may be a bit hard to understand for kids, so we overwrite some of them. All translations can be found in `src/scratch-patches/german.json`

When you update `scratch-blocks` (`yarn install scratch-blocks@latest`), make sure to run `node ./scripts/extract-german-translations.js` to extract the latest versions of the german translation. After that, you should change your `git diff` to make sure to keep all custom translations that you want to keep.
