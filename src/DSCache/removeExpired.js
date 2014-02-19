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
 * ```
 *
 * @returns {object} The removed items, if any.
 */
module.exports = function removeExpired() {
	var now = new Date().getTime(),
		expired = {},
		key,
		expiredItem;

	while ((expiredItem = this.$$expiresHeap.peek()) && expiredItem.expires < now) {
		expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;
		this.$$expiresHeap.pop();
	}

	if (this.$$storage) {
		for (key in expired) {
			var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);
			if (itemJson) {
				expired[key] = angular.fromJson(itemJson).value;
				this.remove(key);
			}
		}
	} else {
		for (key in expired) {
			this.remove(key);
		}
	}

	if (this.$$onExpire) {
		for (key in expired) {
			this.$$onExpire(key, expired[key]);
		}
	}

	return expired;
};
