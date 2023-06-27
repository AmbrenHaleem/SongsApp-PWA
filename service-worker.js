const cacheName = 'cacheAssets';

/**
 * On install event 
 * Triggered when the service worker is installed
 */
self.addEventListener('install', function(event){
    //console.log('[Service Worker] Install!! :' , event);
    self.skipWaiting();
    console.log(caches);
    event.waitUntil(
    caches.open(cacheName)
        .then(function(cache) {
            console.log(cache);
        
            return cache.addAll([
                '/',
                '/index.html',
                '/images/logo.png',
                '/css/style.css',
                '/js/scripts.js',
                '/js/music-db/music-db.js',
                '/manifest.json',
                '/icons/favicon-32x32.png',
                '/icons/favicon-16x16.png',
                '/icons/android-chrome-192x192.png',
                //'https://jsonplaceholder.typicode.com/posts'
            ]);
        })
    );
});
    

/**
 * On Activate Event
 * Triggered when the service worker is activated
 */
self.addEventListener('activate', function(event){
    //console.log('[Service worker] Activate:',event);
    event.waitUntil(clients.claim());

    //Delete the old version of cache
    event.waitUntil(
        caches.keys()
        .then(function(cacheNames){
            return Promise.all(
                cacheNames
                .filter(item => item != cacheName)
                .map(item => caches.delete(item))
            )
        })
    );
});

/**
 * On Fetch Event
 * Triggered when the service worker retrieves an asset
 */
self.addEventListener('fetch',function(event){
    //Cache strategy: Stale While Revalidate
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.open(cacheName)
            .then(function(cache){
                return cache.match(event.request)
                .then(function(cachedResponse){
                    const fetchedResponse = fetch(event.request)
                    .then(function(networkResponse){
                        cache.put(
                            event.request,
                            networkResponse.clone()
                        );
                        return networkResponse;
                    })
                    .catch(function(){
                        console.log("Sorry! the page is not available offline.")
                    })
                    return cachedResponse || fetchedResponse;
                });
            })
        );
    }
    //Cache strategy: Cache Only
    // event.respondWith(
    //     caches.open(cacheName)
    //     .then(function (cache){
    //         return cache.match(event.request)
    //         .then(function(response) {
    //             return response;
    //         })
    //     })
    // );

    //Cache strategy: Network only
    // event.respondWith(
    //     fetch(event.request)
    //         .then(function(response) {
    //             return response;
    //         })
    //     )
    // });

    // //Cache strategy: Cache with network fallback
    // event.respondWith(
    //     caches.open(cacheName)
    //     .then(function (cache){
    //         return cache.match(event.request)
    //         .then(function(response) {
    //             return response || fetch(event.request);
    //         })
    //     })
    // );

    // //Cache strategy: Network with cache fallback
    // event.respondWith(
    //     fetch(event.request)
    //     .then(function(response){
    //         return response
    //     })
    //     .catch(function(){
    //         return caches.open(cacheName)
    //         .then(function(cache){
    //             return cache.match(event.request)
    //         })
    //     })
    // );
});

