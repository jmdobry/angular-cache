---
sectionHeader: Angular-cache w/Web Storage
sectionName: Angular-cache w/Web Storage
sectionLinkName: storage
gfm: true
index: 3
---
#### Using angular-cache with localStorage (or sessionStorage)
Using angular-cache in browsers that support localStorage:
```javascript
app.service('myService', function ($angularCacheFactory) {

    // This cache will sync itself with localStorage if it exists, otherwise it won't. Every time the
    // browser loads this app, this cache will attempt to initialize itself with any data it had
    // already saved to localStorage (or sessionStorage if you used that).
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 3600000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage' // This cache will sync itself with `localStorage`.
    });
});
```

Using angular-cache in browsers that DON'T support localStorage:

Option 1 - Do nothing (the localStorage sync feature will be disabled)

Option 2 - Create/use a polyfill that provides the global `localStorage` and `sessionStorage` objects. angular-cache will attempt to use these if it finds them.

Option 3 - Tell angular-cache exactly which polyfill to use (also useful if you just want to use your own implementation/wrapper for localStorage):
```javascript
app.service('myService', function ($angularCacheFactory) {

    var localStoragePolyfill = {
        getItem: function (key) { ... },
        setItem: function (key, value) { ... },
        removeItem: function (key) { ... }
    };

    // Always use the polyfill
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 3600000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage', // This cache will sync itself with `localStorage`.
        storageImpl: localStoragePolyfill // angular-cache will use this polyfill instead of looking for localStorage
    });

    // Conditionally use the polyfill
    var options = {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 3600000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage' // This cache will sync itself with `localStorage`.
    };
    if (!window.localStorage) {
        options.storageImpl = localStoragePolyfill;
    }
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', options);
});
```

Documentation on the interface that must be implemented by any `storageImpl` polyfill used by angular-cache can be found on the [W3C Recommendation](http://www.w3.org/TR/2013/REC-webstorage-20130730/) page for webstorage. The interface itself looks like:
```java
interface Storage {
  readonly attribute unsigned long length;
  DOMString? key(unsigned long index);
  getter DOMString getItem(DOMString key);
  setter creator void setItem(DOMString key, DOMString value);
  deleter void removeItem(DOMString key);
  void clear();
};
```

angular-cache cares only about these three methods:
- [setItem](http://www.w3.org/TR/2013/REC-webstorage-20130730/#dom-storage-setitem)
- [getItem](http://www.w3.org/TR/2013/REC-webstorage-20130730/#dom-storage-getitem)
- [removeItem](http://www.w3.org/TR/2013/REC-webstorage-20130730/#dom-storage-removeitem)

One developer suggested using [store.js](https://github.com/marcuswestin/store.js/)–a wrapper and polyfill for localStorage. However, store.js has its own API that doesn't match that of the webstorage spec, so if you want to use store.js or any other 3rd-party polyfill then you'll need to create a wrapper for it if it doesn't have the same API as `localStorage`. For example:
```javascript
var storeJsToStandard {
  getItem: store.get,
  setItem: store.set,
  removeItem: store.remove
};

$angularCacheFactory('myNewCache', {
  storageMode: 'localStorage',
  storageImpl: storeJsToStandard
});
```