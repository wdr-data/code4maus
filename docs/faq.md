# Code4Maus FAQ

## initial setup

If you're setting this up for the first time `ỳarn start` will throw an arrow because it can't find the assets.

You need aws credentials to do
`aws configure`
do `export AWS_PROFILE=hackingstudio`
and then
`yarn assets:download`

 If this is done, you can run your project locally with:

`yarn start`


You have to set up an [.env](.env) file with aws credentials and then
do
`yarn assets:download`




## Create an educational game

## Add a costum or sprite

- In programmieren.wdrmaus.de frontend choose upload.
- Import svg for each costume and import sound.
- save project
- download project and change .sb to .zip
- unpack .zip
- open project.json in vs code, str+shift+p ```format document```
- then change the name of the new sprites in project.json
- In your terminal in folder code4maus run ```yarn import-sprites all ../sprites_import/wurst/project.json start``` with adjusted path to the folder you just downloaded
This will change these files:
src/lib/libraries/sprites.json
src/lib/libraries/costumes.json
src/lib/libraries/sounds.json

## Change blocks translations

1. Change translation in scratch-blocks/patch-translations
German translations are found in this file:
* scratch-blocks/msg/scratch_msgs.js *

4. Change package.json in scratch-blocks/patch-translations
Then add +1 to the version of the package in the [package.json](package.json):
`"version": "0.1.3`"`

5. Commit to scratch-blocks/patch-translations
Git commit the changes.

6. Release to npm
Now you can release the changes as a new version to npm:
`npm publish --access public`
If you are doing this for the first time on your machine, you have to run:
`npm login`
and sign in with username, password and email.

7. Push to scratch-blocks/patch-translations
Push your commit to scratch-blocks/patch/translations

7. Add the new version to code4maus/develop
Change to the code4maus repo and add the new version:
`yarn add --dev @wdr-data/scratch-blocks`