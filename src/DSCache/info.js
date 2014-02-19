/**
 * @doc method
 * @id DSCache.methods:info
 * @name info
 * @description
 * Return the status of this cache, or if `key` is provided return the status of the item with that key.
 *
 * ## Signature:
 * ```js
 * DSCache#info([key])
 * ```
 *
 * ## Examples:
 * ```js
 * ```
 *
 * @param {string=} key The key of the item whose status is to be retrieved.
 * @returns {object} The status of this cache or the item for the given key.
 */
module.exports = function info(key) {
	if (key) {
		if (key in this.$$data) {
			var item = this.$$data[key];

			return {
				created: item.created,
				accessed: item.accessed,
				expires: item.expires,
				isExpired: (new Date().getTime() - item.created) > this.$$maxAge
			};
		} else {
			return undefined;
		}
	} else {
		return {
			id: this.$$id,
			capacity: this.$$capacity,
			maxAge: this.$$maxAge,
			deleteOnExpire: this.$$deleteOnExpire,
			onExpire: this.$$onExpire,
			cacheFlushInterval: this.$$cacheFlushInterval,
			recycleFreq: this.$$recycleFreq,
			storageMode: this.$$storageMode,
			storageImpl: this.$$storageImpl,
			disabled: this.$$disabled,
			size: this.$$lruHeap && this.$$lruHeap.size() || 0
		};
	}
};
