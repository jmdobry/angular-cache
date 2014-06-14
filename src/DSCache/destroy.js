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
  clearInterval(this.$$cacheFlushIntervalId);
  clearInterval(this.$$recycleFreqId);
  this.removeAll();
  if (this.$$storage) {
    this.$$storage.removeItem(this.$$prefix + '.keys');
    this.$$storage.removeItem(this.$$prefix);
  }
  this.$$storage = null;
  this.$$data = null;
  this.$$lruHeap = null;
  this.$$expiresHeap = null;
  this.$$prefix = null;
};
