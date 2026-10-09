const CACHE_PREFIX = "tag-scout-shell-";
const CACHE = `${CACHE_PREFIX}v2`;
const ASSETS = ["./", "./index.html", "./manifest.json"]
  .map(path => new URL(path, self.registration.scope).href);
const OFFLINE_PAGE = new URL("./index.html", self.registration.scope).href;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Bypass the HTTP cache so an update installs a fresh, complete app shell.
    await cache.addAll(ASSETS.map(url => new Request(url, { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function matchCached(request) {
  try {
    const cache = await caches.open(CACHE);
    return await cache.match(request);
  } catch {
    // Storage may be unavailable; the network can still serve the request.
    return undefined;
  }
}

async function fetchAndCache(request, options) {
  const response = await fetch(request, options);
  if (response.ok && response.type === "basic") {
    try {
      const cache = await caches.open(CACHE);
      // Keep the write inside respondWith's promise so it finishes before
      // the worker can stop. A storage failure must not discard the response.
      await cache.put(request, response.clone());
    } catch {
      // Caching is best effort when storage is full or unavailable.
    }
  }
  return response;
}

async function navigationResponse(request) {
  try {
    // Revalidate with the server instead of serving stale navigation HTML.
    return await fetchAndCache(request, { cache: "no-cache" });
  } catch {
    return (await matchCached(request)) ||
      (await matchCached(OFFLINE_PAGE)) || Response.error();
  }
}

async function assetResponse(request) {
  const cached = await matchCached(request);
  if (cached) return cached;
  try {
    return await fetchAndCache(request);
  } catch {
    // Never substitute HTML for a failed script, image, or other asset.
    return Response.error();
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin ||
      request.headers.has("range")) return;

  event.respondWith(request.mode === "navigate"
    ? navigationResponse(request)
    : assetResponse(request));
});
