var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:get
 * @name get
 * @description
 * Retrieve the item with the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#get(key)
 * ```
 *
 * ## Examples:
 * ```js
 * ```
 *
 * @param {string} key The key of the item to retrieve.
 * @param {object=} options Optional configuration. Properties:
 * - `{function=}` - `onExpire` - Callback to be used if in passive `deleteOnExpire` mode and the requested item has
 * expired.
 * @returns {*} The item with the given key.
 */
module.exports = function get(key, options) {
	var _this = this;

	if (angular.isArray(key)) {
		var keys = key,
			values = [];

		angular.forEach(keys, function (key) {
			var value = _this.get(key, options);
			if (value !== null && value !== undefined) {
				values.push(value);
			}
		});

		return values;
	} else {
		key = utils.stringifyNumber(key);

		if (this.$$disabled) {
			return;
		}
	}

	options = options || {};
	if (!angular.isString(key)) {
		throw angular.$$minErr('ng')('areq', 'Expected key to be a string! Found: {0}.', typeof key);
	} else if (options && !angular.isObject(options)) {
		throw angular.$$minErr('ng')('areq', 'Expected options to be an object! Found: {0}.', typeof options);
	} else if (options.onExpire && !angular.isFunction(options.onExpire)) {
		throw angular.$$minErr('ng')('areq', 'Expected options.onExpire to be a function! Found: {0}.', typeof options.onExpire);
	}

	var item;

	if (this.$$storage) {
		var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

		if (itemJson) {
			item = angular.fromJson(itemJson);
		} else {
			return;
		}
	} else {
		if (!(key in this.$$data)) {
			return;
		}

		item = this.$$data[key];
	}

	var value = item.value,
		now = new Date().getTime();

	if (this.$$storage) {
		this.$$lruHeap.remove({
			key: key,
			accessed: item.accessed
		});
		item.accessed = now;
		this.$$lruHeap.push({
			key: key,
			accessed: now
		});
	} else {
		this.$$lruHeap.remove(item);
		item.accessed = now;
		this.$$lruHeap.push(item);
	}

	if (this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
		this.remove(key);

		if (this.$$onExpire) {
			this.$$onExpire(key, item.value, options.onExpire);
		} else if (options.onExpire) {
			options.onExpire(key, item.value);
		}
		value = undefined;
	} else if (this.$$storage) {
		this.$$storage.setItem(this.$$prefix + '.data.' + key, angular.toJson(item));
	}

	return value;
};
