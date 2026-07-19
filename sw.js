const CACHE_NAME = 'organigrama-lad-v1.0.2'; // 👈 SUBE ESTE NÚMERO CADA VEZ QUE HAGAS UN CAMBIO EN TU CÓDIGO

// Archivos principales que se guardan para que funcione sin internet
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './logo.jpeg'
];

// INSTALACIÓN: Guardar archivos base en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // Forzar activación inmediata
    );
});

// ACTIVACIÓN: Borrar cachés viejas automáticamente
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName); // Elimina versiones anteriores
                    }
                })
            );
        }).then(() => self.clients.claim()) // Toma el control inmediatamente
    );
});

// FETCH (LA MAGIA): Red primero, Caché de respaldo
self.addEventListener('fetch', event => {
    // Ignorar peticiones que no sean GET (como POST a APIs)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request) // 1. Intenta buscar la versión nueva en GitHub
            .then(response => {
                // Si la respuesta es válida, guárdala en caché y devuélvela
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // 2. Si NO HAY INTERNET, busca en la caché
                return caches.match(event.request);
            })
    );
});