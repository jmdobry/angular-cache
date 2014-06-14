var defaults = require('../defaults'),
  DSBinaryHeap = require('../DSBinaryHeap').DSBinaryHeap;

/*!
 * Configure the cache to use webStorage.
 */
function _setStorageMode(storageMode, storageImpl) {
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
    try {
      localStorage.setItem('angular-cache', 'angular-cache');
      localStorage.removeItem('angular-cache');
      this.$$storage = localStorage;
    } catch (e) {
      delete this.$$storage;
      this.$$storageMode = 'memory';
    }
  } else if (this.$$storageMode === 'sessionStorage') {
    try {
      sessionStorage.setItem('angular-cache', 'angular-cache');
      sessionStorage.removeItem('angular-cache');
      this.$$storage = sessionStorage;
    } catch (e) {
      delete this.$$storage;
      this.$$storageMode = 'memory';
    }
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
 *  cache.setOptions({
 *      maxAge: 60000,
 *      deleteOnExpire: 'aggressive',
 *      disabled: false
 *  });
 * ```
 *
 * @param {object} cacheOptions New configuration options for the cache. Properties:
 *
 * - `{number=}` - `capacity` - Default: `Number.MAX_VALUE`
 * - `{number=}` - `maxAge` - Default: `null`
 * - `{number=}` - `deleteOnExpire` - Default: `none`
 * - `{function=}` - `onExpire` - Default: `null`
 * - `{number=}` - `cacheFlushInterval` - Default: `null`
 * - `{number=}` - `recycleFreq` - Default: `1000`
 * - `{boolean=}` - `disabled` - Default: `false`
 *
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
 * @doc function
 * @id DSCache
 * @name DSCache
 * @description
 * Instantiated via `DSCacheFactory(cacheId[, options])`.
 *
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

/**
 * @doc method
 * @id DSCache.methods:setOptions
 * @name setOptions
 * @methodOf DSCache
 * @description
 * See [DSCache.setOptions](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setOptions = _setOptions;

/**
 * @doc method
 * @id DSCache.methods:setCapacity
 * @name setCapacity
 * @methodOf DSCache
 * @description
 * See [DSCache.setCapacity](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setCapacity = require('./setCapacity');

/**
 * @doc method
 * @id DSCache.methods:setDeleteOnExpire
 * @name setDeleteOnExpire
 * @methodOf DSCache
 * @description
 * See [DSCache.setDeleteOnExpire](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setDeleteOnExpire = require('./setDeleteOnExpire');

/**
 * @doc method
 * @id DSCache.methods:setMaxAge
 * @name setMaxAge
 * @methodOf DSCache
 * @description
 * See [DSCache.setMaxAge](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setMaxAge = require('./setMaxAge');

/**
 * @doc method
 * @id DSCache.methods:setRecycleFreq
 * @name setRecycleFreq
 * @methodOf DSCache
 * @description
 * See [DSCache.setRecycleFreq](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setRecycleFreq = require('./setRecycleFreq');

/**
 * @doc method
 * @id DSCache.methods:setCacheFlushInterval
 * @name setCacheFlushInterval
 * @methodOf DSCache
 * @description
 * See [DSCache.setCacheFlushInterval](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setCacheFlushInterval = require('./setCacheFlushInterval');

/**
 * @doc method
 * @id DSCache.methods:setOnExpire
 * @name setOnExpire
 * @methodOf DSCache
 * @description
 * See [DSCache.setOnExpire](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.setOnExpire = require('./setOnExpire');

/**
 * @doc method
 * @id DSCache.methods:put
 * @name put
 * @methodOf DSCache
 * @description
 * See [DSCache.put](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.put = require('./put');

/**
 * @doc method
 * @id DSCache.methods:get
 * @name get
 * @methodOf DSCache
 * @description
 * See [DSCache.get](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.get = require('./get');

/**
 * @doc method
 * @id DSCache.methods:remove
 * @name remove
 * @methodOf DSCache
 * @description
 * See [DSCache.remove](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.remove = require('./remove');

/**
 * @doc method
 * @id DSCache.methods:removeAll
 * @name removeAll
 * @methodOf DSCache
 * @description
 * See [DSCache.removeAll](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.removeAll = require('./removeAll');

/**
 * @doc method
 * @id DSCache.methods:removeExpired
 * @name removeExpired
 * @methodOf DSCache
 * @description
 * See [DSCache.removeExpired](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.removeExpired = require('./removeExpired');

/**
 * @doc method
 * @id DSCache.methods:destroy
 * @name destroy
 * @methodOf DSCache
 * @description
 * See [DSCache.destroy](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.destroy = require('./destroy');

/**
 * @doc method
 * @id DSCache.methods:info
 * @name info
 * @methodOf DSCache
 * @description
 * See [DSCache.info](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.info = require('./info');

/**
 * @doc method
 * @id DSCache.methods:keySet
 * @name keySet
 * @methodOf DSCache
 * @description
 * See [DSCache.keySet](/documentation/api/angular-cache/DSCache.methods:create).
 */
DSCache.prototype.keySet = require('./keySet');

/**
 * @doc method
 * @id DSCache.methods:keys
 * @name keys
 * @methodOf DSCache
 * @description
 * See [DSCache.keys](/documentation/api/angular-cache/DSCache.methods:create).
 */
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
 *  var cache = DSCacheFactory.get('cache');
 *
 *  cache.put('1', 'apple');
 *  cache.get('1'); // "apple"
 *  cache.info().size; // 1
 *
 *  cache.disable();
 *  cache.info().size; // 1
 *
 *  cache.get('1'); // undefined
 *  cache.put('2', 'banana'); // undefined
 *  cache.get('2'); // undefined
 *  cache.info().size; // 1
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
 *  var options = {
 *      disabled: true
 *  };
 *  var cache = DSCacheFactory.get('cache', options);
 *
 *  cache.put('1', 'apple');
 *  cache.get('1'); // undefined
 *
 *  cache.enable();
 *
 *  cache.put('1', 'apple');
 *  cache.get('1'); // "apple"
 * ```
 */
DSCache.prototype.enable = function () {
  delete this.$$disabled;
};

/**
 * @doc method
 * @id DSCache.methods:touch
 * @name touch
 * @description
 * Reset the expiry of a single item or all items in the cache.
 *
 * ## Signature:
 * ```js
 * DSCache#touch(key)
 * ```
 *
 * ## Example:
 * ```js
 *  cache.touch('1'); // touch one item
 *
 *  cache.touch(); // touch all items
 * ```
 *
 * @param {string=} key The key of the item to touch.
 */
DSCache.prototype.touch = function (key) {
  if (key) {
    var _this = this;
    var val = this.get(key, {
      onExpire: function (k, v) {
        _this.put(k, v);
      }
    });
    if (val) {
      this.put(key, val);
    }
  } else {
    var keys = this.keys();
    for (var i = 0; i < keys.length; i++) {
      this.touch(keys[i]);
    }
  }
};

module.exports = DSCache;
