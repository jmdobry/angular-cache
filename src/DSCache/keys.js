var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:keys
 * @name keys
 * @description
 * Return an array of the keys in this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#keys()
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 * cache.put('2', 'banana');
 *
 * cache.keys(); // [ "1", "2" ]
 * ```
 *
 * @returns {Array} An array of the keys in this cache.
 */
module.exports = function keys() {
  if (this.$$storage) {
    var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

    if (keysJson) {
      return angular.fromJson(keysJson);
    } else {
      return [];
    }
  } else {
    return utils.keys(this.$$data);
  }
};
