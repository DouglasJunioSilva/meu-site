const CACHE_NAME = "s32-cache-v1";
const urlsToCache = [
  "/meu-site/",
  "/meu-site/index.html",
  "/meu-site/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
