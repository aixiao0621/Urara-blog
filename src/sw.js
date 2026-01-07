self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Minimal service worker for injectManifest; precache manifest will be injected by the
// PWA plugin during build. No runtime caching configured here (add if needed).
