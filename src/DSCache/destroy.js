/**
 * @doc method
 * @id DSCache.methods:destroy
 * @name destroy
 * @description
 * Destroy this cache and all of its data.
 *
 * ## Signature:
 * ```js
 * DSCache#destroy()
 * ```
 *
 * ## Example:
 * ```js
 * var someCache = DSCacheFactory.get('someCache');
 *
 * someCache.destroy();
 *
 * DSCacheFactory.get('someCache'); // undefined
 * someCache.put('1', 'apple'); // Error
 * ```
 */
module.exports = function destroy() {
  var _this = this;
  clearInterval(_this.$$cacheFlushIntervalId);
  clearInterval(_this.$$recycleFreqId);
  _this.removeAll();
  if (_this.$$storage) {
    _this.$$storage().removeItem(_this.$$prefix + '.keys');
    _this.$$storage().removeItem(_this.$$prefix);
  }
  _this.$$storage = null;
  _this.$$data = null;
  _this.$$lruHeap = null;
  _this.$$expiresHeap = null;
  _this.$$prefix = null;
};
