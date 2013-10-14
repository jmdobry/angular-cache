## angular-cache
#### A very useful replacement for Angular's $cacheFactory.
#### Version: 2.0.0-rc.1

- View the [demo](http://jmdobry.github.io/angular-cache/demo/). 
- Ask questions on the [mailing list](https://groups.google.com/forum/#!forum/angular-cache). 
- See [TRANSITION.md](https://github.com/jmdobry/angular-cache/blob/master/TRANSITION.md) for upgrading from 1.x.x to 2.x.x.

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

### Documentation
1. [Demo](http://jmdobry.github.io/angular-cache/demo/)
1. [$angularCacheFactoryProvider](#angularcachefactoryprovider)
1. [$angularCacheFactory](#angularcachefactory)
1. [AngularCache](#angularcache)
1. [Configuration Options](#configuration)
1. [Status](#status)
1. [Download](#download)
1. [Install](#installation)
1. [Usage Patterns](#usage)
1. [Changelog](#changelog)
1. [Contributing](#contributing)
1. [License](#license)

<a name='angularcachefactoryprovider'></a>
## $angularCacheFactoryProvider
__Description:__ Provider for `$angularCacheFactory`. [$angularCacheFactoryProvider](http://jmdobry.github.io/angular-cache/docs/$AngularCacheFactoryProvider.html) API documentation.

#### $angularCacheFactoryProvider.setCacheDefaults()
__Description:__ Set the default configuration for all caches created by `$angularCacheFactory`. [$angularCacheFactoryProvider#setCacheDefaults](http://jmdobry.github.io/angular-cache/docs/$AngularCacheFactoryProvider.html#setCacheDefaults) API documentation.

<a name='angularcachefactory'></a>
## $angularCacheFactory
__Description:__ Produces instances of  `AngularCache`. [$angularCacheFactory](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html) API documentation.

#### $angularCacheFactory(cacheId, options)
__Description:__ Create a new cache with the given cacheId and configuration options. See [Configuration Options](#configuration). [$angularCacheFactory](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html) API documentation.

#### $angularCacheFactory.keySet()
__Description:__ Return the set of cacheIds of all caches in `$angularCacheFactory`. [$angularCacheFactory#keySet](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#keySet) API documentation.

#### $angularCacheFactory.keys()
__Description:__ Return an array of the cacheIds of all caches in `$angularCacheFactory`. [$angularCacheFactory#keys](http://jmdobry.github.io/angular-cache/docs/AngularCacheFactory.html#keys) API documentation.

<a name='angularcache'></a>
## AngularCache
__Description:__ Object produced by invocations of `$angularCacheFactory(cacheId, options)`. [AngularCache](http://jmdobry.github.io/angular-cache/docs/AngularCache.html) API documentation.

#### AngularCache.setOptions(options, strict)
__Description:__ Dynamically configure the cache. See [Configuration Options](#configuration). [AngularCache#setOptions](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#setOptions) API documentation.

#### AngularCache.info(key)
__Description:__ Returns an object containing information about the cache or the item with the specified key. [AngularCache#info](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#info) API documentation.

#### AngularCache.keySet()
__Description:__ Return the set of keys of all items in the cache. [AngularCache#keySet](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#keySet) API documentation.

#### AngularCache.keys()
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

<a name='status'></a>
## Status
| Version | Branch  | Build status                                                                                                                                                              |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.2.0   | [master](https://github.com/jmdobry/angular-cache)  | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=master)](https://travis-ci.org/jmdobry/angular-cache) |
| 2.0.0-rc.1   | [develop](https://github.com/jmdobry/angular-cache/tree/develop) | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=develop)](https://travis-ci.org/jmdobry/angular-cache) |

[Test Coverage](http://jmdobry.github.io/angular-cache/coverage/)

<a name='download'></a>
## Download

#### Latest Stable Version
| Type          | File | Size |
| ------------- | ----------------- | ------------------- | ---- |
| Production    | [angular-cache-2.0.0-rc.1.min.js](https://raw.github.com/jmdobry/angular-cache/master/dist/angular-cache-2.0.0-rc.1.min.js) | 6 KB |
| Development   | [angular-cache-2.0.0-rc.1.js](https://raw.github.com/jmdobry/angular-cache/master/dist/angular-cache-2.0.0-rc.1.js) | 34 KB |

<a name='installation'></a>
## Installation

#### Install with bower
```javascript
bower install angular-cache
```

Include `src/angular-cache.js` on your web page after `angular.js` and activate it via `angular.module('myApp', ['jmdobry.angular-cache']);`

#### Manual install
Get angular-cache from the [Download](#download) section, include it on your web page after `angular.js`, and activate it via `angular.module('myApp', ['jmdobry.angular-cache']);`

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

<a name='changelog'></a>
## Changelog

##### 2.0.0-rc.1 - 14 October 2013

###### Breaking API changes
- Swapped `aggressiveDelete` option for `deleteOnExpire` option. #30, #47
- Changed `$angularCacheFactory.info()` to return an object similar to `AngularCache.info()` #45
- Namespaced angular-cache module under `jmdobry` so it is now "jmdobry.angular-cache". #42
- Substituted `storageImpl` and `sessionStorageImpl` options for just `storageImpl` option.

###### Backwards compatible API changes
- Added ability to set global cache defaults in $angularCacheFactoryProvider. #55

###### Backwards compatible bug fixes
- cacheFlushInterval doesn't clear web storage when storageMode is used. #52
- AngularCache#info(key) should return 'undefined' if the key isn't in the cache #53

###### Other
- Refactored angular-cache `setOptions()` internals to be less convoluted and to have better validation. #46
- Re-wrote documentation to be clearer and more organized. #56
- Fixed documentation where time spans were incorrectly labeled. #59

##### 1.2.0 - 20 September 2013

###### Backwards compatible API changes
- Added AngularCache#info(key) #43

###### Backwards compatible bug fixes
- Fixed #39, #44, #49, #50

##### 1.1.0 - 03 September 2013

###### Backwards compatible API changes
- Added onExpire callback hook #27
- Added `$angularCacheFactory.removeAll()` and `$angularCacheFactory.clearAll()` convenience methods #37, #38

###### Backwards compatible bug fixes
- Fixed #36

##### 1.0.0 - 26 August 2013
- Closed #31 (Improved documentation)
- Closed #32

##### 1.0.0-rc.1 - 21 August 2013
- Added localStorage feature #26, #29

##### 0.9.1 - 03 August 2013
- Fixed #25

##### 0.9.0 - 03 August 2013
- Added a changelog #13
- Added documentation for installing with bower
- Added ability to set option `aggressiveDelete` when creating cache and when adding items
- Cleaned up README.md
- Switched the demo to use Bootstrap 3

##### 0.8.2 - 09 July 2013
- Added CONTRIBUTING.md #22
- Cleaned up meta data in bower.json and package.json

##### 0.8.1 - 09 July 2013
- Added .jshintrc
- Cleaned up the docs a bit
- `bower.json` now uses `src/angular-cache.js` instead of the versioned output files #21
- From now on the tags for the project will be named using [semver](http://semver.org/)

##### 0.8.0 - 08 July 2013
- Added `AngularCache.setOptions()`, the ability to dynamically change the configuration of a cache #20
- Added `AngularCache.keys()`, which returns an array of the keys in a cache #19
- Added `AngularCache.keySet()`, which returns a hash of the keys in a cache #19

##### 0.7.2 - June 2013
- Added `angular-cache` to bower registry #7
- Created a working demo #9 #17
- Fixed the size not being reset to 0 when the cache clears itself #14 #16
- Added `$angularCacheFactory.keys()`, which returns an array of the keys (the names of the caches) in $angularCacheFactory #18
- Added `$angularCacheFactory.keySet()`, which returns a hash of the keys (the names of the caches) in $angularCacheFactory #18

##### 0.6.1 - June 2013
- Got the project building on TravisCI
- Renamed the project to `angular-cache` #5

##### 0.5.0 - June 2013
- Added a roadmap to README.md #4
- Clarify usage documentation #3
- Wrote unit tests #2

##### 0.4.0 - May 2013
- Added Grunt build tasks #1

<a name='contributing'></a>
## Contributing

#### Submitting Issues
1. Make sure you aren't submitting a duplicate issue.
2. Carefully describe how to reproduce the problem.
3. Expect prompt feedback.

#### Submitting Pull Requests

##### Basic Idea
- Checkout a new branch based on `develop` and name it to what you intend to do:
  - Example:
    ````
    $ git checkout -b BRANCH_NAME
    ````
  - Use one branch per fix/feature
  - Prefix your branch name with `feature-` or `fix-` appropriately.
- Make your changes
  - Make sure to provide a spec for unit tests
  - Run your tests with either `karma start` or `grunt test`
  - Make sure the tests pass
- Commit your changes
  - Please provide a git message which explains what you've done
  - Commit to the forked repository
- Make a pull request
  - Make sure you send the PR to the `develop` branch
  - Travis CI is watching you!

##### More details
Read the detailed [Contributing Guide](https://github.com/jmdobry/angular-cache/blob/master/CONTRIBUTING.md)

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
