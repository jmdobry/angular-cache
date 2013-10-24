# angular-cache
#### A very useful replacement for Angular's $cacheFactory.
#### Version: 2.0.0

<a name='status'></a>
## Status
| Version | Branch  | Build status                                                                                                                                                              | Test Coverage | Code Climate |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | -------- |
| 2.0.0   | [master](https://github.com/jmdobry/angular-cache)  | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=master)](https://travis-ci.org/jmdobry/angular-cache) | [Test Coverage](http://jmdobry.github.io/angular-cache/coverage/) | [![Code Climate](https://codeclimate.com/github/jmdobry/angular-cache.png)](https://codeclimate.com/github/jmdobry/angular-cache) |
| 2.0.1-SNAPSHOT   | [develop](https://github.com/jmdobry/angular-cache/tree/develop) | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=develop)](https://travis-ci.org/jmdobry/angular-cache) |  |   |

1. [Installation](#installation).
1. [Demo](http://jmdobry.github.io/angular-cache/demo/).
1. [Documentation](#documentation).
1. [Mailing list](https://groups.google.com/forum/#!forum/angular-cache).
1. [Changelog](https://github.com/jmdobry/angular-cache/blob/master/CHANGELOG.md)
1. [Contributing Guide](https://github.com/jmdobry/angular-cache/blob/master/CONTRIBUTING.md)
1. See [TRANSITION.md](https://github.com/jmdobry/angular-cache/blob/master/TRANSITION.md) for upgrading from 1.x.x to 2.x.x.
1. [License](#license)

<a name='installation'></a>
## Installation
`bower install angular-cache` or download angular-cache from [Downloads](https://github.com/jmdobry/angular-cache/releases).

Angular-cache must be loaded _after_ `angular.js`. Load angular-cache into your angular app via `angular.module('myApp', ['jmdobry.angular-cache']);`.

<a name='documentation'></a>
## Documentation
1. [Demo](http://jmdobry.github.io/angular-cache/demo/)
1. [$angularCacheFactoryProvider](#angularcachefactoryprovider)
1. [$angularCacheFactory](#angularcachefactory)
1. [AngularCache](#angularcache)
1. [Configuration Options](#configuration)
1. [Usage Patterns](#usage)

### $cacheFactory vs $angularCacheFactory

##### $cacheFactory
```javascript
// Angular's provided $cacheFactory
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

<a name='angularcachefactoryprovider'></a>
## $angularCacheFactoryProvider
__Description:__ Provider for `$angularCacheFactory`. [$angularCacheFactoryProvider](http://jmdobry.github.io/angular-cache/docs/$AngularCacheFactoryProvider.html) API documentation.

#### _setCacheDefaults()_
__Description:__ Set the default configuration for all caches created by `$angularCacheFactory`. [$angularCacheFactoryProvider#setCacheDefaults](http://jmdobry.github.io/angular-cache/docs/$AngularCacheFactoryProvider.html#setCacheDefaults) API documentation.

<a name='angularcachefactory'></a>
## $angularCacheFactory
__Description:__ Produces instances of  `AngularCache`. [$angularCacheFactory](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html) API documentation.

#### _$angularCacheFactory(cacheId, options)_
__Description:__ Create a new cache with the given cacheId and configuration options. See [Configuration Options](#configuration). [$angularCacheFactory](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html) API documentation.

#### _get(cacheId)_
__Description:__ Return the cache with the specified cacheId. [$angularCacheFactory#get](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#get) API documentation.

#### _clearAll()_
__Description:__ Clears the contents of every cache owned by `$angularCacheFactory`. [$angularCacheFactory#clearAll](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#clearAll) API documentation.

#### _removeAll()_
__Description:__ Destroy all caches owned by `$angularCacheFactory`. [$angularCacheFactory#removeAll](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#removeAll) API documentation.

#### _info()_
__Description:__ Return an object containing information about all caches in `$angularCacheFactory`. [$angularCacheFactory#keySet](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#keySet) API documentation.

#### _keySet()_
__Description:__ Return the set of cacheIds of all caches in `$angularCacheFactory`. [$angularCacheFactory#keySet](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#keySet) API documentation.

#### _keys()_
__Description:__ Return an array of the cacheIds of all caches in `$angularCacheFactory`. [$angularCacheFactory#keys](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#keys) API documentation.

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

<a name='usage'></a>
## Usage Patterns
Examples of uses for angular-cache.

- [Using angular-cache with localStorage](#using-angular-cache-with-localStorage)
- [Using angular-cache with $http](#using-angular-cache-with-$http)
- [Dynamically configure a cache](#dynamically-configure-a-cache)
- [API Documentation](http://jmdobry.github.io/angular-cache/docs/)

<a name='using-angular-cache-with-localStorage'></a>
#### Using angular-cache with localStorage (or sessionStorage)
Using angular-cache in browsers that support localStorage:
```javascript
app.service('myService', function ($angularCacheFactory) {

    // This cache will sync itself with localStorage if it exists, otherwise it won't. Every time the
    // browser loads this app, this cache will attempt to initialize itself with any data it had
    // already saved to localStorage (or sessionStorage if you used that).
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 6000000, // This cache will clear itself every hour.
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
        cacheFlushInterval: 6000000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage', // This cache will sync itself with `localStorage`.
        storageImpl: localStoragePolyfill // angular-cache will use this polyfill instead of looking for localStorage
    });

    // Conditionally use the polyfill
    var options = {
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
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

<a name='using-angular-cache-with-$http'></a>
#### Using angular-cache with $http

__Note__ The downside of letting $http handle caching for you is that it caches the responses (in string form) to your requests–not the JavaScript Object parsed from the response body. This means you can't interact with the data in the cache used by `$http`. See below for how to handle the caching yourself–giving you more control and the ability to interact with the cache (use it as a data store).

Configure `$http` to use a cache created by `$angularCacheFactory` by default:
```javascript
app.run(function ($http, $angularCacheFactory) {

    $angularCacheFactory('defaultCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 6000000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
    });

    $http.defaults.cache = $angularCacheFactory.get('defaultCache');
});

app.service('myService', function ($http) {
    return {
        getDataById: function (id) {
            var deferred = $q.defer(),
                start = new Date().getTime();

            $http.get('api/data/' + id, {
                cache: true
            }).success(function (data) {
                console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
                deferred.resolved(data);
            });
            return deferred.promise;
        }
    };
});

app.controller('myCtrl', function (myService) {
    myService.getDataById(1)
        .then(function (data) {
            // e.g. "time taken for request: 2375ms"
            // Data returned by this next call is already cached.
            myService.getDataById(1)
                .then(function (data) {
                    // e.g. "time taken for request: 1ms"
                });
        });
});
```

Tell `$http` to use a cache created by `$angularCacheFactory` for a specific request:
```javascript
app.service('myService', function ($http, $angularCacheFactory) {

    $angularCacheFactory('dataCache', {
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
    });

    return {
        getDataById: function (id) {
            var deferred = $q.defer(),
                start = new Date().getTime();

            $http.get('api/data/' + id, {
                cache: $angularCacheFactory.get('dataCache')
            }).success(function (data) {
                console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
                deferred.resolved(data);
            });
            return deferred.promise;
        }
    };
});

app.controller('myCtrl', function (myService) {
    myService.getDataById(1)
        .then(function (data) {
            // e.g. "time taken for request: 2375ms"
            // Data returned by this next call is already cached.
            myService.getDataById(1)
                .then(function (data) {
                    // e.g. "time taken for request: 1ms"
                });
        });
});
```

Do your own caching while using the $http service:
```javascript
app.service('myService', function ($http, $angularCacheFactory) {

    $angularCacheFactory('dataCache', {
        maxAge: 900000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 6000000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive' // Items will be deleted from this cache right when they expire.
    });

    return {
        getDataById: function (id) {
            var deferred = $q.defer(),
                start = new Date().getTime(),
                dataCache = $angularCacheFactory.get('dataCache');

            // Now that control of inserting/removing from the cache is in our hands,
            // we can interact with the data in "dataCache" outside of this context,
            // e.g. Modify the data after it has been returned from the server and
            // save those modifications to the cache.
            if (dataCache.get(id)) {
                deferred.resolve(dataCache.get(id));
            } else {
                $http.get('api/data/' + id).success(function (data) {
                        console.log('time taken for request: ' + (new Date().getTime() - start) + 'ms');
                        deferred.resolved(data);
                    });
            }
            return deferred.promise;
        }
    };
});

app.controller('myCtrl', function (myService) {
    myService.getDataById(1)
        .then(function (data) {
            // e.g. "time taken for request: 2375ms"
            // Data returned by this next call is already cached.
            myService.getDataById(1)
                .then(function (data) {
                    // e.g. "time taken for request: 1ms"
                });
        });
});
```

<a name='dynamically-configure-a-cache'></a>
#### Dynamically configure a cache
```javascript
app.service('myService', function ($angularCacheFactory) {

    var cache = $angularCacheFactory('cache', {
        capacity: 100,
        maxAge: 300000
    });

    // Add 50 items here, for example

    cache.info(); // { ..., size: 50, capacity: 100, maxAge: 300000, ... }

    cache.setOptions({
        capacity: 30
    });

    cache.info(); // { ..., size: 30, capacity: 30, maxAge: 3000, ... }
    // notice that only the 30 most recently added items remain in the cache because
    // the capacity was reduced.

    // setting the second parameter to true will cause the cache's configuration to be
    // reset to defaults before the configuration passed into setOptions() is applied to
    // the cache
    cache.setOptions({
        cacheFlushInterval: 5500
    }, true);

    cache.info(); // { ..., size: 30, cacheFlushInterval: 5500,
                  //   capacity: 1.7976931348623157e+308, maxAge: null, ... }

    cache.put('someItem', 'someValue', { maxAge: 12000, deleteOnExpire: 'aggressive' });
    cache.info('someItem'); // { timestamp: 12345678978, maxAge: 12000, deleteOnExpire: 'aggressive', isExpired: false }
});
```
See [AngularCache#setOptions](http://jmdobry.github.io/angular-cache/docs/Cache.html#setOptions)

### [API Documentation](http://jmdobry.github.io/angular-cache/docs/)

<a name='license'></a>
## License
[MIT License](https://github.com/jmdobry/angular-cache/blob/master/LICENSE)

Copyright (C) 2013 Jason Dobry

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
