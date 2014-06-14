var defaults = {
  /**
   * @doc overview
   * @id capacity
   * @name capacity
   * @description
   * __Default:__ `Number.MAX_VALUE`
   *
   * This option limits the capacity of a cache. With a maximum capacity set, a cache operates as an LRU cache,
   * deleting the least-recently-used item when the cache exceeds capacity.
   *
   * This option is dynamically configurable. Must be a number (milliseconds) greater than zero.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setCapacity(capacity)`
   * - `DSCache.setOptions(options[, strict])`
   */
  capacity: Number.MAX_VALUE,

  /**
   * @doc overview
   * @id maxAge
   * @name maxAge
   * @description
   * __Default:__ `Number.MAX_VALUE`
   *
   * This option determines how long an item is in a cache before the item expires.. With `maxAge` set, items are
   * marked as expired when their time in a cache exceeds `maxAge`. A cache's behavior when an item expires is
   * determined by the [deleteOnExpire](/documentation/api/angular-cache/deleteOnExpire) option.
   *
   * This option is dynamically configurable. Must be a number (milliseconds) greater than zero.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setMaxAge(maxAge)`
   * - `DSCache.setOptions(options[, strict])`
   */
  maxAge: Number.MAX_VALUE,

  /**
   * @doc overview
   * @id deleteOnExpire
   * @name deleteOnExpire
   * @description
   * __Default:__ `"none"`
   *
   * This option determines how long an item is in a cache before the item expires.. With `maxAge` set, items are
   * marked as expired when their time in a cache exceeds `maxAge`. A cache's behavior when an item expires is
   * determined by the [deleteOnExpire](/documentation/api/angular-cache/deleteOnExpire) option.
   *
   * This option is dynamically configurable. Must be `"none"`, `"passive"` or `"aggressive"`.
   *
   * #### "none"
   * A cache will do nothing when its items expire.
   *
   * #### "passive"
   * A cache will do nothing when its items expire. If an expired item is request it is removed from the cache and
   * `undefined` is returned.
   *
   * #### "aggressive"
   * A cache will periodically scan for expired items and actively remove them from the cache if any are found. The
   * frequency of the scan is determined by the [recycleFreq](/documentation/api/angular-cache/recycleFreq) option.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setRecycleFreq(recycleFreq)`
   * - `DSCache.setOptions(options[, strict])`
   */
  deleteOnExpire: 'none',

  /**
   * @doc overview
   * @id onExpire
   * @name onExpire
   * @description
   * __Default:__ `"none"`
   *
   * This option is a callback function which will be executed whenever an expired item is removed from a cache by
   * either requesting an expired item while the cache is in `"passive"` `deleteOnExpire` mode, or when an expired
   * item is actively removed when the cache is in `"aggressive"` `deleteOnExpire` mode.
   *
   * This option is dynamically configurable. Must be a function. Will be passed the `key` and `value` of the expired
   * item. Will be passed a third `done` argument (if in `"passive"` `deleteOnExpire` mode) which is the `onExpire`
   * argument passed to [DSCache#get(key[, options])](/documentation/api/angular-cache/DSCache.methods:get).
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setOnExpire(onExpire)`
   * - `DSCache.setOptions(options[, strict])`
   */
  onExpire: null,

  /**
   * @doc overview
   * @id cacheFlushInterval
   * @name cacheFlushInterval
   * @description
   * __Default:__ `null`
   *
   * This option, if set, will cause a cache to periodically clear itself of all data.
   *
   * This option is dynamically configurable. Must be a number (milliseconds) greater than zero.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setCacheFlushInterval(cacheFlushInterval)`
   * - `DSCache.setOptions(options[, strict])`
   */
  cacheFlushInterval: null,

  /**
   * @doc overview
   * @id recycleFreq
   * @name recycleFreq
   * @description
   * __Default:__ `1000`
   *
   * This option determines how often a cache will scan for expired items when in `"aggressive"` `deleteOnExpire`
   * mode.
   *
   * This option is dynamically configurable. Must be a number (milliseconds) greater than zero.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setRecycleFreq(recycleFreq)`
   * - `DSCache.setOptions(options[, strict])`
   */
  recycleFreq: 1000,

  /**
   * @doc overview
   * @id storageMode
   * @name storageMode
   * @description
   * __Default:__ `"memory"`
   *
   * This option determines the storage mode for a cache.
   *
   * #### "memory"
   * All data will be held in memory.
   *
   * #### "localStorage"
   * Data will be held in `localStorage`, if available (or
   * [storageImpl](/documentation/api/angular-cache/storageImpl) is provided).
   *
   * #### "sessionStorage"
   * Data will be held in `sessionStorage`, if available (or
   * [storageImpl](/documentation/api/angular-cache/storageImpl) is provided).
   *
   * This option is NOT dynamically configurable. Must be `"memory"`, `"localStorage"` or `"sessionStorage"`.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   */
  storageMode: 'memory',

  /**
   * @doc overview
   * @id storageImpl
   * @name storageImpl
   * @description
   * __Default:__ `null`
   *
   * This option is available if you want to provide a custom `localStorage` or `sessionStorage` implementation.
   *
   * This option is NOT dynamically configurable. Must be an object that implements `setItem(key, value)`,
   * `getItem(key)` and `removeItem(key)`.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   */
  storageImpl: null,

  /**
   * @doc overview
   * @id disabled
   * @name disabled
   * @description
   * __Default:__ `false`
   *
   * This option disables or enables cache.
   *
   * This option is dynamically configurable. Must be `true` or `false`.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   * - `DSCache.setOptions(options[, strict])`
   *
   * or just use [DSCache#disable()](/documentation/api/angular-cache/DSCache.methods:disable) or
   * [DSCache#enable()](/documentation/api/angular-cache/DSCache.methods:enable).
   */
  disabled: false,

  /**
   * @doc overview
   * @id storagePrefix
   * @name storagePrefix
   * @description
   * __Default:__ `"angular-cache.caches."`
   *
   * This option determines the namespace for a cache when `storageMode` is `"localStorage"` or `"sessionStorage"`.
   * Setting this value to something like `"ac."` will save space when using WebStorage.
   *
   * This option is NOT dynamically configurable. Must be a string.
   *
   * ### Where can it be used?
   * - `DSCacheFactoryProvider.setCacheDefaults(options)`
   * - `DSCacheFactory(cacheId[, options])`
   */
  storagePrefix: 'angular-cache.caches.'
};

function Config() {
}

for (var option in defaults) {
  Config.prototype['$$' + option] = defaults[option];
}

module.exports = {
  Config: Config,
  defaults: defaults
};
