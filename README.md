### angular-cache (1.2.1) is a very useful replacement for Angular's $cacheFactory.

Check out the [demo](http://jmdobry.github.io/angular-cache/demo/) for a quick introduction, or continue on down for more detailed information.

The goal of the project is to solve a general problem, not satisfy a specific scenario.

### Quick Introduction

#### [View the Demo](http://jmdobry.github.io/angular-cache/demo/)

#### [Mailing List](https://groups.google.com/forum/#!forum/angular-cache)

##### $cacheFactory
```javascript
// Angular's provided $cacheFactory
app.service('myService', function ($cacheFactory) {
    // This is all you can do with $cacheFactory
    $cacheFactory('myNewCache', { capacity: 1000 }); // This cache can hold 1000 items
});
```

#### vs

##### $angularCacheFactory
```javascript
// Smarter caching with $angularCacheFactory
app.service('myService', function ($angularCacheFactory) {
    $angularCacheFactory('myNewCache', {
        capacity: 1000,  // This cache can hold 1000 items,
        maxAge: 90000, // Items added to this cache expire after 15 minutes
        aggressiveDelete: true, // Items will be actively deleted when they expire
        cacheFlushInterval: 3600000, // This cache will clear itself every hour,
        storageMode: 'localStorage' // This cache will sync itself with localStorage,
        onExpire: function (key, value) {
            // This callback is executed when the item specified by "key" expires.
            // At this point you could retrieve a fresh value for "key"
            // from the server and re-insert it into the cache.
        }
     });
});
```

### Table of Contents
1. [Demo](http://jmdobry.github.io/angular-cache/demo/)
1. [Features](#features)
1. [Status](#status)
1. [Download](#download)
1. [Install](#installation)
1. [Usage](#usage)
1. [Changelog](#changelog)
1. [Contributing](#contributing)
1. [License](#license)

<a name='features'></a>
## Features

#### Configuration Parameters

##### `storageMode`
Configure the cache to sync itself with `localStorage` or `sessionStorage`. The cache will re-initialize itself from `localStorage` and `sessionStorage` on page refresh. See [Using angular-cache with localStorage](#using-angular-cache-with-localStorage).

```javascript
$angularCacheFactory('newCache', { storageMode: 'localStorage' });
```

##### `localStorageImpl` and `sessionStorageImpl`
When `storageMode` is set to `"localStorage"` or `"sessionStorage"` angular-cache will default to using the global `localStorage` and `sessionStorage` objects. The angular-cache `localStorageImpl` and `sessionStorageImpl` configuration parameters allow you to tell angular-cache which implementation of `localStorage` or `sessionStorage` to use. This is useful when you don't want to override the global storage objects or when using angular-cache in a browser that doesn't support `localStorage` or `sessionStorage`. See [Using angular-cache with localStorage](#using-angular-cache-with-localStorage).

```javascript
$angularCacheFactory('newCache', { localStorageImpl: myLocalStorageImplementation, storageMode: 'localStorage' });

$angularCacheFactory('otherCache', { localStorageImpl: mySessionStorageImplementation, storageMode: 'sessionStorage' });
```

__Note:__ If angular-cache doesn't detect a global `localStorage` or `sessionStorage` and you don't provide a polyfill, then that feature will be disabled. It is up to the developer to provide a polyfill for browsers that don't support `localStorage` and `sessionStorage`. Any implementation of `localStorage` and `sessionStorage` provided to angular-cache must implement at least the `setItem`, `getItem`, and `removeItem` methods. See [Using angular-cache with localStorage](#using-angular-cache-with-localStorage).

##### `maxAge`
Set a default maximum lifetime on all items added to the cache. They will be removed aggressively or passively depending on the value of `aggressiveDelete` (see below). Can be configured on a per-item basis for greater specificity.

```javascript
$angularCacheFactory('newCache', { maxAge: 36000 });
```

##### `aggressiveDelete`
If true and maxAge is set, then items will be actively deleted right when they expire, otherwise items won't be deleted until they are requested but it is discovered that they have expired and are deleted, resulting in a miss. Can be configured on a per-item basis for greater specificity.

```javascript
$angularCacheFactory('newCache', {
    maxAge: 36000,
    aggressiveDelete: true
});
```

##### `cacheFlushInterval`
Set the cache to periodically clear itself.

```javascript
$angularCacheFactory('newCache', { cacheFlushInterval: 57908 });
```

##### `onExpire`
A callback function to be executed when an item expires.

###### Using 'onExpire' in passive delete mode
In passive delete mode the cache doesn't know if an item has expired until the item is requested, at which point the cache checks to see if the item has expired. If the item has expired then it is immediately removed from the cache, resulting in a "miss".

If you specify a global "onExpire" callback function, the cache will execute this function when it is discovered the item has expired, passing to the callback the key and value of the expired item.

When you actually request the expired item via `myCache.get('someKey')` you can also pass a second argument to `get()` specifying a callback that your cache's "onExpire" callback can execute when it finishes. For example:

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

#### Methods

##### `keySet()`
Return the set of keys associated with all current caches owned by $angularCacheFactory.

```javascript
$angularCacheFactory.keySet();
```

Return the set of keys associated with all current items in `someCache`.

```javascript
$angularCacheFactory.get('someCache').keySet();
```

##### `keys()`
Return an array of the keys associated with all current caches owned by $angularCacheFactory. See [Get info about a cache](#get-info-about-a-cache).

```javascript
$angularCacheFactory.keys();
```

Return an array of the keys associated with all current items in `someCache`. See [Get info about a cache](#get-info-about-a-cache).

```javascript
$angularCacheFactory.get('someCache').keys();
```

##### `setOptions()`
Dynamically configure a cache. See [Dynamically configure a cache](#dynamically-configure-a-cache).

```javascript
$angularCacheFactory.get('someCache').setOptions({ capacity: 4500 });
```

<a name='status'></a>
## Status
| Version | Branch  | Build status                                                                                                                                                              | Test Coverage |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 1.2.1   | [master](https://github.com/jmdobry/angular-cache)  | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=master)](https://travis-ci.org/jmdobry/angular-cache) | [Test Coverage](http://jmdobry.github.io/angular-cache/coverage/) |
| 1.2.1   | [develop](https://github.com/jmdobry/angular-cache/tree/develop) | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=develop)](https://travis-ci.org/jmdobry/angular-cache) | |
| 1.2.1   | [all](https://drone.io/github.com/jmdobry/angular-cache) | [![Build Status](https://drone.io/github.com/jmdobry/angular-cache/status.png)](https://drone.io/github.com/jmdobry/angular-cache/latest)

<a name='download'></a>
## Download

#### Latest Stable Version
| Type          | File | Size |
| ------------- | ----------------- | ------------------- | ---- |
| Production    | [angular-cache-1.2.1.min.js](https://raw.github.com/jmdobry/angular-cache/master/dist/angular-cache-1.2.1.min.js) | 7 KB |
| Development   | [angular-cache-1.2.1.js](https://raw.github.com/jmdobry/angular-cache/master/dist/angular-cache-1.2.1.js) | 38 KB |

<a name='installation'></a>
## Installation

#### Install with bower
```javascript
bower install angular-cache
```

Include `src/angular-cache.js` on your web page after `angular.js`.

#### Manual install
Get angular-cache from the [Download](#download) section and include it on your web page after `angular.js`.

<a name='usage'></a>
## Usage

- [Load angular-cache](#load-angular-cache)
- [Create a cache](#create-a-cache)
- [Using angular-cache with localStorage](#using-angular-cache-with-localStorage)
- [Using angular-cache with $http](#using-angular-cache-with-$http)
- [Dynamically configure a cache](#dynamically-configure-a-cache)
- [Retrieve a cache](#retrieve-a-cache)
- [Retrieve items](#retrieve-items)
- [Add items](#add-items)
- [Remove items](#remove-items)
- [Clear all items](#clear-all-items)
- [Destroy a cache](#destroy-a-cache)
- [Get info about a cache](#get-info-about-a-cache)
- [API Documentation](http://jmdobry.github.io/angular-cache/docs/)

<a name='load-angular-cache'></a>
#### Load angular-cache
Make sure angular-cache is included on your web page after `angular.js`.
```javascript
angular.module('myApp', ['angular-cache']);
```
See [angular-cache](http://jmdobry.github.io/angular-cache/docs/module-angular-cache.html)

<a name='create-a-cache'></a>
#### Create a cache
```javascript
app.service('myService', function ($angularCacheFactory) {

    // create a cache with default settings
    var myCache = $angularCacheFactory('myCache');

    // create an LRU cache with a capacity of 10
    var myLRUCache = $angularCacheFactory('myLRUCache', {
        capacity: 10
    });

    // create a cache whose items have a maximum lifetime of 10 minutes
    var myTimeLimitedCache = $angularCacheFactory('myTimeLimitedCache', {
        maxAge: 600000,
        onExpire: function (key, value, done) {
            // This callback is executed during a call to "get()" and the requested item has expired.
            // Receives the key and value of the expired item and a third argument, "done", which is
            // a callback function passed as the second argument to "get()".
            // See the "onExpire" configuration option discussed above.

            // do something, like get a fresh value from the server and put it into the cache
            if (done && typeof done === 'function') {
                done(); // pass whatever you want into done()
            }
        }
    });

    // create a cache whose items have a maximum lifetime of 10 minutes which are immediately deleted upon expiration
    var myAggressiveTimeLimitedCache = $angularCacheFactory('myAggressiveTimeLimitedCache', {
        maxAge: 600000,
        onExpire: function (key, value) {
            // This callback is executed right when items expire. Receives the key and value of expired items.
            // See the "onExpire" configuration option discussed above.

            // do something, like get a fresh value from the server and put it into the cache
        }
    });

    // create a cache that will clear itself every 10 minutes
    var myIntervalCache = $angularCacheFactory('myIntervalCache', {
        cacheFlushInterval: 600000
    });

    // create an cache with all options
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
        capacity: 10, // This cache can only hold 10 items.
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        aggressiveDelete: true, // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage', // This cache will sync itself with `localStorage`.
        localStorageImpl: myAwesomeLSImpl // This cache will use a custom implementation of localStorage.
    });
});
```
See [$angularCacheFactory](http://jmdobry.github.io/angular-cache/docs/angularCacheFactory.html)

<a name='using-angular-cache-with-localStorage'></a>
#### Using angular-cache with localStorage (or sessionStorage)
Using angular-cache in browsers that support localStorage:
```javascript
app.service('myService', function ($angularCacheFactory) {

    // This cache will sync itself with localStorage if it exists, otherwise it won't. Every time the
    // browser loads this app, this cache will attempt to initialize itself with any data it had
    // already saved to localStorage (or sessionStorage if you used that).
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        aggressiveDelete: true, // Items will be deleted from this cache right when they expire.
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
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        aggressiveDelete: true, // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage', // This cache will sync itself with `localStorage`.
        localStorageImpl: localStoragePolyfill // angular-cache will use this polyfill instead of looking for localStorage
    });

    // Conditionally use the polyfill
    var options = {
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        aggressiveDelete: true, // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage' // This cache will sync itself with `localStorage`.
    };
    if (!window.localStorage) {
        options.localStorageImpl = localStoragePolyfill;
    }
    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', options);
});
```

Documentation on the interface that must be implementated by any localStorage/sessionStorage polyfill used by angular-cache can be found on the [W3C Recommendation](http://www.w3.org/TR/2013/REC-webstorage-20130730/) page for webstorage. The interface itself looks like:
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
  localStorageImpl: storeJsToStandard
});
```

<a name='using-angular-cache-with-$http'></a>
#### Using angular-cache with $http

__Note__ The downside of letting $http handle caching for you is that it caches the responses (in string form) to your requests–not the JavaScript Object parsed from the response body. This means you can't interact with the data in the cache used by `$http`. See below for how to handle the caching yourself–giving you more control and the ability to interact with the cache (use it as a data store).

Configure `$http` to use a cache created by `$angularCacheFactory` by default:
```javascript
app.run(function ($http, $angularCacheFactory) {

    $angularCacheFactory('defaultCache', {
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        aggressiveDelete: true // Items will be deleted from this cache right when they expire.
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
        aggressiveDelete: true // Items will be deleted from this cache right when they expire.
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
        maxAge: 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 600000, // This cache will clear itself every hour.
        aggressiveDelete: true // Items will be deleted from this cache right when they expire.
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

    // create a cache with default settings
    var cache = $angularCacheFactory('cache', {
        capacity: 100,
        maxAge: 30000
    });

    // Add 50 items here, for example

    cache.info(); // { ..., size: 50, capacity: 100, maxAge: 3000, ... }

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

    cache.put('someItem', 'someValue', { maxAge: 12000, aggressiveDelete: true });
    cache.info('someItem'); // { timestamp: 12345678978, maxAge: 12000, aggressiveDelete: true, isExpired: false }
});
```
See [AngularCache#setOptions](http://jmdobry.github.io/angular-cache/docs/Cache.html#setOptions)

<a name='retrieve-a-cache'></a>
#### Retrieve a cache
```javascript
app.service('myOtherService', function ($angularCacheFactory) {

    var myCache = $angularCacheFactory.get('myCache');
});
```
See [$angularCacheFactory#get](http://jmdobry.github.io/angular-cache/docs/angularCacheFactory.html#get)

<a name='retrieve-items'></a>
#### Retrieve items
```javascript
myCache.get('someItem'); // { name: 'John Doe' });

// if the item is not in the cache or has expired
myCache.get('someMissingItem'); // undefined
```
See [AngularCache#get](http://jmdobry.github.io/angular-cache/docs/Cache.html#get)

<a name='add-items'></a>
#### Add items
```javascript
myCache.put('someItem', { name: 'John Doe' });

myCache.get('someItem'); // { name: 'John Doe' });
```

Give a specific item a maximum age
```javascript
// The maxAge given to this item will override the maxAge of the cache, if any was set
myCache.put('someItem', { name: 'John Doe' }, { maxAge: 10000 });

myCache.get('someItem'); // { name: 'John Doe' });

// wait at least ten seconds
setTimeout(function() {

    myCache.get('someItem'); // undefined

}, 15000); // 15 seconds
```
See [AngularCache#put](http://jmdobry.github.io/angular-cache/docs/Cache.html#put)

<a name='remove-items'></a>
#### Remove items
```javascript
myCache.put('someItem', { name: 'John Doe' });

myCache.remove('someItem');

myCache.get('someItem'); // undefined
```
See [AngularCache#remove](http://jmdobry.github.io/angular-cache/docs/Cache.html#remove)

<a name='clear-all-items'></a>
#### Clear all items
```javascript
myCache.put('someItem', { name: 'John Doe' });
myCache.put('someOtherItem', { name: 'Sally Jean' });

myCache.removeAll();

myCache.get('someItem'); // undefined
myCache.get('someOtherItem'); // undefined
```
See [AngularCache#removeAll](http://jmdobry.github.io/angular-cache/docs/Cache.html#removeAll)

<a name='destroy-a-cache'></a>
#### Destroy a cache
```javascript
myCache.destroy();

myCache.get('someItem'); // Will throw an error - Don't try to use a cache after destroying it!

$angularCacheFactory.get('myCache'); // undefined
```
See [AngularCache#destroy](http://jmdobry.github.io/angular-cache/docs/Cache.html#destroy)

<a name='get-info-about-a-cache'></a>
#### Get info about a cache
```javascript
myCache.put("1", "someValue");

myCache.info(); // { id: 'myCache', size: 1 }

myCache.keys(); // ["1"]

myCache.keySet(); // { "1": "1" }
```
See [AngularCache#info](http://jmdobry.github.io/angular-cache/docs/Cache.html#info)

### [API Documentation](http://jmdobry.github.io/angular-cache/docs/)

<a name='changelog'></a>
## Changelog

##### 1.2.1 - xx September 2013

###### Backwards compatible bug fixes
- Fixed #52, #54

##### 1.2.0 - 21 September 2013

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
