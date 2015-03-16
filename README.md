## angular-cache [![bower version](https://img.shields.io/bower/v/angular-cache.svg?style=flat-square)](https://www.npmjs.org/package/angular-cache) [![npm version](https://img.shields.io/npm/v/angular-cache.svg?style=flat-square)](https://www.npmjs.org/package/angular-cache) [![Circle CI](https://img.shields.io/circleci/project/jmdobry/angular-cache/master.svg?style=flat-square)](https://circleci.com/gh/jmdobry/angular-cache/tree/master) [![npm downloads](https://img.shields.io/npm/dm/angular-cache.svg?style=flat-square)](https://www.npmjs.org/package/angular-cache) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/jmdobry/angular-cache/blob/master/LICENSE)

__A very useful replacement for Angular's $cacheFactory.__

__angular-cache < 4.0.0 have been deprecated__

__Latest Release:__ [![Latest Release](https://img.shields.io/github/release/jmdobry/angular-cache.svg?style=flat-square)](https://github.com/jmdobry/angular-cache/releases)

__Status:__

[![Dependency Status](https://img.shields.io/gemnasium/jmdobry/angular-cache.svg?style=flat-square)](https://gemnasium.com/jmdobry/angular-cache) [![Coverage Status](https://img.shields.io/coveralls/jmdobry/angular-cache/master.svg?style=flat-square)](https://coveralls.io/r/jmdobry/angular-cache?branch=master) [![Codacity](https://img.shields.io/codacy/5e27e21d0c4c4d4cb203d589384aa93a.svg?style=flat-square)](https://www.codacy.com/public/jasondobry/angular-cache/dashboard)

__Supported Browsers:__

[![browsers](https://img.shields.io/badge/Browser-Chrome%2CFirefox%2CSafari%2COpera%2CIE%209%2B%2CiOS%20Safari%207.1%2B%2CAndroid%20Browser%202.3%2B-green.svg?style=flat-square)](https://github.com/jmdobry/angular-cache)

### Quick Start
`bower install --save angular-cache` or `npm install --save angular-cache`.

```js
angular.module('myApp', ['angular-cache'])
  .config(function (CacheFactoryProvider) {
    angular.extend(CacheFactoryProvider.defaults, { maxAge: 900000 });
  })
  .service('BookService', function (CacheFactory) {
    if (!CacheFactory.get('bookCache')) {
      CacheFactory.createCache('bookCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 60000
      });
    }

    var bookCache = CacheFactory.get('bookCache');

    return {
      findBookById: function (id) {
        return $http.get('/api/books/' + id, { cache: bookCache });
      }
    };
  });
```

### API

TODO

### License
[MIT License](https://github.com/jmdobry/angular-cache/blob/master/LICENSE)

Copyright (C) 2013-2015 Jason Dobry

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
