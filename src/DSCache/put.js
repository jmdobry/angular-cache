var utils = require('../utils');

function isPromiseLike(v) {
  return v && typeof v.then === 'function';
}

/**
 * @doc method
 * @id DSCache.methods:put
 * @name put
 * @description
 * Insert a value into the cache under the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#put(key, value)
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 * cache.put('2', 3);
 * cache.put('3', { stuff: 'more stuff' });
 *
 * cache.get('1'); // "apple"
 * cache.get('2'); // 3
 * cache.get('3'); // { stuff: 'more stuff' }
 * cache.get('4'); // undefined
 * ```
 *
 * ## Throws:
 * - `Error` - `key` must be a string.
 *
 * @param {string} key The key under which to store the given value.
 * @param {*} value The value to store.
 * @param {options=} options Configuration options. Properties:
 *
 *  - `{boolean=}` - `storeOnResolve` - If putting a promise, put the resolved value if the promise resolves.
 *  - `{boolean=}` - `storeOnReject` - If putting a promise, put the rejection value if the the promise rejects.
 *
 * @returns {*} The newly stored item.
 */
module.exports = function put(key, value, options) {
  options = options || {};

  var _this = this;
  var storeOnResolve = 'storeOnResolve' in options ? !!options.storeOnResolve : _this.$$storeOnResolve;
  var storeOnReject = 'storeOnReject' in options ? !!options.storeOnReject : _this.$$storeOnReject;

  function getHandler(store, isError) {
    return function handlePromise(v) {
      if (store) {
        delete _this.$$promises[key];
        if (angular.isObject(v) && 'status' in v && 'data' in v) {
          v = [v.status, v.data, v.headers(), v.statusText];
          _this.put(key, v);
        } else {
          _this.put(key, v);
        }
      }
      if (isError) {
        return _this.$q.reject(v);
      } else {
        return v;
      }
    };
  }

  if (_this.$$disabled || value === null || value === undefined) {
    return;
  }
  key = utils.stringifyNumber(key);

  if (!angular.isString(key)) {
    throw angular.$$minErr('ng')('areq', 'Expected key to be a string! Found: {0}.', typeof key);
  }

  var now = new Date().getTime();
  var item = {
    key: key,
    value: isPromiseLike(value) ? value.then(getHandler(storeOnResolve, false), getHandler(storeOnReject, true)) : value,
    created: now,
    accessed: now
  };

  item.expires = item.created + _this.$$maxAge;

  if (_this.$$storage) {
    if (isPromiseLike(item.value)) {
      _this.$$promises[key] = item.value;
      return _this.$$promises[key];
    }
    var keysJson = _this.$$storage().getItem(_this.$$prefix + '.keys');
    var keys = keysJson ? angular.fromJson(keysJson) : [];
    var itemJson = _this.$$storage().getItem(_this.$$prefix + '.data.' + key);

    // Remove existing
    if (itemJson) {
      _this.remove(key);
    }
    // Add to expires heap
    _this.$$expiresHeap.push({
      key: key,
      expires: item.expires
    });
    // Add to lru heap
    _this.$$lruHeap.push({
      key: key,
      accessed: item.accessed
    });
    // Set item
    _this.$$storage().setItem(_this.$$prefix + '.data.' + key, JSON.stringify(item));
    var exists = false;
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === key) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      keys.push(key);
    }
    _this.$$storage().setItem(_this.$$prefix + '.keys', JSON.stringify(keys));
  } else {
    // Remove existing
    if (_this.$$data[key]) {
      _this.remove(key);
    }
    // Add to expires heap
    _this.$$expiresHeap.push(item);
    // Add to lru heap
    _this.$$lruHeap.push(item);
    // Set item
    _this.$$data[key] = item;
    delete _this.$$promises[key];
  }

  // Handle exceeded capacity
  if (_this.$$lruHeap.size() > _this.$$capacity) {
    _this.remove(_this.$$lruHeap.peek().key);
  }

  return value;
};
