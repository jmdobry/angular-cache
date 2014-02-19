var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:keySet
 * @name keySet
 * @description
 * Return an object of the keys in this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#keySet()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @returns {object} An object of the keys in this cache.
 */
module.exports = function keySet() {
	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys'),
			kSet = {};

		if (keysJson) {
			var keys = angular.fromJson(keysJson);

			for (var i = 0; i < keys.length; i++) {
				kSet[keys[i]] = keys[i];
			}
		}
		return kSet;
	} else {
		return utils.keySet(this.$$data);
	}
};
