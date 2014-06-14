/**
 * @doc method
 * @id DSCache.methods:setDeleteOnExpire
 * @name setDeleteOnExpire
 * @description
 * Set the behavior for this cache for when items expire. This setting determines what this cache will do when one of
 * its items expires.
 *
 * ## Possible Values:
 * - `"none"` - Do nothing when items expire.
 * - `"passive"` - Do nothing when items expire, but if an expired item is requested, remove it from the cache and return `undefined`.
 * - `"aggressive"` - Scan for expired items on the interval specified by the `recycleFreq` setting for this cache (defaults
 * to `1000ms`) and actively remove any expired items.
 *
 * ## Signature:
 * ```js
 * DSCache#setDeleteOnExpire(deleteOnExpire)
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 *
 * // Wait a few seconds
 *
 * cache.get('1'); // "apple"
 *
 * cache.setDeleteOnExpire('aggressive');
 *
 * // Wait a few seconds
 *
 * cache.get('1'); // undefined
 * ```
 *
 * ## Throws:
 * - `Error` - `deleteOnExpire` must be `null`, `"none"`, `"passive"` or `"aggressive"`.
 *
 * @param {string|null} deleteOnExpire The new deleteOnExpire for this cache. If `deleteOnExpire` is `null` then
 * `deleteOnExpire` for this cache will be reset to the default (`"none"`).
 */
module.exports = function setDeleteOnExpire(deleteOnExpire) {
  if (deleteOnExpire === null) {
    delete this.$$deleteOnExpire;
  } else if (!angular.isString(deleteOnExpire)) {
    throw angular.$$minErr('ng')('areq', 'Expected deleteOnExpire to be a string! Found: {0}.', typeof deleteOnExpire);
  } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
    throw angular.$$minErr('ng')('areq', 'Expected deleteOnExpire to be "none", "passive" or "aggressive"! Found: {0}.', deleteOnExpire);
  } else {
    this.$$deleteOnExpire = deleteOnExpire;
  }
  this.setRecycleFreq(this.$$recycleFreq);
};
