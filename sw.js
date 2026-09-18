/**
 * Daily Intentionality Scheduler — Service Worker
 * v6 — fixes "Response served by service worker has redirections" on
 * iPadOS Safari. Three-part fix:
 *   1. cleanResponse() strips the redirected flag by rebuilding a fresh,
 *      non-redirected Response before anything is cache.put().
 *   2. Every fetch() explicitly declares { redirect: 'follow' }.
 *   3. Navigations are served the precached app shell directly instead of
 *      matched by exact URL — sidesteps redirect-prone root-path /
 *      trailing-slash navigation entirely.
 */

const CACHE_VERSION = 'v10';
const CACHE_NAME = `dis-static-${CACHE_VERSION}`;
const APP_SHELL_URL = './index.html';

const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './scheduler.js',
  './app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './fonts/pixelify-sans-400.woff2',
  './fonts/pixelify-sans-500.woff2',
  './fonts/pixelify-sans-700.woff2',
  './assets/dirt.svg',
  './assets/stone.svg',
  './assets/grass-top.svg',
  './assets/grass-side.svg',
  './assets/gold.svg'
];

/**
 * Rebuilds a Response as a fresh, non-redirected object. `Response.redirected`
 * is read-only and set internally whenever a request followed one or more
 * HTTP redirects — it can't be unset on the same object, only reconstructed
 * from its body/status/headers. Anything handed to cache.put() goes through
 * here first.
 */
async function cleanResponse(response) {
  if (!response || !response.redirected) return response;
  const body = await response.blob();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

/** Fetches one asset and writes a redirect-safe copy into the given cache. */
async function precacheAsset(cache, url) {
  const response = await fetch(url, { redirect: 'follow', cache: 'reload' });
  if (!response.ok) throw new Error(`Precache failed for ${url}: ${response.status}`);
  const safeResponse = await cleanResponse(response.clone());
  await cache.put(url, safeResponse);
}

// --- Install: pre-warm the cache with the full app shell, redirect-safe ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => Promise.all(STATIC_ASSETS.map((url) => precacheAsset(cache, url))))
      .then(() => self.skipWaiting())
  );
});

// --- Activate: drop any stale cache buckets from a previous version --------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('dis-static-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// --- Fetch: cache-first, redirect-safe, with a dedicated navigation path ---
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // Navigations (page loads, and critically, Home Screen PWA launches)
  // always resolve to the precached app shell first — this is what
  // actually prevents the redirect error.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(APP_SHELL_URL).then((shell) => {
        if (shell) return shell;
        return fetch(request, { redirect: 'follow' })
          .then((response) => cleanResponse(response))
          .catch(() => caches.match(APP_SHELL_URL));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request, { redirect: 'follow' })
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            const safeResponse = await cleanResponse(networkResponse.clone());
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, safeResponse);
          }
          return networkResponse;
        })
        .catch(() => new Response('', { status: 504, statusText: 'Offline and not cached' }));
    })
  );
});

// --- Push notifications: 15-minute pre-task alerts --------------------------
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Task starting soon';
  const options = {
    body: data.body || 'Your next block starts in 15 minutes.',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: data.taskId || 'dis-reminder'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientsArr) => {
      const existing = clientsArr.find((c) => c.url.includes('index.html'));
      if (existing) return existing.focus();
      return self.clients.openWindow('./index.html');
    })
  );
});