/**
 * @doc method
 * @id DSCache.methods:setRecycleFreq
 * @name setRecycleFreq
 * @description
 * Set the `recycleFreq` setting for this cache. This setting determines how often this cache will scan for expired
 * items. The cache will only scan for expired items if the `deleteOnExpire` setting for this cache is set to
 * `"aggressive"`.
 *
 * ## Signature:
 * ```js
 * DSCache#setRecycleFreq(recycleFreq)
 * ```
 *
 * ## Example:
 * ```js
 *  var options = {
 *      deleteOnExpire: 'aggressive',
 *      maxAge: 1000
 *  };
 *  var cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *
 *      cache.get('1'); // undefined
 *      cache.setRecycleFreq(60000);
 *
 *      // This expires after 1 second, but the cache
 *      // only checks every 60 seconds now
 *      cache.put('1', 'apple');
 *
 *      setTimeout(function () {
 *          // expired, but won't be removed
 *          // until the next check
 *          cache.get('1'); // "apple"
 *          cache.info('1').isExpired; // true
 *      }, 1500);
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `recycleFreq` must be `null` or a number greater than zero.
 *
 * @param {number} recycleFreq The new recycleFreq for this cache in milliseconds. If `recycleFreq` is `null` then
 * `recycleFreq` for this cache will be reset to the default (`1000` milliseconds).
 */
module.exports = function setRecycleFreq(recycleFreq) {
  if (recycleFreq === null) {
    delete this.$$recycleFreq;
  } else if (!angular.isNumber(recycleFreq)) {
    throw angular.$$minErr('ng')('areq', 'Expected recycleFreq to be a number! Found: {0}.', typeof recycleFreq);
  } else if (recycleFreq < 0) {
    throw angular.$$minErr('ng')('areq', 'Expected recycleFreq to be greater than zero! Found: {0}.', recycleFreq);
  } else {
    this.$$recycleFreq = recycleFreq;
  }
  clearInterval(this.$$recycleFreqId);
  if (this.$$deleteOnExpire === 'aggressive') {
    (function (_this) {
      _this.$$recycleFreqId = setInterval(function () {
        _this.removeExpired();
      }, _this.$$recycleFreq);
    })(this);
  } else {
    delete this.$$recycleFreqId;
  }
};
