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
             * @method bubbleUp
             * @param {Array} heap The heap.
             * @param {Function} weightFunc The weight function.
             * @param {Number} n The index of the element to bubble up.
             * @ignore
             */
            function bubbleUp(heap, weightFunc, n) {
                var element = heap[n],
                    weight = weightFunc(element);
                // When at 0, an element can not go up any further.
                while (n > 0) {
                    // Compute the parent element's index, and fetch it.
                    var parentN = Math.floor((n + 1) / 2) - 1,
                        parent = heap[parentN];
                    // If the parent has a lesser weight, things are in order and we
                    // are done.
                    if (weight >= weightFunc(parent)) {
                        break;
                    } else {
                        heap[parentN] = element;
                        heap[n] = parent;
                        n = parentN;
                    }
                }
            }

            /**
             * @method bubbleDown
             * @param {Array} heap The heap.
             * @param {Function} weightFunc The weight function.
             * @param {Number} n The index of the element to sink down.
             * @ignore
             */
            function bubbleDown(heap, weightFunc, n) {
                var length = heap.length,
                    node = heap[n],
                    nodeWeight = weightFunc(node);

                while (true) {
                    var child2N = (n + 1) * 2,
                        child1N = child2N - 1;
                    var swap = null;
                    if (child1N < length) {
                        var child1 = heap[child1N],
                            child1Weight = weightFunc(child1);
                        // If the score is less than our node's, we need to swap.
                        if (child1Weight < nodeWeight) {
                            swap = child1N;
                        }
                    }
                    // Do the same checks for the other child.
                    if (child2N < length) {
                        var child2 = heap[child2N],
                            child2Weight = weightFunc(child2);
                        if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
                            swap = child2N;
                        }
                    }

                    if (swap === null) {
                        break;
                    } else {
                        heap[n] = heap[swap];
                        heap[swap] = node;
                        n = swap;
                    }
                }
            }

            /**
             * @class BinaryHeap
             * @desc BinaryHeap implementation of a priority queue.
             * @param {Function} weightFunc Function that determines how each node should be weighted.
             */
            function BinaryHeap(weightFunc) {
                if (weightFunc  && !angular.isFunction(weightFunc)) {
                    throw new Error('BinaryHeap(weightFunc): weightFunc: must be a function!');
                }
                weightFunc = weightFunc || function (x) {
                    return x;
                };
                this.weightFunc = weightFunc;
                this.heap = [];
            }

            /**
             * @method BinaryHeap.push
             * @desc Push an element into the binary heap.
             * @param {*} node The element to push into the binary heap.
             * @public
             */
            BinaryHeap.prototype.push = function (node) {
                this.heap.push(node);
                bubbleUp(this.heap, this.weightFunc, this.heap.length - 1);
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
             * @method BinaryHeap.pop
             * @desc Remove and return the minimum element in the binary heap.
             * @returns {*}
             * @public
             */
            BinaryHeap.prototype.pop = function () {
                var front = this.heap[0],
                    end = this.heap.pop();
                if (this.heap.length > 0) {
                    this.heap[0] = end;
                    bubbleDown(this.heap, this.weightFunc, 0);
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
                            bubbleUp(this.heap, this.weightFunc, i);
                            bubbleDown(this.heap, this.weightFunc, i);
                        }
                        return removed;
                    }
                }
                return null;
            };

            /**
             * @method BinaryHeap.removeAll
             * @desc Remove all nodes from this BinaryHeap.
             * @public
             */
            BinaryHeap.prototype.removeAll = function () {
                this.heap = [];
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
                    recycleFreq: 1000,
                    storageMode: 'none',
                    storageImpl: null,
                    verifyIntegrity: true
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
            var errStr = '$angularCacheFactoryProvider.setCacheDefaults(options): ';
            options = options || {};

            if (!angular.isObject(options)) {
                throw new Error(errStr + 'options: must be an object!');
            }

            if ('capacity' in options) {
                _validateNumberOption(options.capacity, function (err) {
                    if (err) {
                        throw new Error(errStr + 'capacity: ' + err);
                    }
                });
            }

            if ('deleteOnExpire' in options) {
                if (!angular.isString(options.deleteOnExpire)) {
                    throw new Error(errStr + 'deleteOnExpire: must be a string!');
                } else if (options.deleteOnExpire !== 'none' && options.deleteOnExpire !== 'passive' && options.deleteOnExpire !== 'aggressive') {
                    throw new Error(errStr + 'deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
                }
            }

            if ('maxAge' in options) {
                _validateNumberOption(options.maxAge, function (err) {
                    if (err) {
                        throw new Error(errStr + 'maxAge: ' + err);
                    }
                });
            }

            if ('recycleFreq' in options) {
                _validateNumberOption(options.recycleFreq, function (err) {
                    if (err) {
                        throw new Error(errStr + 'recycleFreq: ' + err);
                    }
                });
            }

            if ('cacheFlushInterval' in options) {
                _validateNumberOption(options.cacheFlushInterval, function (err) {
                    if (err) {
                        throw new Error(errStr + 'cacheFlushInterval: ' + err);
                    }
                });
            }

            if ('storageMode' in options) {
                if (!angular.isString(options.storageMode)) {
                    throw new Error(errStr + 'storageMode: must be a string!');
                } else if (options.storageMode !== 'none' && options.storageMode !== 'localStorage' && options.storageMode !== 'sessionStorage') {
                    throw new Error(errStr + 'storageMode: accepted values are "none", "localStorage" or "sessionStorage"');
                }
                if ('storageImpl' in options) {
                    if (!angular.isObject(options.storageImpl)) {
                        throw new Error(errStr + '[local|session]storageImpl: must be an object!');
                    } else if (!('setItem' in options.storageImpl) || typeof options.storageImpl.setItem !== 'function') {
                        throw new Error(errStr + '[local|session]storageImpl: must implement "setItem(key, value)"!');
                    } else if (!('getItem' in options.storageImpl) || typeof options.storageImpl.getItem !== 'function') {
                        throw new Error(errStr + '[local|session]storageImpl: must implement "getItem(key)"!');
                    } else if (!('removeItem' in options.storageImpl) || typeof options.storageImpl.removeItem !== 'function') {
                        throw new Error(errStr + '[local|session]storageImpl: must implement "removeItem(key)"!');
                    }
                }
            }

            if ('onExpire' in options) {
                if (typeof options.onExpire !== 'function') {
                    throw new Error(errStr + 'onExpire: Must be a function!');
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
                var config = angular.extend({}, { id: cacheId }),
                    data = {},
                    expiresHeap = new BinaryHeap(function (x) {
                        return x.expires;
                    }),
                    lruHeap = new BinaryHeap(function (x) {
                        return x.accessed;
                    }),
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
                            while (lruHeap.size() > config.capacity) {
                                self.remove(lruHeap.peek().key, { verifyIntegrity: false });
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
                                if (!('maxAge' in data[key])) {
                                    delete data[key].expires;
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
                                    var now = new Date().getTime();
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        if (!('maxAge' in data[key])) {
                                            data[key].expires = data[key].created + config.maxAge;
                                            if (data[key].expires < now) {
                                                self.remove(key, { verifyIntegrity: false });
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }

                /**
                 * @method _setRecycleFreq
                 * @desc Set the recycleFreq setting for this cache.
                 * @param {Number} recycleFreq The new recycleFreq for this cache.
                 * @private
                 * @ignore
                 */
                function _setRecycleFreq(recycleFreq) {
                    if (recycleFreq === null) {
                        if (config.recycleFreqId) {
                            clearInterval(config.recycleFreqId);
                            delete config.recycleFreqId;
                        }
                        config.recycleFreq = cacheDefaults.recycleFreq;
                    } else {
                        _validateNumberOption(recycleFreq, function (err) {
                            if (err) {
                                throw new Error('recycleFreq: ' + err);
                            } else {
                                config.recycleFreq = recycleFreq;
                                if (config.recycleFreqId) {
                                    clearInterval(config.recycleFreqId);
                                }
                                config.recycleFreqId = setInterval(self.removeExpired, config.recycleFreq);
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
                        throw new Error('storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
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
                 * @param {Boolean} [strict] If true then any existing configuration will be reset to default before
                 * applying the new options, otherwise only the options specified in the options hash will be altered.
                 * @param {Object} [opts] Configuration.
                 * @private
                 * @ignore
                 */
                function _setOptions(options, strict, opts) {
                    options = options || {};
                    opts = opts || {};
                    strict = !!strict;
                    if (!angular.isObject(options)) {
                        throw new Error('AngularCache.setOptions(options, strict): options: must be an object!');
                    }

                    _verifyIntegrity(opts.verifyIntegrity);

                    if (strict) {
                        options = angular.extend({}, cacheDefaults, options);
                    }

                    if ('verifyIntegrity' in options) {
                        config.verifyIntegrity = options.verifyIntegrity === true;
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

                    if ('recycleFreq' in options) {
                        _setRecycleFreq(options.recycleFreq);
                    }

                    if ('cacheFlushInterval' in options) {
                        _setCacheFlushInterval(options.cacheFlushInterval);
                    }

                    if ('storageMode' in options) {
                        _setStorageMode(options.storageMode, options.storageImpl);
                    }

                    if ('onExpire' in options) {
                        if (options.onExpire !== null && typeof options.onExpire !== 'function') {
                            throw new Error('onExpire: must be a function!');
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

                function _verifyIntegrity(verifyIntegrity) {
                    if (verifyIntegrity || (verifyIntegrity !== false && config.verifyIntegrity)) {
                        if (config.storageMode !== 'none' && storage) {
                            var keys = _keys(data);
                            storage.setItem(prefix + '.keys', angular.toJson(keys));
                            for (var i = 0; i < keys.length; i++) {
                                storage.setItem(prefix + '.data.' + keys[i], angular.toJson(data[keys[i]]));
                            }
                        }
                    }
                }

                function _saveKeysToStorage(keys) {
                    if (config.storageMode !== 'none' && storage) {
                        var keysToSave = keys || _keys(data);
                        storage.setItem(prefix + '.keys', angular.toJson(keysToSave));
                    }
                }

                function _saveItemToStorage(key) {
                    if (config.storageMode !== 'none' && storage) {
                        storage.setItem(prefix + '.data.' + key, angular.toJson(data[key]));
                    }
                }

                function _removeAllFromStorage() {
                    if (config.storageMode !== 'none' && storage) {
                        var keys = _keys(data);
                        for (var i = 0; i < keys.length; i++) {
                            storage.removeItem(prefix + '.data.' + keys[i]);
                        }
                        storage.setItem(prefix + '.keys', angular.toJson([]));
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
                    options = options || {};
                    if (!angular.isString(key)) {
                        throw new Error('AngularCache.put(key, value, options): key: must be a string!');
                    } else if (options.maxAge && options.maxAge !== null) {
                        _validateNumberOption(options.maxAge, function (err) {
                            if (err) {
                                throw new Error('AngularCache.put(key, value, options): maxAge: ' + err);
                            }
                        });
                    } else if (options.deleteOnExpire && !angular.isString(options.deleteOnExpire)) {
                        throw new Error('AngularCache.put(key, value, options): deleteOnExpire: must be a string!');
                    } else if (angular.isUndefined(value)) {
                        return;
                    }

                    var now = new Date().getTime(),
                        deleteOnExpire, item;

                    _verifyIntegrity(options.verifyIntegrity);

                    if (data[key]) {
                        expiresHeap.remove(data[key]);
                        lruHeap.remove(data[key]);
                    } else {
                        data[key] = { key: key };
                    }

                    item = data[key];
                    item.value = value;
                    item.created = (parseInt(options.created, 10)) || item.created || now;
                    item.accessed = (parseInt(options.accessed, 10)) || now;

                    if (options.deleteOnExpire) {
                        item.deleteOnExpire = options.deleteOnExpire;
                    }
                    if (options.maxAge) {
                        item.maxAge = options.maxAge;
                    }

                    if (item.maxAge || config.maxAge) {
                        item.expires = item.created + (item.maxAge || config.maxAge);
                    }

                    deleteOnExpire = item.deleteOnExpire || config.deleteOnExpire;

                    if (item.expires && deleteOnExpire === 'aggressive') {
                        expiresHeap.push(item);
                    }

                    // Sync with localStorage, etc.
                    _saveKeysToStorage();
                    _saveItemToStorage(key);

                    lruHeap.push(item);

                    if (lruHeap.size() > config.capacity) {
                        this.remove(lruHeap.peek().key, { verifyIntegrity: false });
                    }

                    return value;
                };

                /**
                 * @method AngularCache.get
                 * @desc Retrieve the item from the cache with the specified key.
                 * @param {String} key The key of the item to retrieve.
                 * @param {Object} [options] Configuration.
                 * @returns {*} The value of the item in the cache with the specified key.
                 * @privileged
                 */
                this.get = function (key, options) {
                    options = options || {};
                    if (!angular.isString(key)) {
                        throw new Error('AngularCache.get(key, onExpire): key: must be a string!');
                    } else if (options.onExpire && typeof options.onExpire !== 'function') {
                        throw new Error('AngularCache.get(key, onExpire): onExpire: must be a function!');
                    } else if (!(key in data)) {
                        return;
                    }

                    _verifyIntegrity(options.verifyIntegrity);

                    var item = data[key],
                        value = item.value,
                        now = new Date().getTime(),
                        deleteOnExpire = item.deleteOnExpire || config.deleteOnExpire;

                    lruHeap.remove(item);
                    item.accessed = now;
                    lruHeap.push(item);

                    if (deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
                        this.remove(key, { verifyIntegrity: false });

                        if (config.onExpire) {
                            config.onExpire(key, item.value, (options.onExpire));
                        } else if (options.onExpire) {
                            options.onExpire(key, item.value);
                        }
                        value = undefined;
                    }

                    _saveItemToStorage(key);

                    return value;
                };

                /**
                 * @method AngularCache.remove
                 * @desc Remove the item with the specified key from this cache.
                 * @param {String} key The key of the item to remove.
                 * @param {Object} [options] Configuration.
                 * @privileged
                 */
                this.remove = function (key, options) {
                    options = options || {};
                    _verifyIntegrity(options.verifyIntegrity);
                    lruHeap.remove(data[key]);
                    expiresHeap.remove(data[key]);
                    if (config.storageMode !== 'none' && storage) {
                        storage.removeItem(prefix + '.data.' + key);
                    }
                    delete data[key];
                    _saveKeysToStorage();
                };

                /**
                 * @method AngularCache.removeAll
                 * @desc Clear this cache.
                 * @privileged
                 */
                this.removeAll = function () {
                    _removeAllFromStorage();
                    lruHeap.removeAll();
                    expiresHeap.removeAll();
                    data = {};
                };

                /**
                 * @method AngularCache.removeExpired
                 * @desc Remove all items from this cache that have expired.
                 * @param {Object} [options] Configuration.
                 * @privileged
                 */
                this.removeExpired = function (options) {
                    options = options || {};
                    _verifyIntegrity(options.verifyIntegrity);
                    var now = new Date().getTime();
                    while (expiresHeap.peek().expires < now) {
                        this.remove(expiresHeap.peek().key, { verifyIntegrity: false });
                    }
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
                    if (config.recycleFreqId) {
                        clearInterval(config.recycleFreqId);
                    }
                    this.removeAll();
                    if (config.storageMode !== 'none' && storage) {
                        storage.removeItem(prefix + '.keys');
                        storage.removeItem(prefix);
                    }
                    storage = null;
                    data = null;
                    config = null;
                    prefix = null;
                    self = null;
                    caches[cacheId] = null;
                    delete caches[cacheId];
                };

                /**
                 * @method AngularCache.info
                 * @desc Return an object containing information about this cache.
                 * @param {String} [key] The key of the item about which to retrieve information.
                 * @returns {Object} stats Object containing information about this cache or the item with the
                 * specified key.
                 * @privileged
                 */
                this.info = function (key) {
                    if (key) {
                        if (data[key]) {
                            var info = {
                                created: data[key].created,
                                accessed: data[key].accessed,
                                expires: data[key].expires,
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
                        return angular.extend({}, config, { size: lruHeap.size() });
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
                 * @param {Boolean} [strict] If true then any existing configuration will be reset to defaults before
                 * applying the new options, otherwise only the options specified in the hash will be altered.
                 * @param {Object} [opts] Configuration.
                 * @privileged
                 */
                this.setOptions = _setOptions;

                // Initialize this cache with the default and given options
                _setOptions(options, true, { verifyIntegrity: false });
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
                if (!angular.isString(cacheId)) {
                    throw new Error('$angularCacheFactory.get(cacheId): cacheId: must be a string!');
                }
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
