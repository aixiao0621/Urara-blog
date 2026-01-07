self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Minimal service worker entrypoint for injectManifest. The build will inject
// the precache manifest into this file and emit `service-worker.js` into the
// client output directory.
