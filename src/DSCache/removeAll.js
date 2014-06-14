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
  if (this.$$storage) {
    this.$$lruHeap.removeAll();
    this.$$expiresHeap.removeAll();
    var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

    if (keysJson) {
      var keys = angular.fromJson(keysJson);

      for (var i = 0; i < keys.length; i++) {
        this.remove(keys[i]);
      }
    }
    this.$$storage.setItem(this.$$prefix + '.keys', angular.toJson([]));
  } else {
    this.$$lruHeap.removeAll();
    this.$$expiresHeap.removeAll();
    for (var key in this.$$data) {
      this.$$data[key] = null;
    }
    this.$$data = {};
  }
};
