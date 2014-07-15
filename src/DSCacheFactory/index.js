var defaults = require('../defaults'),
  DSCache = require('../DSCache'),
  version = '<%= pkg.version %>';

/**
 * @doc function
 * @id DSCacheFactoryProvider
 * @name DSCacheFactoryProvider
 */
function DSCacheFactoryProvider() {

  var config = new defaults.Config();

  this.version = version;

  /**
   * @doc method
   * @id DSCacheFactoryProvider.methods:setCacheDefaults
   * @name setCacheDefaults
   * @desc Set the default configuration for all caches created by $angularCacheFactory.
   * @param {object} options Default configuration options for each new cache.
   */
  this.setCacheDefaults = function (options) {
    options = options || {};

    if (!angular.isObject(options)) {
      throw angular.$$minErr('ng')('areq', 'Expected options to be an object! Found: {0}.', typeof options);
    }

    for (var key in defaults.defaults) {
      if (key in options) {
        config[key] = options[key];
      }
    }
    if ('disabled' in options) {
      config.$$disabled = !!options.disabled;
    }
  };

  this.$get = function () {
    var caches = {};

    /*!
     * @method _keys
     * @desc Returns an array of the keys of the given collection.
     * @param {object} collection The collection from which to get the keys.
     * @returns {array} An array of the keys of the given collection.
     */
    function _keys(collection) {
      var keys = [], key;
      for (key in collection) {
        if (collection.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys;
    }

    function createCache(cacheId, options) {
      if (cacheId in caches) {
        throw angular.$$minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
      } else if (!angular.isString(cacheId)) {
        throw angular.$$minErr('ng')('areq', 'Expected cacheId to be a string! Found: {0}.', typeof cacheId);
      }

      caches[cacheId] = new DSCache(cacheId, angular.extend({}, config, options));
      caches[cacheId].destroy = function () {
        this.constructor.prototype.destroy.call(this);
        delete caches[this.$$id];
      };
      return caches[cacheId];
    }

    /**
     * @doc function
     * @id DSCacheFactory
     * @name DSCacheFactory
     * @description
     * Factory function that produces instances of `DSCache`.
     *
     * @param {string} cacheId The id of the new cache.
     * @param {object} options Configuration options. Properties:
     *
     * - `{number=}` - `capacity` - Default: `Number.MAX_VALUE`
     * - `{number=}` - `maxAge` - Default: `null`
     * - `{number=}` - `deleteOnExpire` - Default: `none`
     * - `{function=}` - `onExpire` - Default: `null`
     * - `{number=}` - `cacheFlushInterval` - Default: `null`
     * - `{number=}` - `recycleFreq` - Default: `1000`
     * - `{number=}` - `deleteOnExpire` - Default: `null`
     * - `{string=}` - `storageMode` - Default: `'none`
     * - `{object=}` - `storageImpl` - Default: `null`
     * - `{boolean=}` - `disabled` - Default: `false`
     * - `{string=}` - `storagePrefix` - Default: `"angular-cache.caches."`
     *
     * @returns {DSCache} New instance of DSCache.
     */
    function DSCacheFactory(cacheId, options) {
      return createCache(cacheId, options);
    }

    /**
     * @doc method
     * @id DSCacheFactory.methods:createCache
     * @name createCache
     * @description
     * Factory function that produces instances of `DSCache`.
     *
     * @param {string} cacheId The id of the new cache.
     * @param {object} options Configuration options. Properties:
     *
     * - `{number=}` - `capacity` - Default: `Number.MAX_VALUE`
     * - `{number=}` - `maxAge` - Default: `null`
     * - `{number=}` - `deleteOnExpire` - Default: `none`
     * - `{function=}` - `onExpire` - Default: `null`
     * - `{number=}` - `cacheFlushInterval` - Default: `null`
     * - `{number=}` - `recycleFreq` - Default: `1000`
     * - `{number=}` - `deleteOnExpire` - Default: `null`
     * - `{string=}` - `storageMode` - Default: `'none`
     * - `{object=}` - `storageImpl` - Default: `null`
     * - `{boolean=}` - `disabled` - Default: `false`
     * - `{string=}` - `storagePrefix` - Default: `"angular-cache.caches."`
     *
     * @returns {DSCache} New instance of DSCache.
     */
    DSCacheFactory.createCache = createCache;

    DSCacheFactory.version = version;

    /**
     * @doc method
     * @id DSCacheFactory.methods:info
     * @name info
     * @description
     * Return the status of `DSCacheFactory`.
     * @returns {object} The status of `DSCacheFactory`.
     */
    DSCacheFactory.info = function () {
      var keys = _keys(caches);
      var info = {
        size: keys.length,
        caches: {}
      };
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        info.caches[key] = caches[key].info();
      }
      var c = info.cacheDefaults = angular.extend({}, config);
      for (var option in defaults.defaults) {
        if (!(option in c)) {
          c[option] = config['$$' + option];
        }
      }
      return info;
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:get
     * @name get
     * @description
     * Return the cache with the given `cacheId`.
     * @param {string} cacheId The id of the desired cache.
     * @returns {DSCache} The cache with the specified `cacheId`.
     */
    DSCacheFactory.get = function (cacheId) {
      if (!angular.isString(cacheId)) {
        throw angular.$$minErr('ng')('areq', 'Expected cacheId to be a string! Found: {0}.', typeof cacheId);
      }
      return caches[cacheId];
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:keySet
     * @name keySet
     * @description
     * Return an object containing the `cacheId` of each cache.
     * @returns {object} An object containing the `cacheId` of each cache.
     */
    DSCacheFactory.keySet = function () {
      var cacheIds = {}, cacheId;
      for (cacheId in caches) {
        if (caches.hasOwnProperty(cacheId)) {
          cacheIds[cacheId] = cacheId;
        }
      }
      return cacheIds;
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:keys
     * @name keys
     * @description
     * Return an array containing the `cacheId` of each cache.
     * @returns {array} An array containing the `cacheId` of each cache.
     */
    DSCacheFactory.keys = function () {
      return _keys(caches);
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:destroyAll
     * @name destroyAll
     * @description
     * Destroy all caches.
     *
     * ## Signature:
     * ```js
     * DSCacheFactory.destroyAll()
     * ```
     *
     * ## Example:
     * ```js
     * var newCache = DSCacheFactory('newCache');
     * var otherCache = DSCacheFactory('otherCache');
     *
     * newCache.info().size; // 0
     * otherCache.info().size; // 0
     *
     * newCache.put('1', 'apple');
     * newCache.put('2', 'banana');
     * otherCache.put('abcd', 'horse');
     *
     * newCache.info().size; // 2
     * otherCache.info().size; // 1
     *
     * DSCacheFactory.destroyAll();
     *
     * newCache.info().size; // Error thrown
     * otherCache.info().size; // Error thrown
     *
     * DSCacheFactory.get('newCache'); // undefined
     * DSCacheFactory.get('otherCache'); // undefined
     * ```
     */
    DSCacheFactory.destroyAll = function () {
      for (var cacheId in caches) {
        caches[cacheId].destroy();
      }
      caches = {};
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:clearAll
     * @name clearAll
     * @description
     * Clear the contents of all caches.
     *
     * ## Signature:
     * ```js
     * DSCacheFactory.clearAll()
     * ```
     *
     * ## Example:
     * ```js
     * var newCache = DSCacheFactory('newCache');
     * var otherCache = DSCacheFactory('otherCache');
     *
     * newCache.info().size; // 0
     * otherCache.info().size; // 0
     *
     * newCache.put('1', 'apple');
     * newCache.put('2', 'banana');
     * otherCache.put('abcd', 'horse');
     *
     * newCache.info().size; // 2
     * otherCache.info().size; // 1
     *
     * DSCacheFactory.clearAll();
     *
     * newCache.info().size; // 0
     * otherCache.info().size; // 0
     * ```
     */
    DSCacheFactory.clearAll = function () {
      for (var cacheId in caches) {
        caches[cacheId].removeAll();
      }
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:enableAll
     * @name enableAll
     * @description
     * Enable any disabled caches.
     *
     * ## Signature:
     * ```js
     * DSCacheFactory.enableAll()
     * ```
     *
     * ## Example:
     * ```js
     * var newCache = DSCacheFactory('newCache', { disabled: true });
     * var otherCache = DSCacheFactory('otherCache', { disabled: true });
     *
     * newCache.info().disabled; // true
     * otherCache.info().disabled; // true
     *
     * DSCacheFactory.enableAll();
     *
     * newCache.info().disabled; // false
     * otherCache.info().disabled; // false
     * ```
     */
    DSCacheFactory.enableAll = function () {
      for (var cacheId in caches) {
        caches[cacheId].$$disabled = false;
      }
    };

    /**
     * @doc method
     * @id DSCacheFactory.methods:disableAll
     * @name disableAll
     * @description
     * Disable all caches.
     *
     * ## Signature:
     * ```js
     * DSCacheFactory.disableAll()
     * ```
     *
     * ## Example:
     * ```js
     * var newCache = DSCacheFactory('newCache');
     * var otherCache = DSCacheFactory('otherCache');
     *
     * newCache.info().disabled; // false
     * otherCache.info().disabled; // false
     *
     * DSCacheFactory.disableAll();
     *
     * newCache.info().disabled; // true
     * otherCache.info().disabled; // true
     * ```
     */
    DSCacheFactory.disableAll = function () {
      for (var cacheId in caches) {
        caches[cacheId].$$disabled = true;
      }
    };

    return DSCacheFactory;
  };
}

module.exports = DSCacheFactoryProvider;
