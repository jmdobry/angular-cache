/**
 * @doc method
 * @id DSCache.methods:remove
 * @name remove
 * @description
 * Remove the item with the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#remove(key)
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 *
 * cache.get('1'); // "apple"
 *
 * cache.remove('1'); // "apple"
 *
 * cache.get('1'); // undefined
 * ```
 *
 * @param {string} key The key of the item to remove.
 * @returns {*} The removed item if an item was removed.
 */
module.exports = function remove(key) {
  var _this = this;
  delete _this.$$promises[key];
  if (_this.$$storage) {
    var itemJson = _this.$$storage.getItem(_this.$$prefix + '.data.' + key);

    if (itemJson) {
      var item = angular.fromJson(itemJson);
      _this.$$lruHeap.remove({
        key: key,
        accessed: item.accessed
      });
      _this.$$expiresHeap.remove({
        key: key,
        expires: item.expires
      });
      _this.$$storage.removeItem(_this.$$prefix + '.data.' + key);
      var keysJson = _this.$$storage.getItem(_this.$$prefix + '.keys'),
        keys = keysJson ? angular.fromJson(keysJson) : [],
        index = keys.indexOf(key);

      if (index >= 0) {
        keys.splice(index, 1);
      }
      _this.$$storage.setItem(_this.$$prefix + '.keys', angular.toJson(keys));
      return item.value;
    }
  } else {
    var value = _this.$$data[key] ? _this.$$data[key].value : undefined;
    _this.$$lruHeap.remove(_this.$$data[key]);
    _this.$$expiresHeap.remove(_this.$$data[key]);
    _this.$$data[key] = null;
    delete _this.$$data[key];
    return value;
  }
};
