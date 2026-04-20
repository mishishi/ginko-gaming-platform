const CACHE_NAME = 'ginko-cache-v1';
const STATIC_CACHE = 'ginko-static-v1';
const GAME_CACHE = 'ginko-games-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
];

const MAX_STATIC_ENTRIES = 50;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('ginko-') &&
                   name !== STATIC_CACHE &&
                   name !== GAME_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Static assets: CacheFirst strategy
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Game pages: NetworkFirst strategy
  if (isGamePage(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default: network with cache fallback
  event.respondWith(networkWithCacheFallback(request));
});

// Check if request is for static assets
function isStaticAsset(request) {
  const url = new URL(request.url);
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.ico', '.webmanifest'];
  const staticPaths = ['/_next/static/', '/icons/', '/images/'];

  return (
    staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
    staticPaths.some(path => url.pathname.startsWith(path))
  );
}

// Check if request is for game pages
function isGamePage(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/games/');
}

// CacheFirst strategy for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      // Enforce max entries limit
      enforceMaxEntries(cache, MAX_STATIC_ENTRIES);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    throw error;
  }
}

// NetworkFirst strategy for game pages
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(GAME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    throw error;
  }
}

// Network with cache fallback for other requests
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    throw error;
  }
}

// Enforce max entries limit by removing oldest entries
async function enforceMaxEntries(cache, maxEntries) {
  const keys = await cache.keys();
  if (keys.length >= maxEntries) {
    // Delete oldest entries (first in the list)
    const toDelete = keys.slice(0, keys.length - maxEntries + 1);
    for (const request of toDelete) {
      cache.delete(request);
    }
  }
}
