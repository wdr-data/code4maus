// CloudFront Function (viewer-request) für /api/* und /data/*, siehe
// MaintenanceBlock in lib/cdk-stack.ts. Sie wird nur an die Behaviors gehängt,
// wenn der Wartungsmodus aktiv ist, und braucht deshalb keine eigene Prüfung.
//
// Zweck: Während der Wartung sollen weder Schreibzugriffe über die API noch
// Lesezugriffe auf Projekte und Assets durchgehen. Der Marker `x-maintenance`
// macht die Antwort von einem zufälligen 503 aus AWS unterscheidbar.
//
// BYPASS_TOKEN wird beim Synth vorangestellt (lib/cdk-stack.ts). Das Cookie
// setzt die Seiten-Function über `?bypass=<token>`.

/* global BYPASS_TOKEN */

// eslint-disable-next-line no-unused-vars
function handler(event) {
  var request = event.request
  var cookies = request.cookies

  if (
    BYPASS_TOKEN &&
    cookies &&
    cookies.pmdm_bypass &&
    cookies.pmdm_bypass.value === BYPASS_TOKEN
  ) {
    return request
  }

  return {
    statusCode: 503,
    statusDescription: 'Service Unavailable',
    headers: {
      'content-type': { value: 'application/json; charset=utf-8' },
      'cache-control': { value: 'no-store' },
      'x-maintenance': { value: '1' },
      'retry-after': { value: '3600' },
    },
    body: { encoding: 'text', data: '{"error":"maintenance"}' },
  }
}
