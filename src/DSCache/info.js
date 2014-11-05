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
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 * cache.put('2', 'banana');
 *
 * cache.info();    //  {
 *                  //      id: 'cache',
 *                  //      capacity: Number.MAX_VALUE,
 *                  //      maxAge: Number.MAX_VALUE,
 *                  //      deleteOnExpire: 'none',
 *                  //      onExpire: null,
 *                  //      cacheFlushInterval: null,
 *                  //      recycleFreq: 1000,
 *                  //      storageMode: 'memory',
 *                  //      storageImpl: null,
 *                  //      disabled: false,
 *                  //      size: 2
 *                  //  }
 *
 * cache.info('1'); //  {
 *                  //      created: 1234567890,
 *                  //      accessed: 1234567890,
 *                  //      expires: Number.MAX_VALUE,
 *                  //      isExpired: false
 *                  //  }
 *
 * cache.info('3'); // undefined
 * ```
 *
 * @param {string=} key The key of the item whose status is to be retrieved.
 * @returns {object} The status of this cache or of the item with the given key.
 */
module.exports = function info(key) {
  var _this = this;
  if (key) {
    var item;
    if (_this.$$storage) {
      var itemJson = _this.$$storage.getItem(_this.$$prefix + '.data.' + key);

      if (itemJson) {
        item = angular.fromJson(itemJson);
        return {
          created: item.created,
          accessed: item.accessed,
          expires: item.expires,
          isExpired: (new Date().getTime() - item.created) > _this.$$maxAge
        };
      } else {
        return undefined;
      }
    } else {
      if (key in _this.$$data) {
        item = _this.$$data[key];

        return {
          created: item.created,
          accessed: item.accessed,
          expires: item.expires,
          isExpired: (new Date().getTime() - item.created) > _this.$$maxAge
        };
      } else {
        return undefined;
      }
    }
  } else {
    return {
      id: _this.$$id,
      capacity: _this.$$capacity,
      maxAge: _this.$$maxAge,
      deleteOnExpire: _this.$$deleteOnExpire,
      onExpire: _this.$$onExpire,
      cacheFlushInterval: _this.$$cacheFlushInterval,
      recycleFreq: _this.$$recycleFreq,
      storageMode: _this.$$storageMode,
      storageImpl: _this.$$storage,
      disabled: _this.$$disabled,
      size: _this.$$lruHeap && _this.$$lruHeap.size() || 0
    };
  }
};
