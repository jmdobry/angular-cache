var defaults = require('../defaults');

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

/*!
 * @doc function
 * @id DSCache
 * @name DSCache
 * @description
 * Instantiated via <code>$angularCacheFactory(cacheId[, options])</code>
 * @param {string} cacheId The id of the new cache.
 * @param {object=} options Configuration options.
 */
function DSCache(cacheId, options) {

	this.$$data = {};
	this.$$id = cacheId;
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
	if ('storagePrefix' in options) {
		this.$$storagePrefix = options.storagePrefix;
	}

	this.$$prefix = this.$$storagePrefix + cacheId;

	// Initialize this cache with the default and given options
	_setOptions.apply(this, [options, true]);
}

for (var key in defaults.defaults) {
	DSCache.prototype['$$' + key] = defaults.defaults[key];
}

DSCache.prototype.setOptions = _setOptions;
DSCache.prototype.setCapacity = require('./setCapacity');
DSCache.prototype.setDeleteOnExpire = require('./setDeleteOnExpire');
DSCache.prototype.setMaxAge = require('./setMaxAge');
DSCache.prototype.setRecycleFreq = require('./setRecycleFreq');
DSCache.prototype.setCacheFlushInterval = require('./setCacheFlushInterval');
DSCache.prototype.setOnExpire = require('./setOnExpire');
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
