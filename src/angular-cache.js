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
    angular.module('angular-cache', []);

    /**
     * @class $AngularCacheFactoryProvider
     * @desc Provider for the $angularCacheFactory.
     * @see {@link http://docs.angularjs.org/api/ng.$cacheFactory|ng.$cacheFactory}
     */
    function $AngularCacheFactoryProvider() {

        /** @private= */
        this.$get = function () {
            var caches = {};

            /**
             * @method keySet
             * @desc Returns an object of the keys of the given collection.
             * @param {Object} collection
             * @returns {Object} A hash of the keys of the given collection.
             * @ignore
             */
            function keySet(collection) {
                var _keySet = {};
                for (var key in collection) {
                    if (collection.hasOwnProperty(key)) {
                        _keySet[key] = key;
                    }
                }
                return _keySet;
            }

            /**
             * @method keys
             * @desc Returns an array of the keys of the given collection.
             * @param {Object} collection
             * @returns {Array} An array of the keys of the given collection.
             * @ignore
             */
            function keys(collection) {
                var _keys = [];
                for (var key in collection) {
                    if (collection.hasOwnProperty(key)) {
                        _keys.push(key);
                    }
                }
                return _keys;
            }

            /**
             * @class AngularCache
             * @desc Instantiated via <code>$angularCacheFactory()</code>
             * @param {String} cacheId The id of the new cache.
             * @param {Object} [options] { capacity: {Number}, maxAge: {Number}, cacheFlushInterval: {Number} }
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
                    config = angular.extend({}, options, {id: cacheId}),
                    data = {},
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null,
                    errorMsg = '';

                // validate options
                errorMsg += _validateCapacity(config.capacity);
                errorMsg += _validateMaxAge(config.maxAge);
                errorMsg += _validateCacheFlushInterval(config.cacheFlushInterval);
                if (errorMsg) throw new Error(errorMsg);

                // Set the default capacity
                if (!config.capacity) {
                    config.capacity = Number.MAX_VALUE;
                }

                // Start the timer for the cacheFlushInterval
                if (config.cacheFlushInterval) {
                    config.cacheFlushIntervalId = setInterval(function () {
                        for (var key in data) {
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

                /**
                 * @method validateCapacity
                 * @desc Validates the capacity.
                 * @param {Number} capacity
                 * @returns {String} errorMsg
                 * @ignore
                 * @private
                 */
                function _validateCapacity(capacity) {
                    var errorMsg = '';
                    if (config.capacity) {
                        if (!angular.isNumber(config.capacity)) errorMsg += 'capacity must be a number!;';
                        if (config.capacity < 0) errorMsg += 'capacity must be greater than zero!;';
                    }
                    return errorMsg;
                }

                /**
                 * @method validateCacheFlushInterval
                 * @desc Validates the cacheFlushInterval.
                 * @param {Number} cacheFlushInterval
                 * @returns {String} errorMsg
                 * @ignore
                 * @private
                 */
                function _validateCacheFlushInterval(cacheFlushInterval) {
                    var errorMsg = '';
                    if (config.cacheFlushInterval) {
                        if (!angular.isNumber(config.cacheFlushInterval)) errorMsg += 'cacheFlushInterval must be a number!;';
                        if (config.cacheFlushInterval < 0) errorMsg += 'cacheFlushInterval must be greater than zero!;';
                    }
                    return errorMsg;
                }

                /**
                 * @method validateMaxAge
                 * @desc Validates the maxAge.
                 * @param {Number} maxAge
                 * @returns {String} errorMsg
                 * @ignore
                 * @private
                 */
                function _validateMaxAge(maxAge) {
                    var errorMsg = '';
                    if (maxAge) {
                        if (!angular.isNumber(maxAge)) errorMsg += 'maxAge must be a number!;';
                        if (maxAge < 0) errorMsg += 'maxAge must be greater than zero!;';
                    }
                    return errorMsg;
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
                 * @param {String} key The key of the item to retrieve.
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
                 * @param {String} key The key of the key-value pair to remove.
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
                 * @returns {Object} stats Object containing information about this cache.
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
            }

            /**
             * @class angularCacheFactory
             * @param {String} cacheId The id of the new cache.
             * @param {options} [options] { capacity: {Number}, maxAge: {Number} }
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
                angular.forEach(caches, function (cache, cacheId) {
                    info[cacheId] = cache.info();
                });
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
        };
    }

    // Register the new provider with Angular.
    angular.module('angular-cache').provider('$angularCacheFactory', $AngularCacheFactoryProvider);
})(window, window.angular);
