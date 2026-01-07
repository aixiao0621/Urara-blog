import { generateSW } from 'workbox-build';
import path from 'path';

const clientDir = path.resolve('.svelte-kit/output/client');
const swDest = path.join(clientDir, 'service-worker.js');

(async () => {
  try {
    console.log('[sw] generating service worker...');
    const { count, size, warnings } = await generateSW({
      swDest,
      globDirectory: clientDir,
      globPatterns: ['**/*.{js,css,html,svg,ico,png,webp,avif,json}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      skipWaiting: true,
      clientsClaim: true
    });

    warnings.forEach(w => console.warn('[sw] warning:', w));
    console.log(`[sw] generated ${swDest}, ${count} files, ${size} bytes`);
  } catch (err) {
    console.error('[sw] failed to generate service worker', err);
    process.exit(1);
  }
})();
