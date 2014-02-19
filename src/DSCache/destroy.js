/**
 * @doc method
 * @id DSCache.methods:destroy
 * @name destroy
 * @description
 * Destroy this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#destroy()
 * ```
 *
 * ## Example:
 * ```js
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
