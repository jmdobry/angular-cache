---
sectionHeader: Introduction
sectionName: Introduction
sectionLinkName: introduction
gfm: true
index: 1
---
## What is angular-cache?
Angular-cache is a feature-packed drop-in replacement for Angular's $cacheFactory. $cacheFactory is small and useful, but it's missing many needed features that today's single-page apps require. Check it out:

## $cacheFactory vs $angularCacheFactory

##### $cacheFactory
```javascript
// Angular's $cacheFactory
app.service('myService', function ($cacheFactory) {

    // This is the extent of $cacheFactory's configuration
    $cacheFactory('myNewCache', {

        // This cache can hold 1000 items
        capacity: 1000
    });

});
```

##### $angularCacheFactory
```javascript
// Smarter caching with $angularCacheFactory
app.service('myService', function ($angularCacheFactory) {

    $angularCacheFactory('myNewCache', {

        // This cache can hold 1000 items
        capacity: 1000,

        // Items added to this cache expire after 15 minutes
        maxAge: 900000,

        // Items will be actively deleted when they expire
        deleteOnExpire: 'aggressive',

        // This cache will check for expired items every minute
        recycleFreq: 60000,

        // This cache will clear itself every hour
        cacheFlushInterval: 3600000,

        // This cache will sync itself with localStorage
        storageMode: 'localStorage',

        // Custom implementation of localStorage
        storageImpl: myLocalStoragePolyfill,

        // Full synchronization with localStorage on every operation
        verifyIntegrity: true,

        // This callback is executed when the item specified by "key" expires.
        // At this point you could retrieve a fresh value for "key"
        // from the server and re-insert it into the cache.
        onExpire: function (key, value) {

        }
     });

});
```