/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-cache-<%= pkg.version %>.js
 * @version <%= pkg.version %> - [Homepage]{@link http://jmdobry.github.io/angular-cache/}
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/angular-cache>
 * @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 *
 * @overview angular-cache is a caching system that improves upon the capabilities of the
 * $cacheFactory provided by AngularJS.
 */
(function (window, angular, undefined) {
    'use strict';

    /**
     * @module angular-cache
     * @desc Provides an $AngularCacheFactoryProvider, which gives you the ability to use an
     *       $angularCacheFactory. The $angularCacheFactory produces AngularCache objects, which
     *       the same abilities as the cache objects that come with Angular, except with some added
     *       functionality.
     */
    angular.module('jmdobry.angular-cache', ['ng']);

    /**
     * @class $AngularCacheFactoryProvider
     * @desc Provider for the $angularCacheFactory.
     * @see {@link http://docs.angularjs.org/api/ng.$cacheFactory|ng.$cacheFactory}
     */
    function $AngularCacheFactoryProvider() {

        /**
         * @ignore
         */
        this.$get = ['$timeout', '$window', function ($timeout, $window) {
            var caches = {},
                defaults = {
                    capacity: Number.MAX_VALUE,
                    maxAge: null,
                    deleteOnExpire: 'none',
                    onExpire: null,
                    cacheFlushInterval: null,
                    storageMode: 'none',
                    localStorageImpl: null,
                    sessionStorageImpl: null
                };

            /**
             * @method _keySet
             * @desc Returns an object of the keys of the given collection.
             * @param {Object} collection The collection from which to get the set of keys.
             * @returns {Object} A hash of the keys of the given collection.
             * @ignore
             */
            function _keySet(collection) {
                var keySet = {}, key;
                for (key in collection) {
                    if (collection.hasOwnProperty(key)) {
                        keySet[key] = key;
                    }
                }
                return keySet;
            }

            /**
             * @method _keys
             * @desc Returns an array of the keys of the given collection.
             * @param {Object} collection The collection from which to get the keys.
             * @returns {Array} An array of the keys of the given collection.
             * @ignore
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

            /**
             * @class AngularCache
             * @desc Instantiated via <code>$angularCacheFactory(cacheId[, options])</code>
             * @param {String} cacheId The id of the new cache.
             * @param {Object} [options] {{[capacity]: Number, [maxAge]: Number, [cacheFlushInterval]: Number, [aggressiveDelete]: Boolean, [onExpire]: Function, [storageMode]: String, [localStorageImpl]: Object}}
             */
            function AngularCache(cacheId, options) {
                var size = 0,
                    config = angular.extend({}, { id: cacheId }),
                    data = {},
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null,
                    prefix = 'angular-cache.caches.' + cacheId,
                    cacheDirty = false,
                    self = this,
                    storage = null;

                options = options || {};

                /**
                 * @method _setTimeoutToRemove
                 * @desc Removes the item with the given key from this cache after the number of
                 * milliseconds specified by delay.
                 * @param {String} key The key of the item to be removed at the end of the timeout.
                 * @param {Number} delay The delay in milliseconds.
                 * @private
                 * @ignore
                 */
                function _setTimeoutToRemove(key, delay) {
                    data[key].timeoutId = $timeout(function () {
                        var value;
                        if (data[key]) {
                            value = data[key].value;
                        }
                        self.remove(key);
                        if (config.onExpire) {
                            config.onExpire(key, value);
                        }
                    }, delay);
                }

                /**
                 * @method _validateNumberOption
                 * @desc Validates the given number option.
                 * @param {Number} option The number option to check.
                 * @param {Function} cb Callback function
                 * @private
                 * @ignore
                 */
                function _validateNumberOption(option, cb) {
                    if (!angular.isNumber(option)) {
                        cb('must be a number!');
                    } else if (option < 0) {
                        cb('must be greater than zero!');
                    } else {
                        cb(null);
                    }
                }

                /**
                 * @method _setCapacity
                 * @desc Set the capacity for this cache.
                 * @param {Number} capacity The new capacity for this cache.
                 * @private
                 * @ignore
                 */
                function _setCapacity(capacity) {
                    _validateNumberOption(capacity, function (err) {
                        if (err) {
                            throw new Error('capacity: ' + err);
                        } else {
                            config.capacity = capacity;
                            while (size > config.capacity) {
                                self.remove(staleEnd.key);
                            }
                        }
                    });
                }

                /**
                 * @method _setDeleteOnExpire
                 * @desc Set the deleteOnExpire setting for this cache.
                 * @param {String} deleteOnExpire The new deleteOnExpire for this cache.
                 * @private
                 * @ignore
                 */
                function _setDeleteOnExpire(deleteOnExpire) {
                    if (!angular.isString(deleteOnExpire)) {
                        throw new Error('deleteOnExpire: must be a string!');
                    } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
                        throw new Error('deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
                    } else {
                        config.deleteOnExpire = deleteOnExpire;
                    }
                }

                /**
                 * @method _setMaxAge
                 * @desc Set the maxAge for this cache.
                 * @param {Number} maxAge The new maxAge for this cache.
                 * @private
                 * @ignore
                 */
                function _setMaxAge(maxAge) {
                    var keys = _keys(data);
                    if (maxAge === null) {
                        if (config.maxAge) {
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i];
                                if ((data[key].deleteOnExpire || config.deleteOnExpire) === 'aggressive') {
                                    if (!('maxAge' in data[key])) {
                                        if ('timeoutId' in data[key]) {
                                            $timeout.cancel(data[key].timeoutId);
                                        }
                                    }
                                }
                            }
                        }
                        config.maxAge = maxAge;
                    } else {
                        _validateNumberOption(maxAge, function (err) {
                            if (err) {
                                throw new Error('maxAge: ' + err);
                            } else {
                                if (maxAge !== config.maxAge) {
                                    config.maxAge = maxAge;
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        if ((data[key].deleteOnExpire || config.deleteOnExpire) === 'aggressive') {
                                            if (!('maxAge' in data[key])) {
                                                if ('timeoutId' in data[key]) {
                                                    $timeout.cancel(data[key].timeoutId);
                                                }
                                                var isExpired = new Date().getTime() - data[key].timestamp > config.maxAge;
                                                if (!isExpired) {
                                                    _setTimeoutToRemove(key, config.maxAge);
                                                } else {
                                                    self.remove(key);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }

                /**
                 * @method _setCacheFlushInterval
                 * @desc Set the cacheFlushInterval for this cache.
                 * @param {Number} cacheFlushInterval The new cacheFlushInterval for this cache.
                 * @private
                 * @ignore
                 */
                function _setCacheFlushInterval(cacheFlushInterval) {
                    if (cacheFlushInterval === null) {
                        if (config.cacheFlushIntervalId) {
                            clearInterval(config.cacheFlushIntervalId);
                            delete config.cacheFlushIntervalId;
                        }
                        config.cacheFlushInterval = cacheFlushInterval;
                    } else {
                        _validateNumberOption(cacheFlushInterval, function (err) {
                            if (err) {
                                throw new Error('cacheFlushInterval: ' + err);
                            } else {
                                if (cacheFlushInterval !== config.cacheFlushInterval) {
                                    if (config.cacheFlushIntervalId) {
                                        clearInterval(config.cacheFlushIntervalId);
                                        delete config.cacheFlushIntervalId;
                                    }
                                    config.cacheFlushInterval = cacheFlushInterval;
                                    config.cacheFlushIntervalId = setInterval(self.removeAll, config.cacheFlushInterval);
                                }
                            }
                        });
                    }
                }

                /**
                 * @method _setStorageMode
                 * @desc Configure the cache to use localStorage.
                 * @param {String} storageMode "localStorage"|"sessionStorage"|null
                 * @param {Object} storageImpl The storage polyfill/replacement to use.
                 * @private
                 * @ignore
                 */
                function _setStorageMode(storageMode, storageImpl) {
                    var keys, i;
                    if (!angular.isString(storageMode)) {
                        throw new Error('storageMode: must be a string!');
                    } else if (storageMode !== 'none' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
                        throw new Error('storageMode: accepted values are "none", "localStorage" or "sessionStorage"');
                    }
                    if ((config.storageMode === 'localStorage' || config.storageMode === 'sessionStorage') &&
                        (storageMode !== config.storageMode)) {
                        keys = _keys(data);
                        for (i = 0; i < keys.length; i++) {
                            storage.removeItem(prefix + '.data.' + keys[i]);
                        }
                        storage.removeItem(prefix + '.keys');
                    }
                    config.storageMode = storageMode;
                    if (storageImpl) {
                        if (!angular.isObject(storageImpl)) {
                            throw new Error('[local|session]storageImpl: must be an object!');
                        } else if (!('setItem' in storageImpl) || typeof storageImpl.setItem !== 'function') {
                            throw new Error('[local|session]storageImpl: must implement "setItem(key, value)"!');
                        } else if (!('getItem' in storageImpl) || typeof storageImpl.getItem !== 'function') {
                            throw new Error('[local|session]storageImpl: must implement "getItem(key)"!');
                        } else if (!('removeItem' in storageImpl) || typeof storageImpl.removeItem !== 'function') {
                            throw new Error('[local|session]storageImpl: must implement "removeItem(key)"!');
                        }
                        storage = storageImpl;
                    } else if (config.storageMode === 'localStorage') {
                        storage = $window.localStorage;
                    } else if (config.storageMode === 'sessionStorage') {
                        storage = $window.sessionStorage;
                    }

                    if (config.storageMode !== 'none' && storage) {
                        if (!cacheDirty) {
                            _loadCacheConfig();
                        } else {
                            keys = _keys(data);
                            for (i = 0; i < keys.length; i++) {
                                _syncToStorage(keys[i]);
                            }
                        }
                    }
                }

                /**
                 * @method _setOptions
                 * @desc Configure this cache with the given options.
                 * @param {Object} options
                 * @param {Boolean} strict If true then any existing configuration will be reset to default before
                 * applying the new options, otherwise only the options specified in the options hash will be altered.
                 * @private
                 * @ignore
                 */
                function _setOptions(options, strict) {
                    options = options || {};
                    strict = !!strict;
                    if (!angular.isObject(options)) {
                        throw new Error('setOptions(): options: must be an object!');
                    }

                    if (strict) {
                        options = angular.extend({}, defaults, options);
                    }

                    if ('capacity' in options) {
                        _setCapacity(options.capacity);
                    }

                    if ('deleteOnExpire' in options) {
                        _setDeleteOnExpire(options.deleteOnExpire);
                    }

                    if ('maxAge' in options) {
                        _setMaxAge(options.maxAge);
                    }

                    if ('cacheFlushInterval' in options) {
                        _setCacheFlushInterval(options.cacheFlushInterval);
                    }

                    if ('storageMode' in options) {
                        _setStorageMode(options.storageMode, options.localStorageImpl || options.sessionStorageImpl);
                    }

                    if ('onExpire' in options) {
                        if (options.onExpire !== null && typeof options.onExpire !== 'function') {
                            throw new Error('onExpire: Must be a function!');
                        }
                        config.onExpire = options.onExpire;
                    }

                    cacheDirty = true;
                }

                /**
                 * @method refresh
                 * @desc Makes the `entry` the freshEnd of the LRU linked list.
                 * @param {Object} entry
                 * @private
                 * @ignore
                 */
                function _refresh(entry) {
                    if (entry !== freshEnd) {
                        if (!staleEnd) {
                            staleEnd = entry;
                        } else if (staleEnd === entry) {
                            staleEnd = entry.n;
                        }

                        _link(entry.n, entry.p);
                        _link(entry, freshEnd);
                        freshEnd = entry;
                        freshEnd.n = null;
                    }
                }

                /**
                 * @method link
                 * @desc Bidirectionally links two entries of the LRU linked list
                 * @param {Object} nextEntry
                 * @param {Object} prevEntry
                 * @private
                 * @ignore
                 */
                function _link(nextEntry, prevEntry) {
                    if (nextEntry !== prevEntry) {
                        if (nextEntry) {
                            nextEntry.p = prevEntry; //p stands for previous, 'prev' didn't minify
                        }
                        if (prevEntry) {
                            prevEntry.n = nextEntry; //n stands for next, 'next' didn't minify
                        }
                    }
                }

                /**
                 * @method _loadCacheConfig
                 * @desc If storageMode is set, attempt to load previous cache configuration from localStorage.
                 * @private
                 * @ignore
                 */
                function _loadCacheConfig() {
                    var keys = angular.fromJson(storage.getItem(prefix + '.keys'));
                    storage.removeItem(prefix + '.keys');
                    if (keys && keys.length) {
                        for (var i = 0; i < keys.length; i++) {
                            var data = angular.fromJson(storage.getItem(prefix + '.data.' + keys[i])),
                                maxAge = data.maxAge || config.maxAge,
                                deleteOnExpire = data.deleteOnExpire || config.deleteOnExpire;
                            if (maxAge && ((new Date().getTime() - data.timestamp) > maxAge) && deleteOnExpire === 'aggressive') {
                                storage.removeItem(prefix + '.data.' + keys[i]);
                            } else {
                                var options = {
                                    timestamp: data.timestamp
                                };
                                if (data.maxAge) {
                                    options.maxAge = data.maxAge;
                                }
                                if (data.deleteOnExpire) {
                                    options.deleteOnExpire = data.deleteOnExpire;
                                }
                                self.put(keys[i], data.value, options);
                            }
                        }
                        _syncToStorage(null);
                    }
                }

                /**
                 * @method _syncToStorage
                 * @desc If storageMode is set, sync to localStorage.
                 * @param {String} key The identifier of the item to sync.
                 * @private
                 * @ignore
                 */
                function _syncToStorage(key) {
                    if (config.storageMode !== 'none' && storage) {
                        storage.setItem(prefix + '.keys', angular.toJson(_keys(data)));
                        if (key) {
                            storage.setItem(prefix + '.data.' + key, angular.toJson(data[key]));
                        }
                    }
                }

                /**
                 * @method AngularCache.put
                 * @desc Add a key-value pair with timestamp to the cache.
                 * @param {String} key The identifier for the item to add to the cache.
                 * @param {*} value The value of the item to add to the cache.
                 * @param {Object} [options] {{ maxAge: {Number}, aggressiveDelete: {Boolean}, timestamp: {Number} }}
                 * @returns {*} value The value of the item added to the cache.
                 * @privileged
                 */
                this.put = function (key, value, options) {

                    if (!angular.isString(key)) {
                        throw new Error('AngularCache.put(): key: must be a string!');
                    }
                    if (options && options.maxAge) {
                        _validateNumberOption(options.maxAge, function (err) {
                            if (err) {
                                throw new Error('AngularCache.put(): maxAge: ' + err);
                            }
                        });
                    }
                    if (options && options.deleteOnExpire) {
                        if (!angular.isString(options.deleteOnExpire)) {
                            throw new Error('AngularCache.put(): deleteOnExpire: must be a string!');
                        }
                    }
                    if (angular.isUndefined(value)) {
                        return;
                    }

                    var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

                    _refresh(lruEntry);

                    if (!(key in data)) {
                        size++;
                    } else {
                        if (data[key].timeoutId) {
                            $timeout.cancel(data[key].timeoutId);
                        }
                    }

                    data[key] = {
                        value: value,
                        timestamp: (options && options.timestamp) || new Date().getTime()
                    };

                    if (options && options.deleteOnExpire) {
                        data[key].deleteOnExpire = options.deleteOnExpire;
                    }
                    if (options && options.maxAge) {
                        data[key].maxAge = options.maxAge;
                    }

                    if (data[key] || config.maxAge) {
                        if ((data[key].deleteOnExpire === 'aggressive' || config.deleteOnExpire === 'aggressive') &&
                            (data[key].maxAge || config.maxAge)) {
                            _setTimeoutToRemove(key, data[key].maxAge || config.maxAge);
                        }
                    }

                    _syncToStorage(key);

                    if (size > config.capacity) {
                        this.remove(staleEnd.key);
                    }

                    return value;
                };

                /**
                 * @method AngularCache.get
                 * @desc Retrieve the item from the cache with the specified key.
                 * @param {String} key The key of the item to retrieve.
                 * @param {Function} [onExpire] Callback to be executed if it is discovered the
                 * requested item has expired.
                 * @returns {*} The value of the item in the cache with the specified key.
                 * @privileged
                 */
                this.get = function (key, onExpire) {
                    var lruEntry = lruHash[key],
                        item = data[key],
                        maxAge,
                        deleteOnExpire;

                    if (!lruEntry || !item) {
                        return;
                    }

                    maxAge = item.maxAge || config.maxAge;
                    deleteOnExpire = item.deleteOnExpire || config.deleteOnExpire;

                    // There is no timeout to delete this item, so we must do it here if it's expired.
                    if (maxAge && deleteOnExpire === 'passive') {
                        if ((new Date().getTime() - item.timestamp) > maxAge) {
                            // This item is expired so remove it
                            this.remove(key);
                            lruEntry = null;

                            if (config.onExpire) {
                                config.onExpire(key, item.value, onExpire);
                                return;
                            } else if (onExpire && typeof onExpire === 'function') {
                                onExpire(key, item.value);
                                return;
                            } else {
                                // cache miss
                                return;
                            }
                        }
                    }

                    _refresh(lruEntry);

                    _syncToStorage(key);

                    return item.value;
                };

                /**
                 * @method AngularCache.remove
                 * @desc Remove the specified key-value pair from this cache.
                 * @param {String} key The key of the key-value pair to remove.
                 * @privileged
                 */
                this.remove = function (key) {
                    var lruEntry = lruHash[key];

                    if (!lruEntry) {
                        return;
                    }

                    if (lruEntry === freshEnd) {
                        freshEnd = lruEntry.p;
                    }
                    if (lruEntry === staleEnd) {
                        staleEnd = lruEntry.n;
                    }
                    _link(lruEntry.n, lruEntry.p);

                    delete lruHash[key];
                    delete data[key];

                    _syncToStorage(null);

                    if (config.storageMode !== 'none' && storage) {
                        storage.removeItem(prefix + '.data.' + key);
                    }

                    size--;
                };

                /**
                 * @method AngularCache.removeAll
                 * @desc Clear this cache.
                 * @privileged
                 */
                this.removeAll = function () {
                    if (config.storageMode !== 'none' && storage) {
                        var keys = _keys(data);
                        for (var i = 0; i < keys.length; i++) {
                            if (data[keys[i]].timeoutId) {
                                $timeout.cancel(data[keys[i]].timeoutId);
                            }
                            storage.removeItem(prefix + '.data.' + keys[i]);
                        }
                    }

                    data = {};
                    size = 0;
                    lruHash = {};
                    freshEnd = null;
                    staleEnd = null;

                    _syncToStorage(null);
                };

                /**
                 * @method AngularCache.destroy
                 * @desc Completely destroy this cache.
                 * @privileged
                 */
                this.destroy = function () {
                    if (config.cacheFlushIntervalId) {
                        clearInterval(config.cacheFlushIntervalId);
                    }
                    if (config.storageMode !== 'none' && storage) {
                        this.removeAll();
                        storage.removeItem(prefix + '.keys');
                        storage.removeItem(prefix);
                    }
                    storage = null;
                    data = null;
                    config = null;
                    lruHash = null;
                    size = null;
                    freshEnd = null;
                    staleEnd = null;
                    prefix = null;
                    self = null;
                    delete caches[cacheId];
                };

                /**
                 * @method AngularCache.info
                 * @desc Return an object containing information about this cache.
                 * @param {String} [key] The key of the item about which to retrieve information.
                 * @returns {Object} stats Object containing information about this cache.
                 * @privileged
                 */
                this.info = function (key) {
                    if (key) {
                        if (data[key]) {
                            var info = {
                                timestamp: data[key].timestamp,
                                maxAge: data[key].maxAge || config.maxAge,
                                deleteOnExpire: data[key].deleteOnExpire || config.deleteOnExpire,
                                isExpired: false
                            };
                            if (info.maxAge) {
                                info.isExpired = (new Date().getTime() - info.timestamp) > info.maxAge;
                            }
                            return info;
                        } else {
                            return data[key];
                        }
                    } else {
                        return angular.extend({}, config, { size: size });
                    }
                };

                /**
                 * @method AngularCache.keySet
                 * @desc Return the set of the keys of all items currently in this cache.
                 * @returns {Object} The set of the keys of all items currently in this cache.
                 * @privileged
                 */
                this.keySet = function () {
                    return _keySet(data);
                };

                /**
                 * @method AngularCache.keys
                 * @desc Return an array of the keys of all items currently in this cache..
                 * @returns {Array} An array of the keys of all items currently in this cache..
                 * @privileged
                 */
                this.keys = function () {
                    return _keys(data);
                };

                /**
                 * @method AngularCache.setOptions
                 * @desc Configure this cache with the given options.
                 * @param {Object} options
                 * @param {Boolean} strict If true then any existing configuration will be reset to defaults before
                 * applying the new options, otherwise only the options specified in the hash will be altered.
                 * @privileged
                 */
                this.setOptions = _setOptions;

                // Initialize this cache with the default and given options
                _setOptions(options, true);
            }

            /**
             * @class AngularCacheFactory
             * @param {String} cacheId The id of the new cache.
             * @param {Object} [options] {{capacity: Number, maxAge: Number, deleteOnExpire: String, onExpire: Function, cacheFlushInterval: Number, storageMode: String, localStorageImpl: Object, sessionStorageImpl: Object}}
             * @returns {AngularCache}
             */
            function angularCacheFactory(cacheId, options) {
                if (cacheId in caches) {
                    throw new Error('cacheId ' + cacheId + ' taken!');
                } else if (!angular.isString(cacheId)) {
                    throw new Error('cacheId must be a string!');
                }

                caches[cacheId] = new AngularCache(cacheId, options);
                return caches[cacheId];
            }

            /**
             * @method angularCacheFactory.info
             * @desc Return an object containing information about all caches of this factory.
             * @returns {Object} An object containing information about all caches of this factory.
             * @public
             */
            angularCacheFactory.info = function () {
                var info = {};
                var keys = _keys(caches);
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    info[key] = caches[key].info();
                }
                return info;
            };

            /**
             * @method angularCacheFactory.get
             * @desc Return the cache with the specified cacheId.
             * @param {String} cacheId The id of the desired cache.
             * @returns {AngularCache} The cache with the specified cachedId.
             * @public
             */
            angularCacheFactory.get = function (cacheId) {
                return caches[cacheId];
            };

            /**
             * @method angularCacheFactory.keySet
             * @desc Return the set of keys associated with all current caches owned by this
             * angularCacheFactory.
             * @returns {Object} The set of keys associated with all current caches owned by this
             * angularCacheFactory.
             * @public
             */
            angularCacheFactory.keySet = function () {
                return _keySet(caches);
            };

            /**
             * @method angularCacheFactory.keys
             * @desc Return an array of the keys associated with all current caches owned by this
             * angularCacheFactory.
             * @returns {Array} An array of the keys associated with all current caches owned by
             * this angularCacheFactory.
             * @public
             */
            angularCacheFactory.keys = function () {
                return _keys(caches);
            };

            /**
             * @method angularCacheFactory.removeAll
             * @desc Remove all caches owned by this $angularCacheFactory.
             * @public
             */
            angularCacheFactory.removeAll = function () {
                var keys = _keys(caches);
                for (var i = 0; i < keys.length; i++) {
                    caches[keys[i]].destroy();
                }
            };

            /**
             * @method angularCacheFactory.clearAll
             * @desc Clears the contents of every cache owned by this $angularCacheFactory.
             * @public
             */
            angularCacheFactory.clearAll = function () {
                var keys = _keys(caches);
                for (var i = 0; i < keys.length; i++) {
                    caches[keys[i]].removeAll();
                }
            };

            return angularCacheFactory;
        }];
    }

    // Register the new provider with Angular.
    angular.module('jmdobry.angular-cache').provider('$angularCacheFactory', $AngularCacheFactoryProvider);
})(window, window.angular);
