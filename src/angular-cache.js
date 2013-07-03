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
        this.$get = ['$log', '$timeout', '$q', function ($log, $timeout, $q) {
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
                    config = angular.extend({}, { id: cacheId }),
                    data = {},
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null,
                    self = this;

                options = options || {};

                _setOptions(options, true);

                /**
                 * @method _setCapacity
                 * @desc Set the capacity for this cache.
                 * @param {Number} capacity
                 * @private
                 * @ignore
                 */
                function _setCapacity(capacity) {
                    var deferred = $q.defer();
                    _validateNumberOption(capacity).then(function (option, msg) {
                        config.capacity = option;
                        while (size > config.capacity) {
                            self.remove(staleEnd.key);
                        }
                        deferred.resolve(config.capacity, 'capacity set to ' + config.capacity);
                    }, function (option, msg) {
                        deferred.reject(option, 'capacity: ' + msg);
                    });
                    return deferred.promise;
                }

                /**
                 * @method _setMaxAge
                 * @desc Set the maxAge for this cache.
                 * @param {Number} maxAge
                 * @private
                 * @ignore
                 */
                function _setMaxAge(maxAge) {
                    var deferred = $q.defer(),
                        removeKey = function (key, self) {
                            self.remove(key);
                        };
                    if (maxAge == null) {
                        config.maxAge = maxAge;
                        deferred.resolve(config.maxAge, 'maxAge cleared');
                    } else {
                        _validateNumberOption(maxAge).then(function (option, msg) {
                            config.maxAge = option;
                            var keySet = _keySet(data);
                            for (var key in keySet) {
                                if (data[key].timeoutId && !data[key].maxAge) {
                                    $timeout.cancel(data[key].timeoutId);
                                    var timeRemaining = new Date().getTime() - data[key].timestamp;
                                    if (config.maxAge - timeRemaining > 0) {
                                        $log.debug(key + ' has ' + config.maxAge - timeRemaining + ' time remaining. Updating timeout...');
                                        // Update this item's timeout
                                        data[key].timeoutId = $timeout(removeKey, config.maxAge);
                                    } else {
                                        $log.debug(key + ' has expired. Removing...');
                                        // The new maxAge has cut this item's life short.
                                        // Immediately remove the item from the cache.
                                        self.remove(key);
                                    }
                                }
                            }
                            deferred.resolve(config.maxAge, 'maxAge set to ' + config.maxAge);
                        }, function (option, msg) {
                            deferred.reject(option, 'maxAge: ' + msg);
                        });
                    }
                    return deferred.promise;
                }

                /**
                 * @method _setCacheFlushInterval
                 * @desc Set the cacheFlushInterval for this cache.
                 * @param {Number} cacheFlushInterval
                 * @private
                 * @ignore
                 */
                function _setCacheFlushInterval(cacheFlushInterval) {
                    var deferred = $q.defer();
                    if (config.cacheFlushIntervalId) {
                        clearInterval(config.cacheFlushIntervalId);
                        config.cacheFlushIntervalId = null;
                    }
                    if (cacheFlushInterval == null) {
                        config.cacheFlushInterval = cacheFlushInterval;
                        deferred.resolve(config.cacheFlushInterval, 'cacheFlushInterval cleared');
                    } else {
                        _validateNumberOption(cacheFlushInterval).then(function (option, msg) {
                            config.cacheFlushInterval = cacheFlushInterval;
                            config.cacheFlushIntervalId = setInterval(function () {
                                var keySet = _keySet(data);
                                for (var key in keySet) {
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
                            deferred.resolve(config.cacheFlushInterval, 'cacheFlushInterval set to ' + config.cacheFlushInterval);
                        }, function (option, msg) {
                            deferred.reject(option, 'cacheFlushInterval: ' + msg);
                        });
                    }
                    return deferred.promise;
                }

                /**
                 * @method _validateNumberOption
                 * @desc Validates the given number option.
                 * @param {Number} option The number option to check.
                 * @param {String} name The name of this option (for logging).
                 * @ignore
                 * @private
                 */
                function _validateNumberOption(option) {
                    var deferred = $q.defer();
                    if (!angular.isNumber(option)) {
                        deferred.reject(option, 'must be a number!');
                    } else if (option < 0) {
                        deferred.reject(option, 'must be greater than zero!');
                    } else {
                        deferred.resolve(option);
                    }
                    return deferred.promise;
                }

                /**
                 * @method _setOptions
                 * @desc Configure this cache with the given options.
                 * @param options
                 * @param {Boolean} strict If true then any existing configuration will be reset to default before
                 * applying the new options, otherwise only the options specified in the hash will be altered.
                 * @param {Object} context
                 * @private
                 * @ignore
                 */
                function _setOptions(options, strict) {
                    strict = strict || false;
                    console.log('_setOptions', [options, strict]);

                    // setup capacity
                    if (options.capacity || strict) {
                        _setCapacity(options.capacity ? options.capacity : Number.MAX_VALUE).then(function (capacity) {
                            $log.debug('capacity set to ' + capacity);
                        }, function (capacity, msg) {
                            $log.error(arguments);
                        });
                    }

                    // setup maxAge
                    if (options.maxAge || strict) {
                        _setMaxAge(options.maxAge ? options.maxAge : null).then(function (maxAge) {
                            $log.debug('maxAge set to ' + maxAge);
                        }, function (maxAge, msg) {
                            $log.error(arguments);
                        });
                    }

                    // setup cacheFlushInterval
                    if (options.cacheFlushInterval || strict) {
                        _setCacheFlushInterval(options.cacheFlushInterval ? options.cacheFlushInterval : null).then(function (cacheFlushInterval) {
                            $log.debug('cacheFlushInterval set to ' + cacheFlushInterval);
                        }, function (cacheFlushInterval, msg) {
                            $log.error(arguments);
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
                            $timeout.cancel(data[key].timeoutId);
                        }
                        data[key].timeoutId = $timeout(function () {
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
                    return _keySet(data);
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
                    return _keys(data);
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
