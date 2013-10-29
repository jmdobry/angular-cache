---
sectionHeader: Introduction
sectionName: Introduction
sectionLinkName: introduction
---
## What is angular-cache?
Angular's $cacheFactory is woefully insufficient for the needs of many single-page applications. Angular-cache provides the features necessary for single-page apps to be as efficient at caching as possible.

## $cacheFactory vs $angularCacheFactory

##### $cacheFactory
```javascript
// Angular's $cacheFactory
app.service('myService', function ($cacheFactory) {
    // This is all you can do with $cacheFactory
    $cacheFactory('myNewCache', { capacity: 1000 }); // This cache can hold 1000 items
});
```

##### $angularCacheFactory
```javascript
// Smarter caching with $angularCacheFactory
app.service('myService', function ($angularCacheFactory) {
    $angularCacheFactory('myNewCache', {
        capacity: 1000,  // This cache can hold 1000 items
        maxAge: 900000, // Items added to this cache expire after 15 minutes
        deleteOnExpire: 'aggressive', // Items will be actively deleted when they expire
        cacheFlushInterval: 3600000, // This cache will clear itself every hour
        storageMode: 'localStorage', // This cache will sync itself with localStorage
        storageImpl: myLocalStoragePolyfill, // Custom implementation of localStorage
        verifyIntegrity: true, // Full synchronization with localStorage on every operation
        recycleFreq: 60000, // Frequency for checking the cache for expired items
        onExpire: function (key, value) {
            // This callback is executed when the item specified by "key" expires.
            // At this point you could retrieve a fresh value for "key"
            // from the server and re-insert it into the cache.
        }
     });
});
```