/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-cache-1.1.0.js
 * @version 1.1.0 - [Homepage]{@link http://jmdobry.github.io/angular-cache/}
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
    angular.module('angular-cache', ['ng']);

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
            var caches = {};

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

                if (!options.hasOwnProperty('aggressiveDelete')) {
                    options.aggressiveDelete = false;
                }

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
                        cb('must be a number!', option);
                    } else if (option < 0) {
                        cb('must be greater than zero!', option);
                    } else {
                        cb(null, option);
                    }
                }

                /**
                 * @method _setCapacity
                 * @desc Set the capacity for this cache.
                 * @param {Number} capacity The new capacity for this cache.
                 * @param {Function} cb Callback function
                 * @privates
                 * @ignore
                 */
                function _setCapacity(capacity, cb) {
                    if (capacity === Number.MAX_VALUE) {
                        config.capacity = capacity;
                        cb(null, config.capacity);
                    } else {
                        _validateNumberOption(capacity, function (err, capacity) {
                            if (err) {
                                cb(err, capacity);
                            } else {
                                config.capacity = capacity;
                                while (size > config.capacity) {
                                    self.remove(staleEnd.key);
                                }
                                cb(null, config.capacity);
                            }
                        });
                    }
                }

                /**
                 * @method _setAggressiveDelete
                 * @desc Set the aggressiveDelete setting for this cache.
                 * @param {Boolean} aggressiveDelete The new aggressiveDelete for this cache.
                 * @param {Function} cb Callback function
                 * @private
                 * @ignore
                 */
                function _setAggressiveDelete(aggressiveDelete, cb) {
                    if (aggressiveDelete === null) {
                        config.aggressiveDelete = false;
                        cb(null, config.aggressiveDelete);
                    } else {
                        if (aggressiveDelete === true || aggressiveDelete === false) {
                            config.aggressiveDelete = aggressiveDelete;
                            cb(null, config.aggressiveDelete);
                        } else {
                            cb('must be a boolean!', aggressiveDelete);
                        }
                    }
                }

                /**
                 * @method _setMaxAge
                 * @desc Set the maxAge for this cache.
                 * @param {Number} maxAge The new maxAge for this cache.
                 * @param {Function} cb Callback function
                 * @private
                 * @ignore
                 */
                function _setMaxAge(maxAge, cb) {
                    var keys = _keys(data);

                    if (maxAge === null) {
                        config.maxAge = maxAge;
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            if (data[key].timeoutId && !data[key].maxAge) {
                                $timeout.cancel(data[key].timeoutId);
                            }
                        }
                        cb(null, config.maxAge);
                    } else {
                        _validateNumberOption(maxAge, function (err, maxAge) {
                            if (err) {
                                cb(err, maxAge);
                            } else {
                                config.maxAge = maxAge;
                                for (var i = 0; i < keys.length; i++) {
                                    var key = keys[i];
                                    if (!data[key].maxAge) {
                                        if (data[key].timeoutId) {
                                            $timeout.cancel(data[key].timeoutId);
                                        }
                                        var timeRemaining = new Date().getTime() - data[key].timestamp;
                                        if (config.maxAge - timeRemaining > 0 && config.aggressiveDelete) {
                                            _setTimeoutToRemove(key, config.maxAge);
                                        } else {
                                            self.remove(key);
                                        }
                                    }
                                }
                                cb(null, config.maxAge);
                            }
                        });
                    }
                }

                /**
                 * @method _setCacheFlushInterval
                 * @desc Set the cacheFlushInterval for this cache.
                 * @param {Number} cacheFlushInterval The new cacheFlushInterval for this cache.
                 * @param {Function} cb Callback function
                 * @private
                 * @ignore
                 */
                function _setCacheFlushInterval(cacheFlushInterval, cb) {
                    if (config.cacheFlushIntervalId) {
                        clearInterval(config.cacheFlushIntervalId);
                        delete config.cacheFlushIntervalId;
                    }
                    if (cacheFlushInterval === null) {
                        config.cacheFlushInterval = cacheFlushInterval;
                        cb(null, config.cacheFlushInterval);
                    } else {
                        _validateNumberOption(cacheFlushInterval, function (err, cacheFlushInterval) {
                            if (err) {
                                cb(err, cacheFlushInterval);
                            } else {
                                config.cacheFlushInterval = cacheFlushInterval;
                                config.cacheFlushIntervalId = setInterval(function () {
                                    var keys = _keys(data);
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        if (data[key].timeoutId) {
                                            $timeout.cancel(data[key].timeoutId);
                                        }
                                    }
                                    size = 0;
                                    data = {};
                                    lruHash = {};
                                    freshEnd = null;
                                    staleEnd = null;
                                }, config.cacheFlushInterval);
                                cb(null, config.cacheFlushInterval);
                            }
                        });
                    }
                }

                /**
                 * @method _setStorageMode
                 * @desc Configure the cache to use localStorage.
                 * @param {Object} localStorageImpl The localStorage polyfill/replacement to use.
                 * @param {Object} sessionStorageImpl The sessionStorage polyfill/replacement to use.
                 * @param {String} storageMode "localStorage"|"sessionStorage"|null
                 * @param {Function} cb Callback function
                 * @private
                 * @ignore
                 */
                function _setStorageMode(localStorageImpl, sessionStorageImpl, storageMode, cb) {
                    var keys, i;
                    if ((config.storageMode === 'localStorage' || config.storageMode === 'sessionStorage') &&
                        (storageMode !== 'localStorage' && storageMode !== 'sessionStorage')) {
                        keys = _keys(data);
                        for (i = 0; i < keys.length; i++) {
                            storage.removeItem(prefix + '.data.' + keys[i]);
                        }
                        storage.removeItem(prefix + '.keys');
                        config.storageMode = null;
                        storage = null;
                    } else {
                        switch (storageMode) {
                            case 'localStorage':
                                if (localStorageImpl || $window.localStorage) {
                                    config.storageMode = storageMode;
                                    storage = localStorageImpl || $window.localStorage;
                                    if (!cacheDirty) {
                                        _loadCacheConfig();
                                    } else {
                                        _saveCacheConfig();
                                        keys = _keys(data);
                                        for (i = 0; i < keys.length; i++) {
                                            storage.setItem(prefix + '.data.' + keys[i], angular.toJson(data[keys[i]]));
                                        }
                                    }
                                }
                                break;
                            case 'sessionStorage':
                                if (sessionStorageImpl || $window.sessionStorage) {
                                    config.storageMode = storageMode;
                                    storage = sessionStorageImpl || $window.sessionStorage;
                                    if (!cacheDirty) {
                                        _loadCacheConfig();
                                    } else {
                                        _saveCacheConfig();
                                        keys = _keys(data);
                                        for (i = 0; i < keys.length; i++) {
                                            storage.setItem(prefix + '.data.' + keys[i], angular.toJson(data[keys[i]]));
                                        }
                                    }
                                }
                                break;
                            default:
                                config.storageMode = null;
                                storage = null;
                        }
                    }
                    cb(null, config.storageMode);
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
                    strict = strict || false;

                    // setup capacity
                    if (options.capacity || strict) {
                        _setCapacity(options.capacity ? options.capacity : Number.MAX_VALUE, function (err, capacity) {
                            if (err) {
                                throw new Error('capacity: ' + err);
                            }
                        });
                    }

                    // setup aggressiveDelete
                    if (options.hasOwnProperty('aggressiveDelete') || strict) {
                        _setAggressiveDelete(options.hasOwnProperty('aggressiveDelete') ? options.aggressiveDelete : null, function (err, aggressiveDelete) {
                            if (err) {
                                throw new Error('aggressiveDelete: ' + err);
                            }
                        });
                    }

                    if (!options.maxAge && !strict) {
                        options.maxAge = config.maxAge;
                    }

                    // setup maxAge
                    if (options.maxAge || strict) {
                        _setMaxAge(options.maxAge ? options.maxAge : null, function (err, maxAge) {
                            if (err) {
                                throw new Error('maxAge: ' + err);
                            }
                        });
                    }

                    // setup cacheFlushInterval
                    if (options.cacheFlushInterval || strict) {
                        _setCacheFlushInterval(options.cacheFlushInterval ? options.cacheFlushInterval : null, function (err, cacheFlushInterval) {
                            if (err) {
                                throw new Error('cacheFlushInterval: ' + err);
                            }
                        });
                    }

                    // setup storageMode
                    if (options.storageMode || strict) {
                        _setStorageMode(options.localStorageImpl ? options.localStorageImpl : null, options.sessionStorageImpl ? options.sessionStorageImpl : null, options.storageMode ? options.storageMode : null, function (err, storageMode) {
                            if (err) {
                                throw new Error('storageMode: ' + err);
                            }
                        });
                    }

                    // Set (or remove) onExpire callback
                    if (strict) {
                        delete config.onExpire;
                    }
                    if (options.onExpire) {
                        if (typeof options.onExpire !== 'function') {
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
                                maxAge = data.maxAge || config.maxAge;
                            if (maxAge && ((new Date().getTime() - data.timestamp) > maxAge)) {
                                storage.removeItem(prefix + '.data.' + keys[i]);
                            } else {
                                var options = {
                                    timestamp: data.timestamp
                                };
                                if (data.maxAge) {
                                    options.maxAge = data.maxAge;
                                }
                                if (data.hasOwnProperty('aggressiveDelete')) {
                                    options.aggressiveDelete = data.aggressiveDelete;
                                }
                                self.put(keys[i], data.value);
                            }
                        }
                        _saveCacheConfig();
                    }
                }

                /**
                 * @method _saveCacheConfig
                 * @desc If storageMode is set, save current keys of cache to localStorage.
                 * @private
                 * @ignore
                 */
                function _saveCacheConfig() {
                    if (config.storageMode && storage) {
                        storage.setItem(prefix + '.keys', angular.toJson(_keys(data)));
                    }
                }

                /**
                 * @method AngularCache.put
                 * @desc Add a key-value pair with timestamp to the cache.
                 * @param {String} key The identifier for the item to add to the cache.
                 * @param {*} value The value of the item to add to the cache.
                 * @param {Object} [options] { maxAge: {Number} }
                 * @returns {*} value The value of the item added to the cache.
                 * @privileged
                 */
                this.put = function (key, value, options) {

                    if (!angular.isString(key)) {
                        throw new Error('The key must be a string!');
                    }
                    if (options && options.maxAge) {
                        _validateNumberOption(options.maxAge, function (err, maxAge) {
                            if (err) {
                                throw new Error('AngularCache.put(): maxAge: ' + err);
                            }
                        });
                    }
                    if (options && options.hasOwnProperty('aggressiveDelete')) {
                        if (options.aggressiveDelete !== true && options.aggressiveDelete !== false) {
                            throw new Error('AngularCache.put(): aggressiveDelete must be a boolean!');
                        }
                    }
                    if (angular.isUndefined(value)) {
                        return;
                    }

                    var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

                    _refresh(lruEntry);

                    if (!(key in data)) {
                        size++;
                    }

                    data[key] = {
                        value: value
                    };

                    if (options && options.hasOwnProperty('aggressiveDelete')) {
                        data[key].aggressiveDelete = options.aggressiveDelete;
                    }

                    data[key].timestamp = (options && options.timestamp) || new Date().getTime();

                    if ((options && options.maxAge) || config.maxAge) {
                        if (data[key].timeoutId) {
                            $timeout.cancel(data[key].timeoutId);
                        }
                        if (data[key].aggressiveDelete || (!data[key].hasOwnProperty('aggressiveDelete') && config.aggressiveDelete)) {
                            _setTimeoutToRemove(key, ((options && options.maxAge) || config.maxAge));
                        }
                    }

                    _saveCacheConfig();

                    if (config.storageMode) {
                        storage.setItem(prefix + '.data.' + key, angular.toJson(data[key]));
                    }

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
                        aggressiveDelete;

                    if (!lruEntry || !item) {
                        return;
                    }

                    maxAge = item.maxAge || config.maxAge;
                    aggressiveDelete = item.hasOwnProperty('aggressiveDelete') ? item.aggressiveDelete : config.aggressiveDelete;

                    // There is no timeout to delete this item, so we must do it here if it's expired.
                    if (!aggressiveDelete && maxAge) {
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

                    _saveCacheConfig();

                    if (config.storageMode) {
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
                    if (config.storageMode) {
                        var keys = _keys(data);
                        for (var i = 0; i < keys.length; i++) {
                            storage.removeItem(prefix + '.data.' + keys[i]);
                        }
                    }

                    data = {};
                    size = 0;
                    lruHash = {};
                    freshEnd = null;
                    staleEnd = null;

                    if (config.storageMode) {
                        _saveCacheConfig();
                    }
                };

                /**
                 * @method AngularCache.destroy
                 * @desc Completely destroy this cache.
                 * @privileged
                 */
                this.destroy = function () {
                    clearInterval(config.cacheFlushIntervalId);
                    if (config.storageMode) {
                        this.removeAll();
                        storage.removeItem(prefix + '.keys');
                        storage.removeItem(prefix);
                    }
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
                 * @returns {Object} stats Object containing information about this cache.
                 * @privileged
                 */
                this.info = function () {
                    return angular.extend({}, config, { size: size });
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
             * @param {Object} [options] { capacity: {Number}, maxAge: {Number} }
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
    angular.module('angular-cache').provider('$angularCacheFactory', $AngularCacheFactoryProvider);
})(window, window.angular);
