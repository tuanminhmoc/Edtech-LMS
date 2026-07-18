'use strict';

const APP_VERSION = '1.4.8';
const CACHE_NAME = `edtech-lms-pro-${APP_VERSION}`;
const RUNTIME_CACHE = `edtech-lms-runtime-${APP_VERSION}`;
const BASE = new URL('./', self.location.href);
const LOCAL_ASSETS = [
  './',
  './index.html',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/dashboard.css',
  './css/practice.css',
  './css/flashcard.css',
  './css/creator.css',
  './css/library.css',
  './css/history.css',
  './css/mobile.css',
  './css/themes.css',
  './js/database.js',
  './js/recovery.js',
  './js/lazy-libs.js',
  './js/worker-client.js',
  './js/workers/data-worker.js',
  './js/audio-manager.js',
  './js/theme.js',
  './js/router.js',
  './js/backup.js',
  './js/diagnostics.js',
  './js/accessibility.js',
  './js/pwa.js',
  './js/core.js',
  './js/app.js',
  './manifest.webmanifest',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/EdTech-LMS-Pro.ico',
  './assets/images/donate-qr.png',
  './assets/brand/intro/intro-stars-1536.webp',
  './assets/cursors/owl-cursor-v2.svg',
  './assets/cursors/owl-pointer-v2.svg',
  './assets/brand/mascots-vector/study.svg',
  './assets/brand/mascots-vector/read.svg',
  './assets/brand/mascots-vector/focus.svg',
  './assets/brand/mascots-vector/idea.svg',
  './assets/brand/mascots-vector/search.svg',
  './assets/brand/mascots-vector/warning.svg',
  './assets/brand/mascots-vector/success.svg',
  './downloads/Install EdTech LMS Pro.cmd'
].map(path => new URL(path, BASE).href);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(LOCAL_ASSETS)).catch(error => console.warn('Precache incomplete:', error)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('edtech-lms-') && ![CACHE_NAME, RUNTIME_CACHE].includes(key)).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

function isNavigation(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}

function isLocal(url) {
  return url.origin === self.location.origin && url.pathname.startsWith(BASE.pathname);
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (isNavigation(request)) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(new URL('./index.html', BASE).href, response.clone());
        return response;
      } catch (_) {
        return (await caches.match(new URL('./index.html', BASE).href)) || (await caches.match(new URL('./', BASE).href));
      }
    })());
    return;
  }

  if (isLocal(url)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const network = fetch(request).then(async response => {
        if (response.ok) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
        return response;
      }).catch(() => null);
      return cached || (await network) || new Response('', { status: 504, statusText: 'Offline' });
    })());
    return;
  }

  if (/cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.hostname)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) (await caches.open(RUNTIME_CACHE)).put(request, response.clone());
      return response;
    })());
  }
});
