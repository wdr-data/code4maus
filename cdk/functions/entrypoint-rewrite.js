// CloudFront Function (viewer-request) am Default-Behavior, siehe
// EntrypointRewrite in lib/cdk-stack.ts. Läuft nur für Requests, die beim
// App-Bucket landen; /api/* und /data/* haben eigene Behaviors.
//
// Aufgabe: entscheiden, ob ein Pfad eine Datei im App-Bucket meint oder eine
// Seite. Seiten bekommen die passende index.html, ohne dass sich die URL im
// Browser ändert. Dadurch braucht die Distribution keine errorResponses mehr,
// die sonst auch Fehler von /api/* und /data/* verschlucken würden.
//
// Die Dateiliste ist bewusst eine Allowlist: Alles Unbekannte gilt als Seite
// und landet in der App (dort greift die "Upps!"-Seite), nicht als roher
// S3-Fehler. Kommt eine neue Datei ins Wurzelverzeichnis (robots.txt,
// manifest.json, /.well-known/...), muss sie hier ergänzt werden.
//
// Wird 1:1 hochgeladen (nicht gebündelt/übersetzt): nur einfaches JavaScript,
// kein import/export, max. 10 KB. Runtime 2.0, daher sind startsWith/endsWith
// verfügbar.

// eslint-disable-next-line no-unused-vars
function handler(event) {
  var request = event.request
  var uri = request.uri

  // Eigenständige Seiten mit eigener index.html (webpack.config.js,
  // customHtmlPlugin mit `filename`). Neue Seiten hier, in webpack.config.js
  // und in der navigateFallbackDenylist des Service Workers ergänzen.
  var pages = {
    '/teilen': '/teilen/index.html',
    '/teilen/': '/teilen/index.html',
    '/settings': '/settings/index.html',
    '/settings/': '/settings/index.html',
  }
  if (pages[uri]) {
    request.uri = pages[uri]
    return request
  }

  // Dateien unverändert an S3 durchreichen:
  // - alle Assets unter /static/
  // - gehashte Bundles und Sourcemaps im Wurzelverzeichnis (inkl.
  //   service-worker.js und workbox-*.js aus dem Produktions-Build)
  // - die HTML-Dateien selbst, damit /teilen/index.html direkt aufrufbar
  //   bleibt (solche Links sind bereits im Umlauf)
  // - die wenigen festen Dateien im Wurzelverzeichnis
  if (
    uri.startsWith('/static/') ||
    uri.endsWith('.js') ||
    uri.endsWith('.map') ||
    uri.endsWith('.html') ||
    uri === '/favicon.png'
  ) {
    return request
  }

  // Alles andere ist eine Route der Haupt-App.
  request.uri = '/index.html'
  return request
}
