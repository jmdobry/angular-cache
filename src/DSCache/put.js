var utils = require('../utils');

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
 * @returns {*} The newly stored item.
 */
module.exports = function put(key, value) {
  var _this = this;
  if (this.$$disabled || value === null || value === undefined) {
    return;
  }
  if (value && value.then) {
    value.then(function (v) {
      if (angular.isObject(v) && 'status' in v && 'data' in v) {
        _this.put(key, [v.status, v.data, v.headers(), v.statusText]);
      } else {
        _this.put(key, v);
      }
    });
    return;
  }
  key = utils.stringifyNumber(key);

  if (!angular.isString(key)) {
    throw angular.$$minErr('ng')('areq', 'Expected key to be a string! Found: {0}.', typeof key);
  }

  var now = new Date().getTime(),
    item = {
      key: key,
      value: value,
      created: now,
      accessed: now
    };

  item.expires = item.created + this.$$maxAge;

  if (this.$$storage) {
    var keysJson = this.$$storage.getItem(this.$$prefix + '.keys'),
      keys = keysJson ? angular.fromJson(keysJson) : [],
      itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

    // Remove existing
    if (itemJson) {
      this.remove(key);
    }
    // Add to expires heap
    this.$$expiresHeap.push({
      key: key,
      expires: item.expires
    });
    // Add to lru heap
    this.$$lruHeap.push({
      key: key,
      accessed: item.accessed
    });
    // Set item
    this.$$storage.setItem(this.$$prefix + '.data.' + key, angular.toJson(item));
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
    this.$$storage.setItem(this.$$prefix + '.keys', angular.toJson(keys));
  } else {
    // Remove existing
    if (this.$$data[key]) {
      this.remove(key);
    }
    // Add to expires heap
    this.$$expiresHeap.push(item);
    // Add to lru heap
    this.$$lruHeap.push(item);
    // Set item
    this.$$data[key] = item;
  }

  // Handle exceeded capacity
  if (this.$$lruHeap.size() > this.$$capacity) {
    this.remove(this.$$lruHeap.peek().key);
  }

  return value;
};
