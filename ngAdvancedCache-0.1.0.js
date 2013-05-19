/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file ngAdvancedCache.js
 * @version 0.1.0
 * @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/jmdobry/ngAdvancedCache>
 * @licence MIT <http://jmdobry.github.io/jmdobry/ngAdvancedCache>
 *
 * @overview ngAdvancedCache is a caching system that improves upon the capabilities of the
 * $cacheFactory provided by AngularJS.
 */
(function (window, angular, undefined) {
    'use strict';

    angular.module('ngAdvancedCache', []);

    function $AdvancedCacheFactoryProvider() {

        this.$get = function () {
            var caches = {};

            function AdvancedCache(cacheId, options) {
                var size = 0,
                    stats = angular.extend({}, options, {id: cacheId}),
                    data = {},
                    capacity = (options && options.capacity) || Number.MAX_VALUE,
                    maxAge = (options && options.maxAge) || null,
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null;

                function _isExpired(lruEntry) {
                    var entryMaxAge;

                    if ((lruEntry.maxAge || maxAge)) {
                        entryMaxAge = lruEntry.maxAge ? lruEntry.maxAge
                            : maxAge ? maxAge
                            : null;
                    }

                    if (entryMaxAge) {
                        return new Date().getTime() - lruEntry.timestamp > entryMaxAge;
                    }
                    return false;
                }

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

                this.put = function (key, value, options) {
                    var lruEntry = lruHash[key] || (lruHash[key] = {key: key});

                    _refresh(lruEntry);

                    if (angular.isUndefined(value)) {
                        return;
                    }
                    if (!(key in data)) {
                        size++;
                    }
                    data[key] = {
                        timestamp: new Date().getTime(),
                        maxAge: (options && options.maxAge) || null,
                        value: value
                    };

                    if (size > capacity) {
                        this.remove(staleEnd.key);
                    }

                    return value;
                };

                this.get = function (key) {
                    var lruEntry = lruHash[key];

                    if (!lruEntry) {
                        return;
                    }

                    if (_isExpired(data[key])) {
                        this.remove(key);
                        return;
                    }

                    _refresh(lruEntry);

                    return data[key].value;
                };

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

                this.removeAll = function () {
                    data = {};
                    size = 0;
                    lruHash = {};
                    freshEnd = staleEnd = null;
                };

                this.destroy = function () {
                    data = null;
                    stats = null;
                    lruHash = null;
                    delete caches[cacheId];
                };

                this.info = function () {
                    return angular.extend({}, stats, {size: size});
                };
            }

            function advancedCacheFactory(cacheId, options) {
                if (cacheId in caches) {
                    throw Error('cacheId ' + cacheId + ' taken');
                }

                caches[cacheId] = new AdvancedCache(cacheId, options);
                return caches[cacheId];
            }

            advancedCacheFactory.info = function () {
                var info = {};
                angular.forEach(caches, function (cache, cacheId) {
                    info[cacheId] = cache.info();
                });
                return info;
            };

            advancedCacheFactory.get = function (cacheId) {
                return caches[cacheId];
            };

            return advancedCacheFactory;
        };
    }

    angular.module('ngAdvancedCache').provider('$advancedCacheFactory', $AdvancedCacheFactoryProvider);
})(window, window.angular);
