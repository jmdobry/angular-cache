/**
 * @doc method
 * @id DSCache.methods:setOnExpire
 * @name setOnExpire
 * @description
 * Set the global `onExpire` callback for this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#setOnExpire(onExpire)
 * ```
 *
 * ## Examples:
 * ```js
 *  var options = {
 *      onExpire: function (key, value) {
 *          window.lastExpiredItem = key;
 *      },
 *      maxAge: 1000,
 *      deleteOnExpire: 'aggressive'
 *  };
 *  var cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *      window.lastExpiredItem; // '1'
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `cacheFlushInterval` must be `null` or a number greater than zero.
 *
 * @param {function|null} onExpire The new onExpire callback for this cache. If `onExpire` is `null` then the onExpire
 * callback for this cache will be removed.
 */
module.exports = function setOnExpire(onExpire) {
  if (onExpire === null) {
    delete this.$$onExpire;
  } else if (!angular.isFunction(onExpire)) {
    throw angular.$$minErr('ng')('areq', 'Expected onExpire to be a function! Found: {0}.', typeof onExpire);
  } else {
    this.$$onExpire = onExpire;
  }
};
