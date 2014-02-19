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
 * ```
 */
module.exports = function removeAll() {
	if (this.$$storage) {
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
