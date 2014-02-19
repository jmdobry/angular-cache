var defaults = require('../defaults'),
	utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:setCapacity
 * @name setCapacity
 * @description
 * Set the capacity for this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#setCapacity(capacity)
 * ```
 *
 * ## Example:
 * ```js
 * var smallCache = DSCacheFactory('smallCache', { capacity: 2 });
 *
 * smallCache.info().size; // 0
 *
 * smallCache.put('1', 'apple');
 * smallCache.put('2', 'banana');
 *
 * smallCache.info().size; // 2
 *
 * // Least-recently used items are removed
 * // when the cache's new capacity exceeds
 * // its size
 * smallCache.setCapacity(1);
 *
 * smallCache.get('1'); // undefined
 * smallCache.info().size; // 1
 * ```
 *
 * ## Throws:
 * - `Error` - `capacity` must be `null` or a number greater than zero.
 *
 * @param {number|null} capacity The new capacity for this cache. If `capacity` is `null` then the capacity for this cache
 * will be reset to the default (`Number.MAX_VALUE`).
 * @returns {object} Key-value pairs of any items removed because this cache's size exceeds the new capacity.
 */
function _setCapacity(capacity) {
	if (capacity === null) {
		delete this.$$capacity;
	} else if (!angular.isNumber(capacity)) {
		throw angular.$$minErr('ng')('areq', 'Expected capacity to be a number! Found: {0}.', typeof capacity);
	} else if (capacity < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected capacity to be greater than zero! Found: {0}.', capacity);
	} else {
		this.$$capacity = capacity;
	}
	var removed = {};
	while (this.$$lruHeap.size() > this.$$capacity) {
		removed[this.$$lruHeap.peek().key] = this.remove(this.$$lruHeap.peek().key);
	}
	return removed;
}

/**
 * @doc method
 * @id DSCache.methods:setDeleteOnExpire
 * @name setDeleteOnExpire
 * @description
 * Set the behavior for this cache for when items expire. This setting determines what this cache will do when one of
 * its items expires.
 *
 * ## Possible Values:
 * - `"none"` - Do nothing when items expire.
 * - `"passive"` - Do nothing when items expire, but if an expired item is requested, remove it from the cache and return `undefined`.
 * - `"aggressive"` - Scan for expired items on the interval specified by the `recycleFreq` setting for this cache (defaults
 * to `1000ms`) and actively remove any expired items.
 *
 * ## Signature:
 * ```js
 * DSCache#setDeleteOnExpire(deleteOnExpire)
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 *
 * // Wait a few seconds
 *
 * cache.get('1'); // "apple"
 *
 * cache.setDeleteOnExpire('aggressive');
 *
 * // Wait a few seconds
 *
 * cache.get('1'); // undefined
 * ```
 *
 * ## Throws:
 * - `Error` - `deleteOnExpire` must be `null`, `"none"`, `"passive"` or `"aggressive"`.
 *
 * @param {string|null} deleteOnExpire The new deleteOnExpire for this cache. If `deleteOnExpire` is `null` then
 * `deleteOnExpire` for this cache will be reset to the default (`"none"`).
 */
function _setDeleteOnExpire(deleteOnExpire) {
	if (deleteOnExpire === null) {
		delete this.$$deleteOnExpire;
	} else if (!angular.isString(deleteOnExpire)) {
		throw angular.$$minErr('ng')('areq', 'Expected deleteOnExpire to be a string! Found: {0}.', typeof deleteOnExpire);
	} else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
		throw angular.$$minErr('ng')('areq', 'Expected deleteOnExpire to be "none", "passive" or "aggressive"! Found: {0}.', deleteOnExpire);
	} else {
		this.$$deleteOnExpire = deleteOnExpire;
	}
	this.setRecycleFreq(this.$$recycleFreq);
}

/**
 * @doc method
 * @id DSCache.methods:setMaxAge
 * @name setMaxAge
 * @description
 * Set the `maxAge` setting for this cache. This setting specifies how long items can be in the cache before they expire.
 *
 * ## Signature:
 * ```js
 * DSCache#setMaxAge(maxAge)
 * ```
 *
 * ## Example:
 * ```js
 *  var cache = DSCacheFactory('cache', { deleteOnExpire: 'aggressive' });
 *
 *  // This won't expire for a long time
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *      // 'apple' will be removed because it
 *      // has already been in the cache longer
 *      // than the new maxAge
 *      var removed = cache.setMaxAge(1000);
 *
 *      removed; // {
 *               //     '1': 'apple'
 *               // }
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `maxAge must be `null` or a number greater than zero.
 *
 * @param {number} maxAge The new maxAge for this cache in milliseconds. If `maxAge` is `null` then `maxAge` for this
 * cache will be reset to the default (`Number.MAX_VALUE`);
 * @returns {object} Key-value pairs of any items aggressively removed because they are expired according to the new
 * `maxAge`. Items are only removed if the `deleteOnExpire` setting for this cache is set to `"aggressive"`.
 */
function _setMaxAge(maxAge) {
	if (maxAge === null) {
		delete this.$$maxAge;
	} else if (!angular.isNumber(maxAge)) {
		throw angular.$$minErr('ng')('areq', 'Expected maxAge to be a number! Found: {0}.', typeof maxAge);
	} else if (maxAge < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected maxAge to be greater than zero! Found: {0}.', maxAge);
	} else {
		this.$$maxAge = maxAge;
	}
	var i, keys, key;

	this.$$expiresHeap.removeAll();

	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

		keys = keysJson ? angular.fromJson(keysJson) : [];

		for (i = 0; i < keys.length; i++) {
			key = keys[i];
			var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

			if (itemJson) {
				var item = angular.fromJson(itemJson);
				if (this.$$maxAge === Number.MAX_VALUE) {
					item.expires = Number.MAX_VALUE;
				} else {
					item.expires = item.created + this.$$maxAge;
				}
				this.$$expiresHeap.push({
					key: key,
					expires: item.expires
				});
			}
		}
	} else {
		keys = utils.keys(this.$$data);

		for (i = 0; i < keys.length; i++) {
			key = keys[i];
			if (this.$$maxAge === Number.MAX_VALUE) {
				this.$$data[key].expires = Number.MAX_VALUE;
			} else {
				this.$$data[key].expires = this.$$data[key].created + this.$$maxAge;
			}
			this.$$expiresHeap.push(this.$$data[key]);
		}
	}
	if (this.$$deleteOnExpire === 'aggressive') {
		return this.removeExpired();
	} else {
		return {};
	}
}

/**
 * @doc method
 * @id DSCache.methods:setRecycleFreq
 * @name setRecycleFreq
 * @description
 * Set the `recycleFreq` setting for this cache. This setting determines how often this cache will scan for expired
 * items. The cache will only scan for expired items if the `deleteOnExpire` setting for this cache is set to
 * `"aggressive"`.
 *
 * ## Signature:
 * ```js
 * DSCache#setRecycleFreq(recycleFreq)
 * ```
 *
 * ## Example:
 * ```js
 *  var options = {
 *      deleteOnExpire: 'aggressive',
 *      maxAge: 1000
 *  };
 *  var cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *
 *      cache.get('1'); // undefined
 *      cache.setRecycleFreq(60000);
 *
 *      // This expires after 1 second, but the cache
 *      // only checks every 60 seconds now
 *      cache.put('1', 'apple');
 *
 *      setTimeout(function () {
 *          // expired, but won't be removed
 *          // until the next check
 *          cache.get('1'); // "apple"
 *          cache.info('1').isExpired; // true
 *      }, 1500);
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `recycleFreq` must be `null` or a number greater than zero.
 *
 * @param {number} recycleFreq The new recycleFreq for this cache in milliseconds. If `recycleFreq` is `null` then
 * `recycleFreq` for this cache will be reset to the default (`1000` milliseconds).
 */
function _setRecycleFreq(recycleFreq) {
	if (recycleFreq === null) {
		delete this.$$recycleFreq;
	} else if (!angular.isNumber(recycleFreq)) {
		throw angular.$$minErr('ng')('areq', 'Expected recycleFreq to be a number! Found: {0}.', typeof recycleFreq);
	} else if (recycleFreq < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected recycleFreq to be greater than zero! Found: {0}.', recycleFreq);
	} else {
		this.$$recycleFreq = recycleFreq;
	}
	clearInterval(this.$$recycleFreqId);
	if (this.$$deleteOnExpire === 'aggressive') {
		(function (_this) {
			_this.$$recycleFreqId = setInterval(function () {
				_this.removeExpired();
			}, _this.$$recycleFreq);
		})(this);
	} else {
		delete this.$$recycleFreqId;
	}
}

/**
 * @doc method
 * @id DSCache.methods:setCacheFlushInterval
 * @name setCacheFlushInterval
 * @description
 * Set the `cacheFlushInterval` setting for this cache. If set, this setting will cause this cache to periodically
 * clear itself.
 *
 * ## Signature:
 * ```js
 * DSCache#setCacheFlushInterval(cacheFlushInterval)
 * ```
 *
 * ## Example:
 * ```js
 *  var cache = DSCacheFactory('cache');
 *
 *  cache.put('1', 'apple');
 *  cache.put('2', 'banana');
 *
 *  cache.info().size; // 2
 *  cache.setCacheFlushInterval(60000);
 *
 *  setTimeout(function () {
 *      cache.info().size; // 0
 *  }, 90000);
 * ```
 *
 * ## Throws:
 * - `Error` - `cacheFlushInterval` must be `null` or a number greater than zero.
 *
 * @param {number|null} cacheFlushInterval The new cacheFlushInterval for this cache in milliseconds. If
 * `cacheFlushInterval` is `null` then `cacheFlushInterval` for this cache will be reset to the default (`null`).
 */
function _setCacheFlushInterval(cacheFlushInterval) {
	if (cacheFlushInterval === null) {
		delete this.$$cacheFlushInterval;
	} else if (!angular.isNumber(cacheFlushInterval)) {
		throw angular.$$minErr('ng')('areq', 'Expected cacheFlushInterval to be a number! Found: {0}.', typeof cacheFlushInterval);
	} else if (cacheFlushInterval < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected cacheFlushInterval to be greater than zero! Found: {0}.', cacheFlushInterval);
	} else if (cacheFlushInterval !== this.$$cacheFlushInterval) {
		this.$$cacheFlushInterval = cacheFlushInterval;
		clearInterval(this.$$cacheFlushIntervalId);
		(function (_this) {
			_this.$$cacheFlushIntervalId = setInterval(function () {
				_this.removeAll();
			}, _this.$$cacheFlushInterval);
		})(this);
	}
}

/**
 * @doc method
 * @id DSCache.methods:setOnExpire
 * @name setOnExpire
 * @description
 * Set the global `onExpire` callback for this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#setOnExpire(onExpire)
 * ```
 *
 * ## Examples:
 * ```js
 *  var options = {
 *      onExpire: function (key, value) {
 *          window.lastExpiredItem = key;
 *      },
 *      maxAge: 1000,
 *      deleteOnExpire: 'aggressive'
 *  };
 *  var cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *      window.lastExpiredItem; // '1'
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `cacheFlushInterval` must be `null` or a number greater than zero.
 *
 * @param {function|null} onExpire The new onExpire callback for this cache. If `onExpire` is `null` then the onExpire
 * callback for this cache will be removed.
 */
function _setOnExpire(onExpire) {
	if (onExpire === null) {
		delete this.$$onExpire;
	} else if (!angular.isFunction(onExpire)) {
		throw angular.$$minErr('ng')('areq', 'Expected onExpire to be a function! Found: {0}.', typeof onExpire);
	} else {
		this.$$onExpire = onExpire;
	}
}

/*!
 * Configure the cache to use webStorage.
 */
function _setStorageMode(storageMode, storageImpl) {
	var $window = angular.injector(['ng']).get('$window');

	if (!angular.isString(storageMode)) {
		throw angular.$$minErr('ng')('areq', 'Expected storageMode to be a string! Found: {0}.', typeof storageMode);
	} else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
		throw angular.$$minErr('ng')('areq', 'Expected storageMode to be "memory", "localStorage" or "sessionStorage"! Found: {0}.', storageMode);
	}

	this.$$storageMode = storageMode;

	if (storageImpl) {
		if (!angular.isObject(storageImpl)) {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to be an object! Found: {0}.', typeof storageImpl);
		} else if (!('setItem' in storageImpl) || typeof storageImpl.setItem !== 'function') {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to implement "setItem(key, value)"! Found: {0}.', typeof storageImpl.setItem);
		} else if (!('getItem' in storageImpl) || typeof storageImpl.getItem !== 'function') {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to implement "getItem(key)"! Found: {0}.', typeof storageImpl.getItem);
		} else if (!('removeItem' in storageImpl) || typeof storageImpl.removeItem !== 'function') {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to implement "removeItem(key)"! Found: {0}.', typeof storageImpl.removeItem);
		}
		this.$$storage = storageImpl;
	} else if (this.$$storageMode === 'localStorage') {
		this.$$storage = $window.localStorage;
	} else if (this.$$storageMode === 'sessionStorage') {
		this.$$storage = $window.sessionStorage;
	}
}

/**
 * @doc method
 * @id DSCache.methods:setOptions
 * @name setOptions
 * @description
 * Configure this cache with the given options. With this method you can configure all of this cache's settings at once.
 *
 * ## Signature:
 * ```js
 * DSCache#setOptions(cacheOptions[, strict])
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @param {object} cacheOptions New configuration options for the cache.
 * @param {boolean=} strict If true then any existing configuration will be reset to the defaults before
 * applying the new options, otherwise only the options specified in the options hash will be altered.
 */
function _setOptions(cacheOptions, strict) {
	cacheOptions = cacheOptions || {};
	strict = !!strict;
	if (!angular.isObject(cacheOptions)) {
		throw angular.$$minErr('ng')('areq', 'Expected cacheOptions to be an object! Found: {0}.', typeof cacheOptions);
	}

	if ('disabled' in cacheOptions) {
		this.$$disabled = !!cacheOptions.disabled;
	} else if (strict) {
		delete this.$$disabled;
	}

	if ('capacity' in cacheOptions) {
		this.setCapacity(cacheOptions.capacity);
	} else if (strict) {
		this.setCapacity(null);
	}

	if ('deleteOnExpire' in cacheOptions) {
		this.setDeleteOnExpire(cacheOptions.deleteOnExpire);
	} else if (strict) {
		this.setDeleteOnExpire(null);
	}

	if ('maxAge' in cacheOptions) {
		this.setMaxAge(cacheOptions.maxAge);
	} else if (strict) {
		this.setMaxAge(null);
	}

	if ('recycleFreq' in cacheOptions) {
		this.setRecycleFreq(cacheOptions.recycleFreq);
	} else if (strict) {
		this.setRecycleFreq(null);
	}

	if ('cacheFlushInterval' in cacheOptions) {
		this.setCacheFlushInterval(cacheOptions.cacheFlushInterval);
	} else if (strict) {
		this.setCacheFlushInterval(null);
	}

	if ('onExpire' in cacheOptions) {
		this.setOnExpire(cacheOptions.onExpire);
	} else if (strict) {
		this.setOnExpire(null);
	}
}

/**
 * @class DSCache
 * @desc Instantiated via <code>$angularCacheFactory(cacheId[, options])</code>
 * @param {string} cacheId The id of the new cache.
 * @param {object} [options] See [Configuration Options]{@link https://github.com/jmdobry/angular-cache#configuration}.
 */
function DSCache(cacheId, options) {

	this.$$data = {};
	this.$$id = cacheId;
	this.$$prefix = 'angular-cache.caches.' + cacheId;
	this.$$storage = null;

	this.$$expiresHeap = new DSBinaryHeap(function (x) {
		return x.expires;
	});

	this.$$lruHeap = new DSBinaryHeap(function (x) {
		return x.accessed;
	});

	options = options || {};

	if ('storageMode' in options) {
		_setStorageMode.apply(this, [options.storageMode, options.storageImpl]);
	}

	// Initialize this cache with the default and given options
	_setOptions.apply(this, [options, true]);
}

for (var key in defaults.defaults) {
	DSCache.prototype['$$' + key] = defaults.defaults[key];
}

DSCache.prototype.setOptions = _setOptions;
DSCache.prototype.setCapacity = _setCapacity;
DSCache.prototype.setDeleteOnExpire = _setDeleteOnExpire;
DSCache.prototype.setMaxAge = _setMaxAge;
DSCache.prototype.setRecycleFreq = _setRecycleFreq;
DSCache.prototype.setCacheFlushInterval = _setCacheFlushInterval;
DSCache.prototype.setOnExpire = _setOnExpire;
DSCache.prototype.put = require('./put');
DSCache.prototype.get = require('./get');
DSCache.prototype.remove = require('./remove');
DSCache.prototype.removeAll = require('./removeAll');
DSCache.prototype.removeExpired = require('./removeExpired');
DSCache.prototype.destroy = require('./destroy');
DSCache.prototype.info = require('./info');
DSCache.prototype.keySet = require('./keySet');
DSCache.prototype.keys = require('./keys');

/**
 * @doc method
 * @id DSCache.methods:disable
 * @name disable
 * @description
 * Disable this cache. Disabling a cache does not remove any data, it just turns DSCache#get and DSCache#put into noops.
 *
 * ## Signature:
 * ```js
 * DSCache#disable()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 */
DSCache.prototype.disable = function () {
	this.$$disabled = true;
};

/**
 * @doc method
 * @id DSCache.methods:enable
 * @name enable
 * @description
 * Enable this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#enable()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 */
DSCache.prototype.enable = function () {
	delete this.$$disabled;
};

module.exports = DSCache;
