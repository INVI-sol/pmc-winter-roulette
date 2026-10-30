const CACHE='pmc-github-v5-'+self.registration.scope;const ASSETS=['./','index.html','manifest.webmanifest'];
async function prepare(){const c=await caches.open(CACHE);await c.addAll(ASSETS)}
self.addEventListener('install',e=>e.waitUntil(prepare().then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim().then(async()=>{for(const key of await caches.keys())if(key.endsWith(self.registration.scope)&&key!==CACHE)await caches.delete(key)})));
self.addEventListener('message',e=>{if(e.data==='CHECK_CACHE')e.waitUntil((async()=>{try{const c=await caches.open(CACHE);const all=await Promise.all(ASSETS.map(p=>c.match(p)));if(all.some(x=>!x))await prepare();e.source?.postMessage('OFFLINE_READY')}catch{e.source?.postMessage('OFFLINE_FAILED')}})())});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin)return;e.respondWith((async()=>{const c=await caches.open(CACHE);if(e.request.mode==='navigate'){try{return await fetch(e.request)}catch{return await c.match('./')||await c.match('index.html')}}return await c.match(e.request)||fetch(e.request)})())});
