/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-cache-<%= pkg.version %>.js
 * @version <%= pkg.version %>
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

        /** @private= */
        this.$get = ['$log', function ($log) {
            var caches = {};

            /**
             * @method keySet
             * @desc Returns an object of the keys of the given collection.
             * @param {Object} collection The collection from which to get the set of keys.
             * @returns {Object} A hash of the keys of the given collection.
             * @pre collection != null && angular.isObject(collection)
             * @post angular.isObject(keySet) && keySet contains the "own" keys of collection
             * @ignore
             */
            function keySet(collection) {
                var keySet = {};
                if (!collection || !angular.isObject(collection)) {
                    throw new Error('The collection must be an Object');
                }
                for (var key in collection) {
                    if (collection.hasOwnProperty(key)) {
                        keySet[key] = key;
                    }
                }
                return keySet;
            }

            /**
             * @method keys
             * @desc Returns an array of the keys of the given collection.
             * @param {Object} collection The collection from which to get the keys.
             * @returns {Array} An array of the keys of the given collection.
             * @pre collection != null && angular.isObject(collection)
             * @post angular.isObject(keySet) && keySet contains the "own" keys of collection
             * @ignore
             */
            function keys(collection) {
                var keys = [];
                if (!collection || !angular.isObject(collection)) {
                    throw new Error('The collection must be an Object');
                }
                for (var key in collection) {
                    if (collection.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                return keys;
            }

            /**
             * @class AngularCache
             * @desc Instantiated via <code>$angularCacheFactory()</code>
             * @param {string} cacheId The id of the new cache.
             * @param {object} [options] { capacity: {number}, maxAge: {number}, cacheFlushInterval: {number} }
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
                    staleEnd = null;

                _setOptions(options, true);

                /**
                 * @method _setMaxAge
                 * @desc Set the maxAge for this cache.
                 * @param {Number} maxAge
                 * @private
                 * @ignore
                 */
                function _setMaxAge(maxAge) {
                    var self = this;
                    config.maxAge = maxAge;
                    if (config.maxAge) {
                        var keySet = keySet(data);
                        for (var key in keySet) {
                            if (data[key].timeoutId && !data[key].maxAge) {
                                clearTimeout(data[key].timeoutId);
                                var timeRemaining = new Date().getTime() - data[key].timestamp;
                                if (timeRemaining > 0) {
                                    // Update this item's timeout
                                    data[key].timeoutId = setTimeout(function () {
                                        self.remove(key);
                                    }, config.maxAge);
                                } else {
                                    // The new maxAge has cut this item's life short.
                                    // Immediately remove the item from the cache.
                                    self.remove(key);
                                }
                            }
                        }
                    }
                }

                /**
                 * @method _setCacheFlushInterval
                 * @desc Set the cacheFlushInterval for this cache.
                 * @param {Number} cacheFlushInterval
                 * @private
                 * @ignore
                 */
                function _setCacheFlushInterval(cacheFlushInterval) {
                    if (config.cacheFlushIntervalId) {
                        clearInterval(config.cacheFlushIntervalId);
                        config.cacheFlushIntervalId = null;
                    }
                    if (!cacheFlushInterval) {
                        config.cacheFlushInterval = null;
                    } else {
                        config.cacheFlushInterval = cacheFlushInterval;
                        config.cacheFlushIntervalId = setInterval(function () {
                            var keySet = keySet(data);
                            for (var key in keySet) {
                                if (data[key].timeoutId) {
                                    clearTimeout(data[key].timeoutId);
                                }
                            }
                            size = 0;
                            data = {};
                            lruHash = {};
                            freshEnd = null;
                            staleEnd = null;
                        }, config.cacheFlushInterval);
                    }
                }

                /**
                 * @method _validateNumberOption
                 * @desc Validates the given number option.
                 * @param {Number} option The number option to check.
                 * @param {String} name The name of this option (for logging).
                 * @ignore
                 * @private
                 */
                function _isValidNumberOption(option, name) {
                    try {
                        if (!angular.isNumber(option)) throw new Error(name + ' must be a number!');
                        if (option < 0) throw new Error(name + ' must be greater than zero!');
                    } catch (err) {
                        $log.error('Invalid argument: ' + name, err.message, err.stack);
                    }
                }

                /**
                 * @method _setOptions
                 * @desc Configure this cache with the given options.
                 * @param options
                 * @param {Boolean} strict If true then any existing configuration will be reset to default before
                 * applying the new options, otherwise only the options specified in the hash will be altered.
                 * @private
                 * @ignore
                 */
                function _setOptions(options, strict) {
                    // setup capacity
                    if (!options.capacity && strict) {
                        config.capacity = Number.MAX_VALUE;
                    } else if (options.capacity && _isValidNumberOption(options.capacity, 'capacity')) {
                        config.capacity = options.capacity;
                    }

                    // setup maxAge
                    if (!options.maxAge && strict) {
                        _setMaxAge(null);
                    } else if (options.maxAge && _isValidNumberOption(options.maxAge, 'maxAge')) {
                        _setMaxAge(options.maxAge);
                    }

                    // setup cacheFlushInterval
                    if (!options.cacheFlushInterval && strict) {
                        _setCacheFlushInterval(null);
                    } else if (options.cacheFlushInterval && _isValidNumberOption(options.cacheFlushInterval, 'cacheFlushInterval')) {
                        _setCacheFlushInterval(options.cacheFlushInterval);
                    }
                }

                /**
                 * @method refresh
                 * @desc Makes the `entry` the freshEnd of the LRU linked list.
                 * @param {object} entry
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
                 * @param {object} nextEntry
                 * @param {object} prevEntry
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
                 * @param {string} key The identifier for the item to add to the cache.
                 * @param {*} value The value of the item to add to the cache.
                 * @param {object} [options] { maxAge: {number} }
                 * @returns {*} value The value of the item added to the cache.
                 * @public
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
                    var lruEntry = lruHash[key] || (lruHash[key] = {key: key}),
                        self = this,
                        errorMsg = '';

                    if (!angular.isString(key)) {
                        throw new Error('The key must be a string!');
                    }
                    if (options && options.maxAge) {
                        errorMsg += _validateMaxAge(options.maxAge);
                        if (errorMsg) throw new Error(errorMsg);
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

                    if (config.maxAge || (options && options.maxAge)) {
                        data[key].timestamp = new Date().getTime();
                        if (data[key].timeoutId) {
                            clearTimeout(data[key].timeoutId);
                        }
                        data[key].timeoutId = setTimeout(function () {
                            self.remove(key);
                        }, ((options && options.maxAge) || config.maxAge));
                    }

                    if (size > config.capacity) {
                        this.remove(staleEnd.key);
                    }

                    return value;
                };

                /**
                 * @method AngularCache.get
                 * @desc Retrieve the item from the cache with the specified key.
                 * @param {string} key The key of the item to retrieve.
                 * @returns {*} The value of the item in the cache with the specified key.
                 * @public
                 *
                 * @example
                 myCache.get('someItem'); // { name: 'John Doe' });

                 // if the item is not in the cache or has expired
                 myCache.get('someMissingItem'); // undefined
                 */
                this.get = function (key) {
                    var lruEntry = lruHash[key];

                    if (!lruEntry) {
                        return;
                    }

                    _refresh(lruEntry);

                    return data[key].value;
                };

                /**
                 * @method AngularCache.remove
                 * @desc Remove the specified key-value pair from this cache.
                 * @param {string} key The key of the key-value pair to remove.
                 * @public
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
                 * @public
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
                    freshEnd = staleEnd = null;
                };

                /**
                 * @method AngularCache.destroy
                 * @desc Completely destroy this cache.
                 * @public
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
                 * @returns {object} stats Object containing information about this cache.
                 * @public
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
                 * @public
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
                    return keySet(data);
                };

                /**
                 * @method AngularCache.keys
                 * @desc Return an array of the keys of all items currently in this cache..
                 * @returns {Array} An array of the keys of all items currently in this cache..
                 * @public
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
                    return keys(data);
                };

                /**
                 * @method AngularCache.setOptions
                 * @desc Configure this cache with the given options.
                 * @param {Object} options
                 * @param {Boolean} strict If true then any existing configuration will be reset to defaults before
                 * applying the new options, otherwise only the options specified in the hash will be altered.
                 */
                this.setOptions = _setOptions;
            }

            /**
             * @class angularCacheFactory
             * @param {string} cacheId The id of the new cache.
             * @param {options} [options] { capacity: {number}, maxAge: {number} }
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
             * @returns {object} An object containing information about all caches of this factory.
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
                angular.forEach(caches, function (cache, cacheId) {
                    info[cacheId] = cache.info();
                });
                return info;
            };

            /**
             * @method angularCacheFactory.get
             * @desc Return the cache with the specified cacheId.
             * @param {string} cacheId The id of the desired cache.
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
                return keySet(caches);
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
                return keys(caches);
            };

            return angularCacheFactory;
        }];
    }

    // Register the new provider with Angular.
    angular.module('angular-cache').provider('$angularCacheFactory', $AngularCacheFactoryProvider);
})(window, window.angular);
