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
     *
     * @example
     angular.module('myApp', ['angular-cache']);
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
        this.$get = ['$timeout', '$q', function ($timeout, $q) {
            var caches = {};

            /**
             * @method _keySet
             * @desc Returns an object of the keys of the given collection.
             * @param {Object} collection The collection from which to get the set of keys.
             * @returns {Object} A hash of the keys of the given collection.
             * @ignore
             */
            function _keySet(collection) {
                var keySet = {};
                for (var key in collection) {
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
                var keys = [];
                for (var key in collection) {
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
             * @param {Object} [options] {{capacity: {Number}, maxAge: {Number}, cacheFlushInterval: {Number} }}
             *
             * @example
             angular.module('myApp').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                    // create a cache with default settings
                    var myCache = $angularCacheFactory('myCache');

                    // create an LRU cache with a capacity of 10
                    var myLRUCache = $angularCacheFactory('myLRUCache', {
                        capacity: 10
                    });

                    // create a cache whose items have a maximum lifetime of 10 minutes
                    var myTimeLimitedCache = $angularCacheFactory('myTimeLimitedCache', {
                        maxAge: 600000
                    });

                    // create a cache that will clear itself every 10 minutes
                    var myIntervalCache = $angularCacheFactory('myIntervalCache', {
                        cacheFlushInterval: 600000
                    });

                    // create an cache with all options
                    var myAwesomeCache = $angularCacheFactory('myAwesomeCache', {
                        capacity: 10,
                        maxAge: 600000,
                        cacheFlushInterval: 600000
                    });
                }
             ]);
             */
            function AngularCache(cacheId, options) {
                var size = 0,
                    config = angular.extend({}, { id: cacheId }),
                    data = {},
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null,
                    self = this;

                options = options || {};

                if (!options.hasOwnProperty('aggressiveDelete')) {
                    options.aggressiveDelete = false;
                }

                // Initialize this cache with the default options
                _setOptions(options, true);

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
                        self.remove(key);
                    }, delay);
                }

                /**
                 * @method _validateNumberOption
                 * @desc Validates the given number option.
                 * @param {Number} option The number option to check.
                 * @param {Function} cb Callback function
                 * @ignore
                 * @private
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
                                    if (data[key].timeoutId && !data[key].maxAge) {
                                        $timeout.cancel(data[key].timeoutId);
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
                }

                /**
                 * @method refresh
                 * @desc Makes the `entry` the freshEnd of the LRU linked list.
                 * @param {Object} entry
                 * @ignore
                 * @private
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
                 * @ignore
                 * @private
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
                 * @method AngularCache.put
                 * @desc Add a key-value pair with timestamp to the cache.
                 * @param {String} key The identifier for the item to add to the cache.
                 * @param {*} value The value of the item to add to the cache.
                 * @param {Object} [options] { maxAge: {Number} }
                 * @returns {*} value The value of the item added to the cache.
                 * @privileged
                 *
                 * @example
                 myCache.put('someItem', { name: 'John Doe' });

                 myCache.get('someItem'); // { name: 'John Doe' });

                 // Give a specific item a maximum age
                 myCache.put('someItem', { name: 'John Doe' }, { maxAge: 10000 });

                 myCache.get('someItem'); // { name: 'John Doe' });

                 // wait at least ten seconds
                 setTimeout(function() {

                    myCache.get('someItem'); // undefined

                }, 15000); // 15 seconds
                 */
                this.put = function (key, value, options) {
                    var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

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

                    _refresh(lruEntry);

                    if (angular.isUndefined(value)) {
                        return;
                    }
                    if (!(key in data)) {
                        size++;
                    }
                    data[key] = {
                        value: value
                    };

                    if (options && options.hasOwnProperty('aggressiveDelete')) {
                        data[key].aggressiveDelete = options.aggressiveDelete;
                    }

                    if ((options && options.maxAge) || config.maxAge) {
                        data[key].timestamp = new Date().getTime();
                        if (data[key].timeoutId) {
                            $timeout.cancel(data[key].timeoutId);
                        }
                        if (data[key].aggressiveDelete || (!data[key].hasOwnProperty('aggressiveDelete') && config.aggressiveDelete)) {
                            _setTimeoutToRemove(key, ((options && options.maxAge) || config.maxAge));
                        }
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
                 * @returns {*} The value of the item in the cache with the specified key.
                 * @privileged
                 *
                 * @example
                 myCache.get('someItem'); // { name: 'John Doe' });

                 // if the item is not in the cache or has expired
                 myCache.get('someMissingItem'); // undefined
                 */
                this.get = function (key) {
                    var lruEntry = lruHash[key],
                        maxAge,
                        aggressiveDelete;

                    if (!lruEntry) {
                        return;
                    }

                    maxAge = data[key].maxAge || config.maxAge;
                    aggressiveDelete = data[key].hasOwnProperty('aggressiveDelete') ? data[key].aggressiveDelete : config.aggressiveDelete;

                    // There is no timeout to delete this item, so we must do it here if it's expired.
                    if (!aggressiveDelete && maxAge) {
                        if ((new Date().getTime() - data[key].timestamp) > maxAge) {
                            // This item is expired so remove it
                            this.remove(key);
                            lruEntry = null;
                            // cache miss
                            return;
                        }
                    }

                    _refresh(lruEntry);

                    return data[key].value;
                };

                /**
                 * @method AngularCache.remove
                 * @desc Remove the specified key-value pair from this cache.
                 * @param {String} key The key of the key-value pair to remove.
                 * @privileged
                 *
                 * @example
                 myCache.put('someItem', { name: 'John Doe' });

                 myCache.remove('someItem');

                 myCache.get('someItem'); // undefined
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
                    size--;
                };

                /**
                 * @method AngularCache.removeAll
                 * @desc Clear this cache.
                 * @privileged
                 *
                 * @example
                 myCache.put('someItem', { name: 'John Doe' });
                 myCache.put('someOtherItem', { name: 'Sally Jean' });

                 myCache.removeAll();

                 myCache.get('someItem'); // undefined
                 myCache.get('someOtherItem'); // undefined
                 */
                this.removeAll = function () {
                    data = {};
                    size = 0;
                    lruHash = {};
                    freshEnd = null;
                    staleEnd = null;
                };

                /**
                 * @method AngularCache.destroy
                 * @desc Completely destroy this cache.
                 * @privileged
                 *
                 * @example
                 myCache.destroy();

                 myCache.get('someItem'); // Will throw an error - Don't try to use a cache after destroying it!

                 $angularCacheFactory.get('myCache'); // undefined
                 */
                this.destroy = function () {
                    clearInterval(config.cacheFlushIntervalId);
                    data = null;
                    config = null;
                    lruHash = null;
                    delete caches[cacheId];
                };

                /**
                 * @method AngularCache.info
                 * @desc Return an object containing information about this cache.
                 * @returns {Object} stats Object containing information about this cache.
                 * @privileged
                 *
                 * @example
                 myCache.info(); // { id: 'myCache', size: 13 }
                 */
                this.info = function () {
                    return angular.extend({}, config, {size: size});
                };

                /**
                 * @method AngularCache.keySet
                 * @desc Return the set of the keys of all items currently in this cache.
                 * @returns {Object} The set of the keys of all items currently in this cache.
                 * @privileged
                 *
                 * @example
                 angular.module('myModule').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                        var newCache = $angularCacheFactory('newCache');

                        newCache.put('item1', { stuff: 1 });
                        newCache.put('item2', { stuff: 2 });

                        var keySet = newCache.keySet(); // { item1: 'item1', item2: 'item2' }

                        keySet.hasOwnProperty('item1'); // true
                        keySet.hasOwnProperty('item2'); // true
                        keySet.hasOwnProperty('item3'); // false
                    });
                 */
                this.keySet = function () {
                    return _keySet(data);
                };

                /**
                 * @method AngularCache.keys
                 * @desc Return an array of the keys of all items currently in this cache..
                 * @returns {Array} An array of the keys of all items currently in this cache..
                 * @privileged
                 *
                 * @example
                 angular.module('myModule').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                    var newCache = $angularCacheFactory('newCache');

                    newCache.put('item1', { stuff: 1 });
                    newCache.put('item2', { stuff: 2 });

                    var keys = newCache.keys(); // [ 'item1', 'item2' ]

                    keys[0]; // 'item1'
                    keys[1]; // 'item2'
                });
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
             *
             * @example
             angular.module('myModule').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                    var myCache = $angularCacheFactory('myCache'),
                        myOtherCache = $angularCacheFactory('myOtherCache');

                    $angularCacheFactory.info(); // { {id: 'myCache', size: 0}, {id: 'myOtherCache', size: 0} }
                });
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
             *
             * @example
             angular.module('myModule').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                    var myCache = $angularCacheFactory.get('myCache');

                    // you can now use myCache
                });
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
             *
             * @example
             angular.module('myModule').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                    $angularCacheFactory('newCache');
                    $angularCacheFactory('newCache2');

                    var keySet = $angularCacheFactory.keySet(); // { newCache: 'newCache', newCache2: 'newCache2' }

                    keySet.hasOwnProperty('newCache'); // true
                    keySet.hasOwnProperty('newCache2'); // true
                    keySet.hasOwnProperty('newCache3'); // false
                });
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
             *
             * @example
             angular.module('myModule').service('myService', ['$angularCacheFactory', function ($angularCacheFactory) {

                    $angularCacheFactory('newCache');
                    $angularCacheFactory('newCache2');

                    var keys = $angularCacheFactory.keys(); // [ 'newCache', 'newCache2' ]

                    keys[0]; // 'newCache'
                    keys[1]; // 'newCache2'
                });
             */
            angularCacheFactory.keys = function () {
                return _keys(caches);
            };

            return angularCacheFactory;
        }];
    }

    // Register the new provider with Angular.
    angular.module('angular-cache').provider('$angularCacheFactory', $AngularCacheFactoryProvider);
})(window, window.angular);
