
const CACHE_NAME = 'jw-meetings-v1-20260928';
const ASSETS = [
  './',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    // cache html
    if(e.request.method==='GET' && e.request.url.includes('.html') || e.request.destination==='document'){
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request, clone));
    }
    return resp;
  })).catch(()=>caches.match('./')));
});
