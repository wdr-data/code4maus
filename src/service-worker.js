/* eslint-env serviceworker */
import {
  cacheNames,
  clientsClaim,
  registerQuotaErrorCallback,
  skipWaiting,
} from 'workbox-core'
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  getCacheKeyForURL,
  precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { RangeRequestsPlugin } from 'workbox-range-requests'

skipWaiting()
clientsClaim()

// Safari requests videos with Range headers, which the precache route cannot
// answer. Registered before it; ignoreSearch matches the revisioned cache keys.
registerRoute(
  /\.mp4$/,
  new CacheFirst({
    cacheName: cacheNames.precache,
    matchOptions: { ignoreSearch: true },
    plugins: [new RangeRequestsPlugin()],
  })
)

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// /teilen und /settings sind eigene Seiten, nicht Teil der Haupt-SPA
// Neu hinzukommende Seiten müssen hier und in entrypoint-rewrite.js gepflegt werden!
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/data\//, /^\/teilen/, /^\/settings/],
  })
)

// Media that is not precached, e.g. assets uploaded by users. The router's
// fetch listener runs before the precache listener, so skip precached URLs.
registerRoute(
  ({ url }) =>
    (url.pathname.startsWith('/data/assets/') ||
      url.pathname.startsWith('/static/assets')) &&
    !getCacheKeyForURL(url.href),
  new CacheFirst({
    cacheName: 'assets',
    plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
  })
)

registerRoute(
  /data\/projects\/[^/]+\/index\.json$/,
  new NetworkFirst({ cacheName: 'projects' })
)

// Report quota errors
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_QUOTA_ERRORS') {
    registerQuotaErrorCallback(() => {
      event.ports[0].postMessage({ type: 'QUOTA_ERROR' })
    })
  }
})
