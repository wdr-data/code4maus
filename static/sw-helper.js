/* global workbox */
// Handle Range requests from Safari correctly
workbox.routing.registerRoute(
  /\.mp4$/,
  new workbox.strategies.CacheFirst({
    cacheName: workbox.core.cacheNames.precache,
    plugins: [new workbox.rangeRequests.Plugin()],
  })
)

// Report quota errors
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_QUOTA_ERRORS') {
    // eslint-disable-next-line require-await
    workbox.core.registerQuotaErrorCallback(async (_e) => {
      event.ports[0].postMessage({
        type: 'QUOTA_ERROR',
      })
    })
  }
})
