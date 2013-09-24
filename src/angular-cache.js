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

    angular.module('jmdobry.binary-heap', []);

    /**
     * @class BinaryHeapProvider
     * @desc Provider for the BinaryHeap.
     */
    function BinaryHeapProvider() {
        this.$get = function () {
            /**
             * @class BinaryHeap
             * @desc BinaryHeap implementation of a priority queue.
             * @param {Function} weightFunc Function that determines how each node should be weighted.
             * @param {Boolean} reverse Whether to reverse the ordering of the binary heap.
             */
            function BinaryHeap(weightFunc, reverse) {
                this.heap = [];
                this.weightFunc = weightFunc;
                this.reverse = reverse;
            }

            /**
             * @method BinaryHeap.push
             * @desc Push an element into the binary heap.
             * @param {*} node The element to push into the binary heap.
             * @public
             */
            BinaryHeap.prototype.push = function (node) {
                this.heap.push(node);
                this.bubbleUp(this.heap.length - 1);
            };

            /**
             * @method BinaryHeap.peek
             * @desc Return, but do not remove, the minimum element in the binary heap.
             * @returns {*}
             * @public
             */
            BinaryHeap.prototype.peek = function () {
                return this.heap[0];
            };

            /**
             * @method BinaryHeap.removeMin
             * @desc Remove and return the minimum element in the binary heap.
             * @returns {*}
             * @public
             */
            BinaryHeap.prototype.removeMin = function () {
                var front = this.heap[0],
                    end = this.heap.pop();
                if (this.heap.length > 0) {
                    this.heap[0] = end;
                    this.sinkDown(0);
                }
                return front;
            };

            /**
             * @method BinaryHeap.remove
             * @desc Remove the first node in the priority queue that satisfies angular.equals comparison with
             * the given node.
             * @param {*} node The node to remove.
             * @returns {*} The removed node.
             * @public
             */
            BinaryHeap.prototype.remove = function (node) {
                var length = this.heap.length;
                for (var i = 0; i < length; i++) {
                    if (angular.equals(this.heap[i], node)) {
                        var removed = this.heap[i],
                            end = this.heap.pop();
                        if (i !== length - 1) {
                            this.heap[i] = end;
                            this.bubbleUp(i);
                            this.sinkDown(i);
                        }
                        return removed;
                    }
                }
                return null;
            };

            /**
             * @method BinaryHeap.size
             * @desc Return the size of the priority queue.
             * @returns {Number} The size of the priority queue.
             * @public
             */
            BinaryHeap.prototype.size = function () {
                return this.heap.length;
            };

            /**
             * @method BinaryHeap.bubbleUp
             * @param {Number} n The index of the element to bubble up.
             * @ignore
             */
            BinaryHeap.prototype.bubbleUp = function (n) {
                var element = this.heap[n],
                    weight = this.weightFunc(element);
                // When at 0, an element can not go up any further.
                while (n > 0) {
                    // Compute the parent element's index, and fetch it.
                    var parentN = Math.floor((n + 1) / 2) - 1,
                        parent = this.heap[parentN];
                    // If the parent has a lesser weight, things are in order and we
                    // are done.
                    if (weight >= this.weightFunc(parent)) {
                        break;
                    } else {
                        this.heap[parentN] = element;
                        this.heap[n] = parent;
                        n = parentN;
                    }
                }
            };

            /**
             * @method BinaryHeap.sinkDown
             * @param {Number} n The index of the element to sink down.
             * @ignore
             */
            BinaryHeap.prototype.sinkDown = function (n) {
                var length = this.heap.length,
                    node = this.heap[n],
                    nodeWeight = this.weightFunc(node);

                while (true) {
                    var child2N = (n + 1) * 2,
                        child1N = child2N - 1;
                    var swap = null;
                    if (child1N < length) {
                        var child1 = this.heap[child1N],
                            child1Weight = this.weightFunc(child1);
                        // If the score is less than our node's, we need to swap.
                        if (child1Weight < nodeWeight) {
                            swap = child1N;
                        }
                    }
                    // Do the same checks for the other child.
                    if (child2N < length) {
                        var child2 = this.heap[child2N],
                            child2Weight = this.weightFunc(child2);
                        if (child2Weight < (swap === null ? nodeWeight : child1Weight)) {
                            swap = child2N;
                        }
                    }

                    if (swap === null) {
                        break;
                    } else {
                        this.heap[n] = this.heap[swap];
                        this.heap[swap] = node;
                        n = swap;
                    }
                }
            };

            return BinaryHeap;
        };
    }

    angular.module('jmdobry.binary-heap').provider('BinaryHeap', BinaryHeapProvider);

    /**
     * @module angular-cache
     * @desc Provides an $AngularCacheFactoryProvider, which gives you the ability to use an
     *       $angularCacheFactory. The $angularCacheFactory produces AngularCache objects, which
     *       the same abilities as the cache objects that come with Angular, except with some added
     *       functionality.
     */
    angular.module('jmdobry.angular-cache', ['ng', 'jmdobry.binary-heap']);

    /**
     * @class $AngularCacheFactoryProvider
     * @desc Provider for the $angularCacheFactory.
     * @see {@link http://docs.angularjs.org/api/ng.$cacheFactory|ng.$cacheFactory}
     */
    function $AngularCacheFactoryProvider() {

        var cacheDefaults,
            DEFAULTS = function () {
                return {
                    capacity: Number.MAX_VALUE,
                    maxAge: null,
                    deleteOnExpire: 'none',
                    onExpire: null,
                    cacheFlushInterval: null,
                    storageMode: 'none',
                    storageImpl: null
                };
            };

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
         * @method $AngularCacheFactoryProvider.setCacheDefaults
         * @desc Set the default configuration for all caches created by $angularCacheFactory.
         * @param {Object} options
         * @privileged
         */
        this.setCacheDefaults = function (options) {
            options = options || {};

            if (!angular.isObject(options)) {
                throw new Error('setOptions(): options: must be an object!');
            }

            if ('capacity' in options) {
                _validateNumberOption(options.capacity, function (err) {
                    if (err) {
                        throw new Error('setCacheDefaults(): capacity: ' + err);
                    }
                });
            }

            if ('deleteOnExpire' in options) {
                if (!angular.isString(options.deleteOnExpire)) {
                    throw new Error('setCacheDefaults(): deleteOnExpire: must be a string!');
                } else if (options.deleteOnExpire !== 'none' && options.deleteOnExpire !== 'passive' && options.deleteOnExpire !== 'aggressive') {
                    throw new Error('setCacheDefaults(): deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
                }
            }

            if ('maxAge' in options) {
                _validateNumberOption(options.maxAge, function (err) {
                    if (err) {
                        throw new Error('setCacheDefaults(): maxAge: ' + err);
                    }
                });
            }

            if ('cacheFlushInterval' in options) {
                _validateNumberOption(options.cacheFlushInterval, function (err) {
                    if (err) {
                        throw new Error('setCacheDefaults(): cacheFlushInterval: ' + err);
                    }
                });
            }

            if ('storageMode' in options) {
                if (!angular.isString(options.storageMode)) {
                    throw new Error('setCacheDefaults(): storageMode: must be a string!');
                } else if (options.storageMode !== 'none' && options.storageMode !== 'localStorage' && options.storageMode !== 'sessionStorage') {
                    throw new Error('setCacheDefaults(): storageMode: accepted values are "none", "localStorage" or "sessionStorage"');
                }
                if ('storageImpl' in options) {
                    if (!angular.isObject(options.storageImpl)) {
                        throw new Error('setCacheDefaults(): [local|session]storageImpl: must be an object!');
                    } else if (!('setItem' in options.storageImpl) || typeof options.storageImpl.setItem !== 'function') {
                        throw new Error('setCacheDefaults(): [local|session]storageImpl: must implement "setItem(key, value)"!');
                    } else if (!('getItem' in options.storageImpl) || typeof options.storageImpl.getItem !== 'function') {
                        throw new Error('setCacheDefaults(): [local|session]storageImpl: must implement "getItem(key)"!');
                    } else if (!('removeItem' in options.storageImpl) || typeof options.storageImpl.removeItem !== 'function') {
                        throw new Error('setCacheDefaults(): [local|session]storageImpl: must implement "removeItem(key)"!');
                    }
                }
            }

            if ('onExpire' in options) {
                if (typeof options.onExpire !== 'function') {
                    throw new Error('setCacheDefaults(): onExpire: Must be a function!');
                }
            }

            cacheDefaults = angular.extend({}, DEFAULTS(), options);
        };

        // Initialize cacheDefaults with the defaults
        this.setCacheDefaults({});

        /**
         * @ignore
         */
        this.$get = ['$timeout', '$window', 'BinaryHeap', function ($timeout, $window, BinaryHeap) {
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
             * @param {Object} [options] {{[capacity]: Number, [maxAge]: Number, [cacheFlushInterval]: Number, [deleteOnExpire]: String, [onExpire]: Function, [storageMode]: String, [storageImpl]: Object}}
             */
            function AngularCache(cacheId, options) {
                var size = 0,
                    config = angular.extend({}, { id: cacheId }),
                    data = {},
                    lruHash = {},
                    expiresHeap = new BinaryHeap(function (x) {
                        return x.expires;
                    }),
                    lruHeap = new BinaryHeap(function (x) {
                        return x.accessed;
                    }),
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
                        expiresHeap.remove(data[key]);
                        self.remove(key);
                        if (config.onExpire) {
                            config.onExpire(key, value);
                        }
                    }, delay);
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
                        options = angular.extend({}, cacheDefaults, options);
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
                        _setStorageMode(options.storageMode, options.storageImpl);
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
                 * @param {Object} [options] {{ maxAge: {Number}, deleteOnExpire: {String} }}
                 * @returns {*} value The value of the item added to the cache.
                 * @privileged
                 */
                this.put = function (key, value, options) {
                    if (!angular.isString(key)) {
                        throw new Error('AngularCache.put(key, value, options): key: must be a string!');
                    } else if (options && options.maxAge && options.maxAge !== null) {
                        _validateNumberOption(options.maxAge, function (err) {
                            if (err) {
                                throw new Error('AngularCache.put(key, value, options): maxAge: ' + err);
                            }
                        });
                    } else if (options && options.deleteOnExpire && !angular.isString(options.deleteOnExpire)) {
                        throw new Error('AngularCache.put(key, value, options): deleteOnExpire: must be a string!');
                    } else if (angular.isUndefined(value)) {
                        return;
                    }

                    var now = new Date().getTime(),
                        deleteOnExpire, item;

                    data[key] = data[key] || {};
                    item = data[key];

                    item.value = value;
                    item.created = (options && parseInt(options.created, 10)) || item.created || now;
                    item.modified = (options && parseInt(options.modified, 10)) || now;
                    item.accessed = (options && parseInt(options.accessed, 10)) || now;

                    if (options && options.deleteOnExpire) {
                        item.deleteOnExpire = options.deleteOnExpire;
                    }
                    if (options && options.maxAge) {
                        item.maxAge = options.maxAge;
                    }

                    if (item.maxAge || config.maxAge) {
                        item.expires = item.created + (item.maxAge || config.maxAge);
                    }

                    deleteOnExpire = item.deleteOnExpire || config.deleteOnExpire;

                    if (deleteOnExpire === 'aggressive' && item.expires) {
                        expiresHeap.push(item);
                    }

                    if (config.storageMode !== 'none' && storage) {
                        storage.setItem(prefix + '.keys', angular.toJson(_keys(data)));
                        storage.setItem(prefix + '.data.' + key, angular.toJson(item));
                    }

                    lruHeap.push(item);

                    if (lruHeap.size() > config.capacity) {
                        lruHeap.removeMin();
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
                    if (!angular.isString(key)) {
                        throw new Error('AngularCache.get(key, onExpire): key: must be a string!');
                    } else if (onExpire && typeof onExpire !== 'function') {
                        throw new Error('AngularCache.get(key, onExpire): onExpire: must be a function!');
                    } else if (!(key in data)) {
                        return;
                    }

                    var value = data[key].value,
                        now = new Date().getTime();

                    data[key].accessed = now;

                    if ('expires' in data[key] && data[key].expires < now) {
                        this.remove(key);
                        if (config.storageMode !== 'none' && storage) {
                            storage.setItem(prefix + '.keys', angular.toJson(_keys(data)));
                            storage.removeItem(prefix + '.data.' + key);
                        }

                        if (config.onExpire) {
                            config.onExpire(key, data[key].value, onExpire);
                        } else if (onExpire && typeof onExpire === 'function') {
                            onExpire(key, data[key].value);
                        }
                        value = undefined;
                    }

                    if (config.storageMode !== 'none' && storage) {
                        storage.setItem(prefix + '.keys', angular.toJson(_keys(data)));
                        storage.setItem(prefix + '.data.' + key, angular.toJson(data[key]));
                    }

                    return value;
                };

                /**
                 * @method AngularCache.remove
                 * @desc Remove the specified key-value pair from this cache.
                 * @param {String} key The key of the key-value pair to remove.
                 * @privileged
                 */
                this.remove = function (key) {
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
             * @param  {Object} [options] {{[capacity]: Number, [maxAge]: Number, [cacheFlushInterval]: Number, [deleteOnExpire]: String, [onExpire]: Function, [storageMode]: String, [storageImpl]: Object}}
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
                var keys = _keys(caches);
                var info = {
                    size: keys.length,
                    caches: {}
                };
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    info.caches[key] = caches[key].info();
                }
                info.cacheDefaults = cacheDefaults;
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
