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

`PROXY_TARGET` points the dev server at a deployed stage (default: dev). Requests to `/data` (assets, saved projects) and `/api` (save, share) are proxied there, so no AWS credentials are needed to run the app locally.

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

Saving works against the stage in `PROXY_TARGET`. Asset uploads go from the browser directly to the stage's project bucket, which only works for stages whose bucket CORS rule allows `http://localhost:8601` (currently: dev, see `cdk/lib/cdk-stack.ts`).

### Local backend (optional)

To run the Lambda handlers from `src/backend` locally instead of using the deployed API:

1. Set up an AWS profile with read/write access to the dev project bucket and its KMS key. The example uses the `code4maus-sso` SSO profile.
2. Copy `.env.backend.example` to `.env.backend`. It sets the dev bucket, region, and AWS profile. Exported environment variables take precedence.
3. In `.env`, set `API_PROXY_TARGET=http://localhost:3000`. Keep `PROXY_TARGET=https://dev.maus.metahost.org` so reads use the same dev bucket through CloudFront.
4. Log in and start the backend:

```sh
aws sso login --profile code4maus-sso
yarn start:backend
```

Run `yarn start` in another terminal (restart it after changing `.env`). The backend listens on `127.0.0.1:3000` and rebuilds/restarts when backend source files change. Restart `yarn start:backend` after editing `.env.backend`. `BACKEND_HOST` and `BACKEND_PORT` can override the listener; update `API_PROXY_TARGET` if changing the port.

The local Express server calls the same three Lambda handlers as CDK: `POST /api/prepareAssetUpload`, `POST /api/saveProject`, and `POST /api/prepareShareResult`. No API stage prefix is needed. `GET /health` checks the local HTTP server; it does not check AWS access. Request bodies are limited to 6 MB.

Requests to `/api` go through the webpack proxy to the local backend. Reads under `/data` continue through the deployed dev CloudFront distribution, and presigned uploads go directly from the browser to the dev bucket. Saving and sharing therefore write real dev data. Keep the browser at `http://localhost:8601`, which is allowed by the dev bucket's CORS configuration.

If AWS requests fail, check the backend logs and renew the SSO login. Access and credential errors are reported as errors, rather than interpreted as missing assets. The SDK loads and refreshes credentials through its standard credential chain; no keys belong in frontend configuration.

To return to the deployed API, unset `API_PROXY_TARGET` in `.env` and restart `yarn start`.

#### Docker development stack

With `.env` and `.env.backend` configured and the host SSO session logged in:

```sh
docker compose up
```

Open http://localhost:8601 after the frontend finishes compiling. Compose runs both frontend and backend on Node 24, publishing ports 8601 and 3000 on localhost. Stop host instances of `yarn start` and `yarn start:backend` before starting Compose on those ports.

The frontend routes `/api` to `http://backend:3000` inside Docker, overriding the host-oriented `API_PROXY_TARGET` in `.env`. Reads under `/data` still use `PROXY_TARGET` from `.env`, and browser uploads still go directly to the dev bucket.

A one-shot `dependencies` service installs from the lockfile into a shared container-only `node_modules` volume before either app starts. The first start requires registry access. Source files are mounted for automatic backend restarts and frontend reloads; frontend polling supports Docker bind mounts. Build output and caches use named volumes, leaving the host build directory available for CDK. After dependency or environment changes, run `docker compose down` followed by `docker compose up` to reinstall as needed and restart both apps.

The host's `~/.aws` directory is mounted read-only into the backend so it can use its config and SSO cache. Renew SSO with the AWS CLI on the host. Local S3 storage is not part of this stack.

Use `docker compose stop` to stop both apps. You can still run only `docker compose up backend` alongside a host frontend configured with `API_PROXY_TARGET=http://localhost:3000`.

#### Backend checks

```sh
yarn test:backend
```

These HTTP tests exercise the actual handlers with mocked S3 calls, covering save, upload, sharing, request validation, and storage errors. They need no AWS credentials and write no AWS data.

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
