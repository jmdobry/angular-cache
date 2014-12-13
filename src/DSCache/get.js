var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:get
 * @name get
 * @description
 * Retrieve the item with the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#get(key)
 * ```
 *
 * ## Examples:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 *
 * cache.get('1'); // "apple"
 * cache.get('2'); // undefined
 * ```
 *
 * ```js
 *  var options = {
 *          deleteOnExpire: 'passive',
 *          maxAge: 1000
 *      },
 *      cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  cache.get('1'); // "apple"
 *
 *  setTimeout(function () {
 *      cache.get('1'); // undefined
 *  }, 1500);
 * ```
 *
 * ```js
 *  var options = {
 *          deleteOnExpire: 'passive',
 *          maxAge: 1000
 *      },
 *      cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  cache.get('1', {
 *      onExpire: function (key, value) {
 *          console.log(key, value);
 *      }
 *  }); // "apple"
 *
 *  setTimeout(function () {
 *      cache.get('1'); // undefined
 *                      // "1" "apple" (printed to console)
 *  }, 1500);
 * ```
 *
 * ```js
 *  var options = {
 *          deleteOnExpire: 'passive',
 *          maxAge: 1000,
 *          onExpire: function (key, value, done) {
 *              console.log('global hit');
 *              if (done) {
 *                  done(key, value);
 *              }
 *          }
 *      },
 *      cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  cache.get('1', {
 *      onExpire: function (key, value) {
 *          console.log(key, value);
 *      }
 *  }); // "apple"
 *
 *  setTimeout(function () {
 *      cache.get('1'); // undefined
 *                      // "global hit" (printed to console)
 *                      // "1" "apple" (printed to console)
 *  }, 1500);
 * ```
 *
 * @param {string} key The key of the item to retrieve.
 * @param {object=} options Optional configuration. Properties:
 *
 * - `{function=}` - `onExpire` - Callback to be used if in passive `deleteOnExpire` mode and the requested item has
 * expired. If a global `onExpire` callback exists for this cache, then it will be called with three arguments: `key`,
 * `value`, and `done`, where `done` is the `onExpire` callback passed into the call to `DSCache#get(key[, options])`.
 * (See the last example above.)
 *
 * @returns {*} The item with the given key.
 */
module.exports = function get(key, options) {
  var _this = this;

  if (angular.isArray(key)) {
    var keys = key;
    var values = [];

    angular.forEach(keys, function (key) {
      var value = _this.get(key, options);
      if (value !== null && value !== undefined) {
        values.push(value);
      }
    });

    return values;
  } else {
    key = utils.stringifyNumber(key);

    if (_this.$$disabled) {
      return;
    }
  }

  options = options || {};
  if (!angular.isString(key)) {
    throw angular.$$minErr('ng')('areq', 'Expected key to be a string! Found: {0}.', typeof key);
  } else if (options && !angular.isObject(options)) {
    throw angular.$$minErr('ng')('areq', 'Expected options to be an object! Found: {0}.', typeof options);
  } else if (options.onExpire && !angular.isFunction(options.onExpire)) {
    throw angular.$$minErr('ng')('areq', 'Expected options.onExpire to be a function! Found: {0}.', typeof options.onExpire);
  }

  var item;

  if (_this.$$storage) {
    if (_this.$$promises[key]) {
      return _this.$$promises[key];
    }

    var itemJson = _this.$$storage().getItem(_this.$$prefix + '.data.' + key);

    if (itemJson) {
      item = angular.fromJson(itemJson);
    } else {
      return;
    }
  } else {
    if (!(key in _this.$$data)) {
      return;
    }

    item = _this.$$data[key];
  }

  var value = item.value;
  var now = new Date().getTime();

  if (_this.$$storage) {
    _this.$$lruHeap.remove({
      key: key,
      accessed: item.accessed
    });
    item.accessed = now;
    _this.$$lruHeap.push({
      key: key,
      accessed: now
    });
  } else {
    _this.$$lruHeap.remove(item);
    item.accessed = now;
    _this.$$lruHeap.push(item);
  }

  if (_this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
    _this.remove(key);

    if (_this.$$onExpire) {
      _this.$$onExpire(key, item.value, options.onExpire);
    } else if (options.onExpire) {
      options.onExpire(key, item.value);
    }
    value = undefined;
  } else if (_this.$$storage) {
    _this.$$storage().setItem(_this.$$prefix + '.data.' + key, JSON.stringify(item));
  }

  return value;
};
