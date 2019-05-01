// Report quota errors
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_QUOTA_ERRORS') {
        workbox.core.registerQuotaErrorCallback(async (e) => {
            event.ports[0].postMessage({
                type: 'QUOTA_ERROR',
            });
        });
    }
});
