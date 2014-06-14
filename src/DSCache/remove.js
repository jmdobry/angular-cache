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
  if (this.$$storage) {
    var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

    if (itemJson) {
      var item = angular.fromJson(itemJson);
      this.$$lruHeap.remove({
        key: key,
        accessed: item.accessed
      });
      this.$$expiresHeap.remove({
        key: key,
        expires: item.expires
      });
      this.$$storage.removeItem(this.$$prefix + '.data.' + key);
      var keysJson = this.$$storage.getItem(this.$$prefix + '.keys'),
        keys = keysJson ? angular.fromJson(keysJson) : [],
        index = keys.indexOf(key);

      if (index >= 0) {
        keys.splice(index, 1);
      }
      this.$$storage.setItem(this.$$prefix + '.keys', angular.toJson(keys));
      return item.value;
    }
  } else {
    var value = this.$$data[key] ? this.$$data[key].value : undefined;
    this.$$lruHeap.remove(this.$$data[key]);
    this.$$expiresHeap.remove(this.$$data[key]);
    this.$$data[key] = null;
    delete this.$$data[key];
    return value;
  }
};
