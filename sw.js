/* TradeInsight PWA：访问过的同域资源会进缓存，便于弱网或再次打开 */
const CACHE = "tradeinsight-pwa-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        cache.addAll([
          "./",
          "./index.html",
          "./manifest.webmanifest",
          "./assets/pwa/icon.svg",
          "./assets/fontawesome/css/all.min.css",
        ])
      )
      .catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        try {
          const copy = response.clone();
          if (response.ok && response.type === "basic") {
            caches.open(CACHE).then((c) => c.put(event.request, copy));
          }
        } catch (_) {}
        return response;
      });
    })
  );
});
