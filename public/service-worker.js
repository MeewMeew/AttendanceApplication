const cacheName = 'attendance-v1'

const cacheClone = async (e) => {
  const res = await fetch(e.request)
  const resClone = res.clone()
  // ignore firebase requests
  if (e.request.url.includes('firebase') ||
    e.request.url.includes('firestore') ||
    e.request.url.includes('googleapis') ||
    e.request.url.includes('gstatic') ||
    e.request.url.includes('google')
  ) return res

  const cache = await caches.open(cacheName)
  await cache.put(e.request, resClone)
  return res
}

self.addEventListener('fetch', (e) => {
  e.respondWith(
    cacheClone(e)
      .catch(() => caches.match(e.request))
      .then((res) => res)
  )
})

self.addEventListener('install', (event) =>
  event.waitUntil(caches.open(cacheName)
    .then((cache) => cache.addAll([
      './']))
    .then(self.skipWaiting())))

self.addEventListener('activate', (event) =>
  event.waitUntil(self.clients.claim()))
