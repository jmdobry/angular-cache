/**
 * @doc method
 * @id DSCache.methods:removeExpired
 * @name removeExpired
 * @description
 * Remove and return all expired items from the cache.
 *
 * ## Signature:
 * ```js
 * DSCache#removeExpired()
 * ```
 *
 * ## Example:
 * ```js
 *  var options = {
 *          maxAge: 1000
 *      },
 *      // deleteOnExpire defaults to "none"
 *      cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *  cache.put('2', 'banana');
 *
 *  setTimeout(function () {
 *      cache.put('3', 'orange');
 *
 *      cache.info().size; // 3
 *      cache.info('1').isExpired; // true
 *      cache.info('2').isExpired; // true
 *      cache.info('3').isExpired; // false
 *
 *      cache.removeExpired(); // { "1": "apple", "2": "banana" }
 *
 *      cache.info().size; // 1
 *      cache.get('1'); // undefined
 *      cache.get('2'); // undefined
 *      cache.info('3').isExpired; // false
 *  }, 1500);
 * ```
 *
 * @returns {object} The removed items, if any.
 */
module.exports = function removeExpired() {
  var _this = this;
  var now = new Date().getTime();
  var expired = {};
  var key;
  var expiredItem;

  while ((expiredItem = _this.$$expiresHeap.peek()) && expiredItem.expires < now) {
    expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;
    _this.$$expiresHeap.pop();
  }

  if (_this.$$storage) {
    for (key in expired) {
      var itemJson = _this.$$storage().getItem(_this.$$prefix + '.data.' + key);
      if (itemJson) {
        expired[key] = angular.fromJson(itemJson).value;
        _this.remove(key);
      }
    }
  } else {
    for (key in expired) {
      _this.remove(key);
    }
  }

  if (_this.$$onExpire) {
    for (key in expired) {
      _this.$$onExpire(key, expired[key]);
    }
  }

  return expired;
};
