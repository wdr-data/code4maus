# Wartungsseite

Statische Seite für Wartungsarbeiten, z. B. beim Umzug auf eine neue
Deployment-Umgebung.

- `index.html` und `style.css` sind die Quelle. Zum Ansehen `index.html` direkt
  im Browser öffnen.
- `yarn build:maintenance` erzeugt daraus `build/maintenance.html`: eine
  einzelne Datei, in der Stylesheet, Bilder, Favicon und Schriften eingebettet
  sind. Sie lädt nichts nach und funktioniert ohne den Rest der App.
- Externe Assets (`https://…` in `src`, `url()` oder `<link href>`) bricht der
  Build ab. Normale Links (`<a href>`) sind erlaubt.

## Assets

Damit die Seite unter 100 KB bleibt, liegen hier verkleinerte Kopien:

- `img/logo.webp`, `img/favicon.png`, `img/wdr-logo.svg`: aus `assets/img/`
  verkleinert bzw. mit svgo optimiert.
- `img/background.png`: erzeugt mit `uv run maintenance/make-background.py`
  (Streifen in drei Blautönen aus `src/components/gui/bg_header@1x.png`), wird
  pixelig hochskaliert.
- `fonts/`: Titillium Web aus `static/fonts/`, beschränkt auf ASCII, deutsche
  Umlaute, ß und typografische Anführungszeichen/Striche. Zeichen außerhalb
  meldet der Build als Warnung. Erzeugt mit:
  ```sh
  uvx --from fonttools --with brotli pyftsubset static/fonts/titillium-web-v6-latin-regular.woff2 \
    --unicodes="U+0020-007E,U+00A0,U+00A9,U+00C4,U+00D6,U+00DC,U+00DF,U+00E4,U+00F6,U+00FC,U+2013-2014,U+2018-201E,U+2026" \
    --layout-features=kern --flavor=woff2 --output-file=maintenance/fonts/titillium-web-regular.woff2
  ```
  (für `-700` entsprechend). Die Zeichenliste steht auch als `FONT_CHARSET` in
  `scripts/build-maintenance-page.js`.

Die Maus kommt direkt aus `assets/img/maus_question.svg`.
