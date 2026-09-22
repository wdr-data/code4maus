// CloudFront Function (viewer-request) am Default-Behavior, siehe
// EntrypointRewrite in lib/cdk-stack.ts.
//
// Eigenständige HTML-Einstiegspunkte neben der Haupt-App (webpack.config.js,
// customHtmlPlugin mit `filename`). CloudFront hängt bei Unterordnern kein
// index.html an (defaultRootObject gilt nur für "/"), daher werden diese Pfade
// hier intern umgeschrieben; die URL im Browser bleibt unverändert.
//
// Wird 1:1 hochgeladen (nicht gebündelt/übersetzt): nur einfaches JavaScript,
// kein import/export, max. 10 KB.

// eslint-disable-next-line no-unused-vars
function handler(event) {
  var request = event.request
  var pages = {
    '/teilen': '/teilen/index.html',
    '/teilen/': '/teilen/index.html',
    '/settings': '/settings/index.html',
    '/settings/': '/settings/index.html',
    // Neu hinzukommende Seiten müssen hier und in webpack.config.js gepflegt werden!
  }
  if (pages[request.uri]) {
    request.uri = pages[request.uri]
  }
  return request
}
