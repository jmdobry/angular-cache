ngAdvancedCache (0.6.0 - Alpha)
===============
##### ngAdvancedCache is a caching system that improves upon the capabilities of the $cacheFactory provided by AngularJS.

##### The goal of the project is to solve a general problem, not satisfy a specific scenario.

## Table of Contents
- [Features](#features)
- [Status](#status)
- [Download](#download)
- [Roadmap](#roadmap)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
##### Capacity
Set maximum capacity on a cache, turning it into an LRU cache.
##### MaxAge
Set a default maximum lifetime on all items added to the cache. They will be removed when they expire. Can be configured on a per-item basis for greater specificity.
##### CacheFlushInterval
Set the cache to periodically clear itself.

## Status
| Version | Branch  | Build status                                                                                                            | Test Coverage |
| ------- | ------- | ----------------------------------------------------------------------------------------------------------------------- | -------- |
| 0.6.0   | [master](https://github.com/jmdobry/ngAdvancedCache)  | [![Build Status](https://travis-ci.org/jmdobry/ngAdvancedCache.png?branch=master)](https://travis-ci.org/jmdobry/ngAdvancedCache) | [Test Coverage](http://jmdobry.github.io/ngAdvancedCache/coverage/) |
| 0.7.0   | [develop](https://github.com/jmdobry/ngAdvancedCache/tree/develop) | [![Build Status](https://travis-ci.org/jmdobry/ngAdvancedCache.png?branch=develop)](https://travis-ci.org/jmdobry/ngAdvancedCache) | |

## Download
| Type          | File                                                                                                                    | Size    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| Production    | [ngAdvancedCache-0.6.0.min.js](https://raw.github.com/jmdobry/ngAdvancedCache/master/dist/ngAdvancedCache-0.5.0.min.js) | 2.21 KB |
| Development   | [ngAdvancedCache-0.6.0.js](https://raw.github.com/jmdobry/ngAdvancedCache/master/dist/ngAdvancedCache-0.5.0.js)         | 17.1 KB |

## Roadmap
##### 0.6.0 Alpha ([master](https://github.com/jmdobry/ngAdvancedCache))
- Unit tests for `AdvancedCache` class.
- Submit project to Angular.js user groups for feedback.

##### 0.7.0 Compatibility and Performance ([develop](https://github.com/jmdobry/ngAdvancedCache/tree/develop))
- Ensure ngAdvancedCache's compatibility matches that of Angular.js's browser support.
- Ensure ngAdvancedCache supports a reasonable number of older versions of Angular.js.
- Ensure ngAdvancedCache does not result in memory leaks.
- Find a good default balance between memory use and cpu use (timeouts and intervals) and allow the user to configure it.

##### 0.8.0 Beta
- Bug fixes
- Submit project to Angular.js user groups for feedback again.

##### 0.9.0 Release Candidate
- Bug fixes
- Documentation tidy up.

##### 1.0.0 Stable Release
- Yay!

## Usage

- [Load ngAdvancedCache](#load-ngadvancedCache)
- [Create a cache](#create-a-cache)
- [Retrieve a cache](#retrieve-a-cache)
- [Retrieve items](#retrieve-items)
- [Add items](#add-items)
- [Remove items](#remove-items)
- [Clear all items](#clear-all-items)
- [Destroy a cache](#destroy-a-cache)
- [Get info about a cache](#get-info-about-a-cache)
- [API Documentation](http://jmdobry.github.io/ngAdvancedCache/docs/)

#### Load ngAdvancedCache
Make sure ngAdvancedCache is included on your page after Angular.
```javascript
angular.module('myApp', ['ngAdvancedCache']);
```
See [ngAdvancedCache](http://jmdobry.github.io/ngAdvancedCache/docs/module-ngAdvancedCache.html)

#### Create a cache
```javascript
angular.module('myApp').service('myService', ['$advancedCacheFactory',
    function ($advancedCacheFactory) {

        // create a cache with default settings
        var myCache = $advancedCacheFactory('myCache');

        // create an LRU cache with a capacity of 10
        var myLRUCache = $advancedCacheFactory('myLRUCache', {
            capacity: 10
        });

        // create a cache whose items have a maximum lifetime of 10 minutes
        var myTimeLimitedCache = $advancedCacheFactory('myTimeLimitedCache', {
            maxAge: 600000
        });

        // create a cache that will clear itself every 10 minutes
        var myIntervalCache = $advancedCacheFactory('myIntervalCache', {
            cacheFlushInterval: 600000
        });

        // create an cache with all options
        var myAwesomeCache = $advancedCacheFactory('myAwesomeCache', {
            capacity: 10,
            maxAge: 600000,
            cacheFlushInterval: 600000
        });
    }
]);
```
See [$advancedCacheFactory](http://jmdobry.github.io/ngAdvancedCache/docs/advancedCacheFactory.html)

#### Retrieve a cache
```javascript
angular.module('myApp').service('myOtherService', ['$advancedCacheFactory',
    function ($advancedCacheFactory) {

        var myCache = $advancedCacheFactory.get('myCache');
    }
]);
```
See [$advancedCacheFactory#get](http://jmdobry.github.io/ngAdvancedCache/docs/advancedCacheFactory.html#get)

#### Retrieve items
```javascript
myCache.get('someItem'); // { name: 'John Doe' });

// if the item is not in the cache or has expired
myCache.get('someMissingItem'); // undefined
```
See [AdvancedCache#get](http://jmdobry.github.io/ngAdvancedCache/docs/AdvancedCache.html#get)

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
See [AdvancedCache#put](http://jmdobry.github.io/ngAdvancedCache/docs/AdvancedCache.html#put)

#### Remove items
```javascript
myCache.put('someItem', { name: 'John Doe' });

myCache.remove('someItem');

myCache.get('someItem'); // undefined
```
See [AdvancedCache#remove](http://jmdobry.github.io/ngAdvancedCache/docs/AdvancedCache.html#remove)

#### Clear all items
```javascript
myCache.put('someItem', { name: 'John Doe' });
myCache.put('someOtherItem', { name: 'Sally Jean' });

myCache.removeAll();

myCache.get('someItem'); // undefined
myCache.get('someOtherItem'); // undefined
```
See [AdvancedCache#removeAll](http://jmdobry.github.io/ngAdvancedCache/docs/AdvancedCache.html#removeAll)

#### Destroy a cache
```javascript
myCache.destroy();

myCache.get('someItem'); // Will throw an error - Don't try to use a cache after destroying it!

$advancedCacheFactory.get('myCache'); // undefined
```
See [AdvancedCache#destory](http://jmdobry.github.io/ngAdvancedCache/docs/AdvancedCache.html#destory)

#### Get info about a cache
```javascript
myCache.info(); // { id: 'myCache', size: 13 }
```
See [AdvancedCache#info](http://jmdobry.github.io/ngAdvancedCache/docs/AdvancedCache.html#info)

### [API Documentation](http://jmdobry.github.io/ngAdvancedCache/docs/)

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

## License
[MIT License](https://github.com/jmdobry/ngAdvancedCache/blob/master/LICENSE)

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