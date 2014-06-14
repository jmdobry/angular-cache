var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:setMaxAge
 * @name setMaxAge
 * @description
 * Set the `maxAge` setting for this cache. This setting specifies how long items can be in the cache before they expire.
 *
 * ## Signature:
 * ```js
 * DSCache#setMaxAge(maxAge)
 * ```
 *
 * ## Example:
 * ```js
 *  var cache = DSCacheFactory('cache', { deleteOnExpire: 'aggressive' });
 *
 *  // This won't expire for a long time
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *      // 'apple' will be removed because it
 *      // has already been in the cache longer
 *      // than the new maxAge
 *      var removed = cache.setMaxAge(1000);
 *
 *      removed; // {
 *               //     '1': 'apple'
 *               // }
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `maxAge must be `null` or a number greater than zero.
 *
 * @param {number} maxAge The new maxAge for this cache in milliseconds. If `maxAge` is `null` then `maxAge` for this
 * cache will be reset to the default (`Number.MAX_VALUE`);
 * @returns {object} Key-value pairs of any items aggressively removed because they are expired according to the new
 * `maxAge`. Items are only removed if the `deleteOnExpire` setting for this cache is set to `"aggressive"`.
 */
module.exports = function setMaxAge(maxAge) {
  if (maxAge === null) {
    delete this.$$maxAge;
  } else if (!angular.isNumber(maxAge)) {
    throw angular.$$minErr('ng')('areq', 'Expected maxAge to be a number! Found: {0}.', typeof maxAge);
  } else if (maxAge < 0) {
    throw angular.$$minErr('ng')('areq', 'Expected maxAge to be greater than zero! Found: {0}.', maxAge);
  } else {
    this.$$maxAge = maxAge;
  }
  var i, keys, key;

  this.$$expiresHeap.removeAll();

  if (this.$$storage) {
    var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

    keys = keysJson ? angular.fromJson(keysJson) : [];

    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

      if (itemJson) {
        var item = angular.fromJson(itemJson);
        if (this.$$maxAge === Number.MAX_VALUE) {
          item.expires = Number.MAX_VALUE;
        } else {
          item.expires = item.created + this.$$maxAge;
        }
        this.$$expiresHeap.push({
          key: key,
          expires: item.expires
        });
      }
    }
  } else {
    keys = utils.keys(this.$$data);

    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      if (this.$$maxAge === Number.MAX_VALUE) {
        this.$$data[key].expires = Number.MAX_VALUE;
      } else {
        this.$$data[key].expires = this.$$data[key].created + this.$$maxAge;
      }
      this.$$expiresHeap.push(this.$$data[key]);
    }
  }
  if (this.$$deleteOnExpire === 'aggressive') {
    return this.removeExpired();
  } else {
    return {};
  }
};
