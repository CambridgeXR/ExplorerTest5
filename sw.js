const CACHE_NAME = "vr-explorer-v4";
const ASSETS_TO_CACHE = [
  "/ExplorerTest5/",
  "/ExplorerTest5/index.html",
  "/ExplorerTest5/manifest.json",
  "/ExplorerTest5/icons/icon-192.png",
  "/ExplorerTest5/icons/icon-512.png",
  "/ExplorerTest5/icons/icon-maskable-192.png",
  "/ExplorerTest5/icons/icon-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key!==CACHE_NAME).map(key=>caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(resp => { caches.open(CACHE_NAME).then(c=>c.put(event.request, resp.clone())); return resp; })
      .catch(() => caches.match(event.request))
  );
});
