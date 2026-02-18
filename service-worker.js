// S32 (Secretaria 24/7) - Service Worker simples e seguro para GitHub Pages
const CACHE_NAME = "s32-cache-v1";

// Atenção: como seu site está em /meu-site/, usamos caminhos absolutos com esse prefixo.
const BASE = "/meu-site";

const ASSETS_TO_CACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/manifest.json`,
  // Ícones (quando você subir a pasta /assets)
  `${BASE}/assets/icon-192.png`,
  `${BASE}/assets/icon-512.png`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Só intercepta requests GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Só cacheia respostas válidas
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Se estiver offline e não achou no cache, volta para a home
          return caches.match(`${BASE}/`);
        });
    })
  );
});
