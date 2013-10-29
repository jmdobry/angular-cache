---
sectionHeader: '.keys()'
sectionName: '&emsp;.keys()'
sectionLinkName: factorykeys
---
## Description
Return an array of the cacheIds of all caches in `$angularCacheFactory`.

## Usage

```javascript
$angularCacheFactory.keys();
```

<a name='angularcache'></a>
## AngularCache
__Description:__ Object produced by invocations of `$angularCacheFactory(cacheId, options)`. [AngularCache](http://jmdobry.github.io/angular-cache/docs/AngularCache.html) API documentation.

#### _setOptions(options, strict)_
__Description:__ Dynamically configure the cache. See [Configuration Options](#configuration). [AngularCache#setOptions](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#setOptions) API documentation.

#### _put(key, value, options)_
__Description:__ Add a key-value pair to the cache. [AngularCache#put](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#put) API documentation.

#### _get(key, options)_
__Description:__ Retrieve the item from the cache with the specified key. [AngularCache#get](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#get) API documentation.

#### _info(key)_
__Description:__ Returns an object containing information about the cache or the item with the specified key. [AngularCache#info](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#info) API documentation.

#### _remove(key, options)_
__Description:__ Remove the item with the specified key from the cache. [AngularCache#remove](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#remove) API documentation.

#### _removeAll()_
__Description:__ Clear the cache. [AngularCache#removeAll](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#removeAll) API documentation.

#### _destroy()_
__Description:__ Completely destroy the cache. [AngularCache#destroy](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#destroy) API documentation.

#### _removeExpired(options)_
__Description:__ Remove all expired items from the cache. [AngularCache#removeExpired](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#removeExpired) API documentation.

#### _keySet()_
__Description:__ Return the set of keys of all items in the cache. [AngularCache#keySet](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#keySet) API documentation.

#### _keys()_
__Description:__ Return an array of the keys of all items in the cache. [AngularCache#keys](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#keys) API documentation.

<a name='configuration'></a>
## Configuration Options
__Description:__ Available configuration options for use with [$angularCacheFactoryProvider.setCacheDefaults(options)](http://jmdobry.github.io/angular-cache/docs/$AngularCacheFactoryProvider.html#setCacheDefaults), [$angularCacheFactory(cacheId, options)](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html), and [AngularCache.setOptions(options, strict)](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#setOptions).

#### storageMode
__Type:__ String

__Default:__ `"none"`

__Possible Values__:
- `"none"` - The cache will not sync itself with web storage.
- `"localStorage"` - Sync with `localStorage`
- `"sessionStorage"` - Sync with `sessionStorage`

__Description:__ Configure the cache to sync itself with `localStorage` or `sessionStorage`. The cache will re-initialize itself from `localStorage` or `sessionStorage` on page refresh.

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    storageMode: 'localStorage'
}); // this cache will sync itself to localStorage
```

See [Using angular-cache with localStorage](#using-angular-cache-with-localStorage).

#### storageImpl
__Type:__ Object

__Default:__ `null`

__Description:__ When `storageMode` is set to `"localStorage"` or `"sessionStorage"` angular-cache will default to using the global `localStorage` and `sessionStorage` objects. The angular-cache `storageImpl` and `sessionStorageImpl` configuration parameters allow you to tell angular-cache which implementation of `localStorage` or `sessionStorage` to use. This is useful when you don't want to override the global storage objects or when using angular-cache in a browser that doesn't support `localStorage` or `sessionStorage`.

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    storageImpl: mystorageImplementation,
    storageMode: 'localStorage'
});

$angularCacheFactory('otherCache', {
    storageImpl: mySessionStorageImplementation,
    storageMode: 'sessionStorage'
});
```

__Note:__ If angular-cache doesn't detect a global `localStorage` or `sessionStorage` and you don't provide a polyfill, then syncing with web storage will be disabled. It is up to the developer to provide a polyfill for browsers that don't support `localStorage` and `sessionStorage`. Any implementation of `localStorage` and `sessionStorage` provided to angular-cache must implement at least the `setItem`, `getItem`, and `removeItem` methods.

See [Using angular-cache with localStorage](#using-angular-cache-with-localStorage).

#### maxAge
__Type:__ Number

__Default:__ `null`

__Description:__ Set a default maximum lifetime on all items added to the cache. They will be removed aggressively or passively or not at all depending on the value of `deleteOnExpire` (see below). Can be configured on a per-item basis for greater specificity.

__Usage:__
```javascript
$angularCacheFactory('newCache', { maxAge: 3600000 });
```

#### deleteOnExpire
__Type:__ String

__Default:__ `"none"`

__Possible Values:__
- `"none"` - Items will not be removed from the cache even if they have expired.
- `"passive"` - Items will be deleted if they are requested after they have expired, resulting in a miss.
- `"aggressive"` - Items will be deleted as soon as they expire.

__Description:__ `maxAge` must be set in order for `"passive"` or `"aggressive"` to have any effect. Can be configured on a per-item basis for greater specificity.

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    maxAge: 3600000,
    deleteOnExpire: 'aggressive'
});
```

#### cacheFlushInterval
__Type:__ Number

__Default:__ `null`

__Description:__ Set the cache to periodically clear itself.

__Usage:__
```javascript
$angularCacheFactory('newCache', { cacheFlushInterval: 57908 });
```

#### verifyIntegrity
__Type:__ Boolean

__Default:__ false

__Description:__ Specify whether to verify integrity of data saved in `localStorage` on every operation. If true, angular-cache will perform a full sync with `localStorage` on every operation. Increases reliability of data synchronization, but may incur a performance penalty. Has no effect if `storageMode` is set to "none".

__Usage:__
```javascript
$angularCacheFactory('newCache', { cacheFlushInterval: 57908 });
```

#### recycleFreq
__Type:__ Number

__Default:__ 1000

__Description:__ How often the cache should check for expired items. Only used when `maxAge` is set.

__Usage:__
```javascript
$angularCacheFactory('newCache', { cacheFlushInterval: 57908 });
```

#### onExpire
__Type:__ Function

__Default:__ `null`

__Description:__ A callback function to be executed when an item expires.

###### Using 'onExpire' in passive delete mode
In passive delete mode the cache doesn't know if an item has expired until the item is requested, at which point the cache checks to see if the item has expired. If the item has expired then it is immediately removed from the cache, resulting in a "miss".

If you specify a global "onExpire" callback function, the cache will execute this function when it is discovered the item has expired, passing to the callback the key and value of the expired item.

When you actually request the expired item via `myCache.get('someKey')` you can also pass a second argument to `get()` specifying a callback that your cache's "onExpire" callback can execute when it finishes. For example:

__Usage:__
```javascript
var newCache = $angularCacheFactory('newCache', {
    maxAge: 1000, // Items expire after 1 second, but we don't know it until the item is requested
    onExpire: function (key, value, done) {
        // "onExpire" callback for the cache.
        // The third optional parameter "done", is the second argument passed to `get()` as described above

        console.log(key + ' expired!');
        // Retrieve fresh value for "key" from server, of course you'll need to figure out
        // what the url is if key != url
        $http.get(key).success(function (data) {
            $angularCacheFactory.get('newCache').put(key, data);
            done(data); // Execute the "done" callback specified in the `get()` call
        });
    });
});

newCache.put('denver', 'broncos');

// wait a few seconds

var value = newCache.get('denver', function (value) {
    // here value is defined, because we retrieved it from the server
});
// here value is undefined because the item with
// the key "denver" has expired and was deleted from the
// cache when we requested it. The callback passed to
// "get()" will receive the new value for 'denver' which
// will be retrieved from the server. This callback
// is the "done" callback executed by the "onExpire"
// callback specified when we created the cache.
```

Another usage:
```javascript
// We don't specify an "onExpire" callback for this cache
var newCache = $angularCacheFactory('newCache', {
    maxAge: 1000, // Items expire after 1 second, but we don't know it until the item is requested
});

newCache.put('denver', 'broncos');

// wait a few seconds

// In this cache the callback is immediately executed when
// the cache discovers that 'denver' has expired, and the
// callback is passed the key and value of the expired item.
// Here you could retrieve a new value for 'denver' from
// the server or decide to keep the old value and re-insert
// it into the cache. Specifying an "onExpire" callback for
// the cache is a good way to stay DRY.
var value = newCache.get('denver', function (key, value) {
    if (isGoodThisYear(key, value)) {
        newCache.put(key, value);
    } else {
        $http.get(key).success(function (data) {
            newCache.put(key, data);
        });
    }
});
```

###### Using 'onExpire' in aggressive delete mode
In aggressive delete mode you can't pass a second parameter to `get()` because your "onExpire" callback for the cache has already been executed for expired items.

__Usage:__
```javascript
var newCache = $angularCacheFactory('newCache', {
    maxAge: 1000, // Items expire after 1 second and are immediately deleted
    onExpire: function (key, value) {
        // "onExpire" callback for the cache.
        // The third optional parameter "done", is the second argument passed to `get()` as described above

        console.log(key + ' expired!');
        // Retrieve fresh value for "key" from server, of course you'll need to figure out
        // what the url is if key != url
        $http.get(key).success(function (data) {
            $angularCacheFactory.get('newCache').put(key, data);
        });
    });
});

newCache.put('denver', 'broncos');

// wait a few seconds, during which time the "onExpire" callback is automatically executed

newCache.get('denver'); // 'broncos' or whatever was returned by the server in the "onExpire" callback
```