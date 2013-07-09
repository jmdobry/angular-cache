angular-cache (0.8.0 - Beta)
===============
angular-cache is a caching system that improves upon the capabilities of the $cacheFactory provided by AngularJS. With angular-cache your caches can periodically clear themselves and flush items that have expired.

The goal of the project is to solve a general problem, not satisfy a specific scenario.

### Table of Contents
1. [Demo](http://jmdobry.github.io/angular-cache/demo/)
2. [Features](#features)
3. [Status](#status)
4. [Download](#download)
5. [Usage](#usage)
6. [Roadmap](#roadmap)
7. [Contributing](#contributing)
8. [License](#license)

<a name='demo'></a>
## Demo

[View the Demo](http://jmdobry.github.io/angular-cache/demo/)

<a name='features'></a>
## Features
(These are in addition to what Angular's $cacheFactory provides.)

##### option: `maxAge`
Set a default maximum lifetime on all items added to the cache. They will be removed when they expire. Can be configured on a per-item basis for greater specificity.

e.g. `$angularCacheFactory('newCache', { maxAge: 36000 })`:
##### option: `cacheFlushInterval`
Set the cache to periodically clear itself.

e.g. `$angularCacheFactory('newCache', { cacheFlushInterval: 57908 })`
##### method: `keySet()`
Return the set of keys associated with all current caches owned by $angularCacheFactory.

e.g. `$angularCacheFactory.keySet()`

Return the set of keys associated with all current items in `someCache`.

e.g. `$angularCacheFactory.get('someCache').keySet()`:
##### method: `keys()`
Return an array of the keys associated with all current caches owned by $angularCacheFactory.

e.g. `$angularCacheFactory.keys()`

Return an array of the keys associated with all current items in `someCache`.

e.g. `$angularCacheFactory.get('someCache').keys()`
##### method: `setOptions()`
Dynamically configure a cache.

e.g. `$angularCacheFactory.get('someCache').setOptions({ capacity: 4500 })`

<a name='status'></a>
## Status
| Version | Branch  | Build status                                                                                                                                                              | Test Coverage |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 0.8.0   | [master](https://github.com/jmdobry/angular-cache)  | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=master)](https://travis-ci.org/jmdobry/angular-cache) | [Test Coverage](http://jmdobry.github.io/angular-cache/coverage/) |
| 0.8.0   | [develop](https://github.com/jmdobry/angular-cache/tree/develop) | [![Build Status](https://travis-ci.org/jmdobry/angular-cache.png?branch=develop)](https://travis-ci.org/jmdobry/angular-cache) | |
| 0.8.0   | [all](https://drone.io/github.com/jmdobry/angular-cache) | [![Build Status](https://drone.io/github.com/jmdobry/angular-cache/status.png)](https://drone.io/github.com/jmdobry/angular-cache/latest)

<a name='download'></a>
## Download
#### [All Downloads](https://drone.io/github.com/jmdobry/angular-cache/files) (at www.drone.io)

or

#### Latest Stable Version
| Type          | From drone.io | From raw.github.com | Size |
| ------------- | ----------------- | ------------------- | ---- |
| Production    | [angular-cache-0.8.0.min.js](https://drone.io/github.com/jmdobry/angular-cache/files/dist/angular-cache-0.8.0.min.js) | [angular-cache-0.8.0.min.js](https://raw.github.com/jmdobry/angular-cache/master/dist/angular-cache-0.8.0.min.js) | 3.3 KB |
| Development   | [angular-cache-0.8.0.js](https://drone.io/github.com/jmdobry/angular-cache/files/dist/angular-cache-0.8.0.js)         | [angular-cache-0.8.0.js](https://raw.github.com/jmdobry/angular-cache/master/dist/angular-cache-0.8.0.js) | 28.7 KB |

<a name='usage'></a>
## Usage

- [Load angular-cache](#load-angular-cache)
- [Create a cache](#create-a-cache)
- [Dynamically configure a cache](#create-a-cache)
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
Make sure angular-cache is included on your web page after Angular.
```javascript
angular.module('myApp', ['angular-cache']);
```
See [angular-cache](http://jmdobry.github.io/angular-cache/docs/module-angular-cache.html)

<a name='create-a-cache'></a>
#### Create a cache
```javascript
angular.module('myApp').service('myService', ['$angularCacheFactory',
    function ($angularCacheFactory) {

        // create a cache with default settings
        var myCache = $angularCacheFactory('myCache');

        // create an LRU cache with a capacity of 10
        var myLRUCache = $angularCacheFactory('myLRUCache', {
            capacity: 10
        });

        // create a cache whose items have a maximum lifetime of 10 minutes
        var myTimeLimitedCache = $angularCacheFactory('myTimeLimitedCache', {
            maxAge: 600000
        });

        // create a cache that will clear itself every 10 minutes
        var myIntervalCache = $angularCacheFactory('myIntervalCache', {
            cacheFlushInterval: 600000
        });

        // create an cache with all options
        var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
            capacity: 10,
            maxAge: 600000,
            cacheFlushInterval: 600000
        });
    }
]);
```
See [$angularCacheFactory](http://jmdobry.github.io/angular-cache/docs/angularCacheFactory.html)

<a name='dynamically-configure-a-cache'></a>
#### Dynamically configure a cache
```javascript
angular.module('myApp').service('myService', ['$angularCacheFactory',
    function ($angularCacheFactory) {

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
    }
]);
```
See [AngularCache#setOptions](http://jmdobry.github.io/angular-cache/docs/Cache.html#setOptions)

<a name='retrieve-a-cache'></a>
#### Retrieve a cache
```javascript
angular.module('myApp').service('myOtherService', ['$angularCacheFactory',
    function ($angularCacheFactory) {

        var myCache = $angularCacheFactory.get('myCache');
    }
]);
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
myCache.info(); // { id: 'myCache', size: 13 }
```
See [AngularCache#info](http://jmdobry.github.io/angular-cache/docs/Cache.html#info)

### [API Documentation](http://jmdobry.github.io/angular-cache/docs/)

<a name='roadmap'></a>
## Roadmap

##### 0.9.x Release Candidate
- Bug fixes
- Documentation tidy up.

##### 1.0.0 Stable Release
- Yay!

<a name='contributing'></a>
## Contributing

#### Submitting Issues
1. Make sure you aren't submitting a duplicate issue.
2. Carefully describe how to reproduce the problem.
3. Expect prompt feedback.

#### Submitting Pull Requests
1. Fork
2. For hotfixes branch from master, otherwise from develop. Prefix name of branch with issue label. E.g. `hotfix-missing-semicolon`, `feature-my-feature`, etc.
3. Make sure `grunt build` passes with zero warnings/errors.
4. Make sure your code follows the [style guidelines](https://github.com/rwldrn/idiomatic.js).
    - This project uses 4-space indentation and single-quotes.
5. Make sure your pull request references/closes the proper issues.
6. For hotfixes submit request to be merged into master, otherwise into develop.

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
