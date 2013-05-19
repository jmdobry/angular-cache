ngAdvancedCache
===============
##### ngAdvancedCache is a caching system that improves upon the capabilities of the $cacheFactory provided by AngularJS.

## Table of Contents
- [Features](#features)
- [Download](#download)
- [Usage](#usage)
- [License](#license)

## Features
##### Capacity
Set maximum capacity on a cache, turning it into an LRU cache.
##### MaxAge
Set a default maximum lifetime on all items in a cache. This uses a lazy check. When an item is requested it is checked for expiration. If the item has expired it is removed from the cache and the request results in a miss.

## Download
| Type          | File                                                                                                                    | Size  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- | ----- |
| Production    | [ngAdvancedCache-0.4.0.min.js](https://raw.github.com/jmdobry/ngAdvancedCache/master/dist/ngAdvancedCache-0.4.0.min.js) | 1.3 KB  |
| Development   | [ngAdvancedCache-0.4.0.js](https://raw.github.com/jmdobry/ngAdvancedCache/master/dist/ngAdvancedCache-0.4.0.js)         | 15.4 KB |

## Usage

- [Create a cache](#create-a-cache)
- [Retrieve items](#retrieve-items)
- [Add items](#add-items)
- [Remove items](#remove-items)
- [Clear all items](#clear-all-items)
- [Get info about a cache](#get-info-about-a-cache)
- [API Documentation](http://jmdobry.github.io/ngAdvancedCache/docs/)

##### Create a cache
```javascript
angular.module('myApp', ['ngAdvancedCache']);

angular.module('myApp').service('myService', ['$advancedCacheFactory',
    function ($advancedCacheFactory) {

        // create a cache with default settings
        var myCache = $advancedCacheFactory('myCache');

        // create an LRU cache with a capacity of 10
        var myLRUCache = $advancedCacheFactory('myLRUCache', {
            capacity: 10
        });

        // create a cache whose items have a default maximum lifetime of 10 minutes
        var myTimeLimitedCache = $advancedCacheFactory('myTimeLimitedCache', {
            maxAge: 600000
        });
    }
]);
```

##### Retrieve items
```javascript
angular.module('myApp').service('myOtherService', ['$advancedCacheFactory',
    function ($advancedCacheFactory) {

        var myCache = $advancedCacheFactory.get('myCache');
    }
]);
```

##### Add items
```javascript
myCache.put('someItem', { name: 'John Doe' });

myCache.get('someItem'); // { name: 'John Doe' });
```

Give a specific item a maximum age
```javascript
myCache.put('someItem', { name: 'John Doe' }, { maxAge: 10000 });

myCache.get('someItem'); // { name: 'John Doe' });

// wait at least ten seconds
setTimeout(function() {

    myCache.get('someItem'); // undefined

}, 15000); // 15 seconds
```

##### Remove items
```javascript
myCache.put('someItem', { name: 'John Doe' });

myCache.remove('someItem');

myCache.get('someItem'); // undefined
```

##### Clear all items
```javascript
myCache.put('someItem', { name: 'John Doe' });
myCache.put('someOtherItem', { name: 'Sally Jean' });

myCache.removeAll();

myCache.get('someItem'); // undefined
myCache.get('someOtherItem'); // undefined
```

##### Get info about a cache
```javascript
myCache.info(); // { id: 'myCache', size: 13 }
```

##### [API Documentation](http://jmdobry.github.io/ngAdvancedCache/docs/)

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

[features](#features)