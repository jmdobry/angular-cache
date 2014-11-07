/**
 * @doc method
 * @id DSCache.methods:removeAll
 * @name removeAll
 * @description
 * Remove all items from this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#removeAll()
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 * cache.put('2', 'banana');
 * cache.info().size; // 2
 *
 * cache.get('1'); // "apple"
 * cache.get('2'); // "banana"
 *
 * cache.removeAll();
 * cache.info().size; // 0
 *
 * cache.get('1'); // undefined
 * cache.get('2'); // undefined
 * ```
 */
module.exports = function removeAll() {
  var _this = this;
  if (_this.$$storage) {
    _this.$$lruHeap.removeAll();
    _this.$$expiresHeap.removeAll();
    var keysJson = _this.$$storage.getItem(_this.$$prefix + '.keys');

    if (keysJson) {
      var keys = angular.fromJson(keysJson);

      for (var i = 0; i < keys.length; i++) {
        _this.remove(keys[i]);
      }
    }
    _this.$$storage.setItem(_this.$$prefix + '.keys', angular.toJson([]));
  } else {
    _this.$$lruHeap.removeAll();
    _this.$$expiresHeap.removeAll();
    for (var key in _this.$$data) {
      _this.$$data[key] = null;
    }
    _this.$$data = {};
  }
};
