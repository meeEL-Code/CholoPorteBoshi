// ===== Service Worker — Offline Support =====

const CACHE_NAME = 'cpb-v9';
const ASSETS = [
    './',
    './index.html',
    './class.html',
    './subject.html',
    './notes.html',
    './exam.html',
    './progress.html',
    './reader.html',
    './ai.html',
    './edit-profile.html',
    './css/style.css',
    './js/app.js',
    './js/class.js',
    './js/subject.js',
    './js/notes.js',
    './js/exam.js',
    './js/progress.js',
    './js/reader.js',
    './data/subjects.json',
    './data/chapters.json',
    './manifest.json'
];

// Install — cache all core assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                ASSETS.map(url => cache.add(url).catch(() => null))
            );
        }).then(() => self.skipWaiting())
    );
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch — cache first, fallback to network
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                // Cache successful responses dynamically
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            }).catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
