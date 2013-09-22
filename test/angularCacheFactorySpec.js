describe('AngularCacheFactory', function () {

    var $angularCacheFactory, $timeout;
    beforeEach(module('jmdobry.angular-cache'));
    beforeEach(inject(function ($injector) {
        $angularCacheFactory = $injector.get('$angularCacheFactory');
        $timeout = $injector.get('$timeout');
    }));

    describe('$angularCacheFactory()', function () {
        it('should be able to create a default cache', function () {
            var cache = $angularCacheFactory('cache');
            expect(cache).toBeDefined();
            expect(cache.info().id).toEqual('cache');
            expect(cache.info().capacity).toEqual(Number.MAX_VALUE);
            expect(cache.info().maxAge).toEqual(null);
            expect(cache.info().cacheFlushInterval).toEqual(null);
            cache.destroy();
        });
        it('should be able to create a cache with options', function () {
            var options = {
                capacity: Math.floor((Math.random() * 100000) + 1),
                maxAge: Math.floor((Math.random() * 100000) + 1),
                cacheFlushInterval: Math.floor((Math.random() * 100000) + 1),
                deleteOnExpire: 'aggressive',
                storageMode: 'localStorage',
                localStorageImpl: {
                    setItem: function () {
                    },
                    getItem: function () {
                    },
                    removeItem: function () {
                    }
                },
                onExpire: function () {
                }
            };
            var cache = $angularCacheFactory('cache', options);
            expect(cache).toBeDefined();
            expect(cache.info().id).toEqual('cache');
            expect(cache.info().capacity).toEqual(options.capacity);
            expect(cache.info().maxAge).toEqual(options.maxAge);
            expect(cache.info().cacheFlushInterval).toEqual(options.cacheFlushInterval);
            expect(cache.info().deleteOnExpire).toEqual(options.deleteOnExpire);
            expect(cache.info().storageMode).toEqual(options.storageMode);
            expect(cache.info().localStorageImpl).not.toBeDefined(); // We don't expose this to the user
            expect(cache.info().onExpire).toEqual(options.onExpire);
            cache.destroy();
            expect($angularCacheFactory.get('cache')).not.toBeDefined();
        });
        it('should validate capacity', function () {
            var capacity = Math.floor((Math.random() * 100000) + 1) * -1;
            try {
                $angularCacheFactory('cache', { capacity: capacity });
            } catch (err) {
                var msg = err.message;
            }
            expect(msg).toEqual('capacity: must be greater than zero!');
            capacity = 'asdfasd';
            try {
                $angularCacheFactory('cache', { capacity: capacity });
            } catch (err) {
                msg = err.message;
            }
            expect(msg).toEqual('capacity: must be a number!');
        });
        it('should validate maxAge', function () {
            var maxAge = Math.floor((Math.random() * 100000) + 1) * -1;
            try {
                $angularCacheFactory('cache', { maxAge: maxAge });
            } catch (err) {
                var msg = err.message;
            }
            expect(msg).toEqual('maxAge: must be greater than zero!');
            maxAge = 'asdfasd';
            try {
                $angularCacheFactory('cache', { maxAge: maxAge });
            } catch (err) {
                msg = err.message;
            }
            expect(msg).toEqual('maxAge: must be a number!');
        });
        it('should validate cacheFlushInterval', function () {
            var cacheFlushInterval = Math.floor((Math.random() * 100000) + 1) * -1;
            try {
                $angularCacheFactory('cache', { cacheFlushInterval: cacheFlushInterval });
            } catch (err) {
                var msg = err.message;
            }
            expect(msg).toEqual('cacheFlushInterval: must be greater than zero!');
            cacheFlushInterval = 'asdfasd';
            try {
                $angularCacheFactory('cache', { cacheFlushInterval: cacheFlushInterval });
            } catch (err) {
                msg = err.message;
            }
            expect(msg).toEqual('cacheFlushInterval: must be a number!');
        });
        it('should prevent a cache from being duplicated', function () {
            try {
                $angularCacheFactory('cache');
                $angularCacheFactory('cache');
            } catch (err) {
                var msg = err.message;
            }
            expect(msg).toEqual('cacheId cache taken!');
        });
        it('should require cacheId to be a string', function () {
            var shouldBeAStringMsg = 'cacheId must be a string!';
            try {
                $angularCacheFactory(3);
            } catch (err) {
                var msg = err.message;
            }
            expect(msg).toEqual(shouldBeAStringMsg);
            try {
                $angularCacheFactory({obj: 'obj'});
            } catch (err) {
                msg = err.message;
            }
            expect(msg).toEqual(shouldBeAStringMsg);
            try {
                $angularCacheFactory(['obj']);
            } catch (err) {
                msg = err.message;
            }
            expect(msg).toEqual(shouldBeAStringMsg);
        });
        it('should load an existing cache from localStorage is storageMode was enabled', function () {
            if (localStorage) {
                localStorage.setItem('angular-cache.caches.lsCache.keys', angular.toJson(['lsItem1', 'lsItem2']));
                localStorage.setItem('angular-cache.caches.lsCache.data.lsItem1', angular.toJson({
                    value: 'value1',
                    timestamp: new Date().getTime()
                }));
                localStorage.setItem('angular-cache.caches.lsCache.data.lsItem2', angular.toJson({
                    value: 'value2',
                    timestamp: new Date().getTime(),
                    maxAge: 10000
                }));
                var lsCache = $angularCacheFactory('lsCache', { storageMode: 'localStorage', maxAge: 10, deleteOnExpire: 'aggressive' });
                expect(lsCache.get('lsItem1')).toEqual('value1');
                localStorage.removeItem('angular-cache.caches.lsCache.data.lsItem1');
                expect(localStorage.getItem('lsItem1')).toEqual(null);
                expect(lsCache.get('lsItem1')).toEqual('value1');
                expect(localStorage.getItem('lsItem1')).toBeDefined();
                expect(lsCache.get('lsItem2')).toEqual('value2');
                expect(lsCache.info('lsItem2').maxAge).toEqual(10000);
                waits(100);
                runs(function () {
                    $timeout.flush();
                    expect(lsCache.get('lsItem1')).toEqual(null);
                    expect(lsCache.get('lsItem2')).toEqual(null);
                    if (sessionStorage) {
                        sessionStorage.setItem('angular-cache.caches.ssCache.keys', angular.toJson(['ssItem1', 'ssItem2']));
                        sessionStorage.setItem('angular-cache.caches.ssCache.data.ssItem1', angular.toJson({
                            value: 'value1',
                            timestamp: new Date().getTime()
                        }));
                        sessionStorage.setItem('angular-cache.caches.ssCache.data.ssItem2', angular.toJson({
                            value: 'value2',
                            timestamp: new Date().getTime()
                        }));
                        var ssCache = $angularCacheFactory('ssCache', { storageMode: 'sessionStorage', maxAge: 10, deleteOnExpire: 'aggressive' });
                        expect(ssCache.get('ssItem1')).toEqual('value1');
                        expect(ssCache.get('ssItem2')).toEqual('value2');
                        waits(100);
                        runs(function () {
                            $timeout.flush();
                            expect(ssCache.get('ssItem1')).toEqual(null);
                            expect(ssCache.get('ssItem2')).toEqual(null);
                            lsCache.destroy();
                            ssCache.destroy();
                        });
                    }
                });
            }
        });
        it('should allow use of custom localStorage/sessionStorage implementations', function () {
            var myLocalStorage = {
                localData: {},
                setItem: function (key, value) {
                    this.localData[key] = value;
                },
                getItem: function (key) {
                    return this.localData[key];
                },
                removeItem: function (key) {
                    delete this.localData[key];
                }
            };
            var mySessionStorage = {
                localData: {},
                setItem: function (key, value) {
                    this.localData[key] = value;
                },
                getItem: function (key) {
                    return this.localData[key];
                },
                removeItem: function (key) {
                    delete this.localData[key];
                }
            };
            myLocalStorage.setItem('angular-cache.caches.lsCache.keys', angular.toJson(['item1', 'item2']));
            myLocalStorage.setItem('angular-cache.caches.lsCache.data.item1', angular.toJson({
                value: 'value1',
                timestamp: new Date().getTime()
            }));
            myLocalStorage.setItem('angular-cache.caches.lsCache.data.item2', angular.toJson({
                value: 'value2',
                timestamp: new Date().getTime()
            }));
            var lsCache = $angularCacheFactory('lsCache', { localStorageImpl: myLocalStorage, storageMode: 'localStorage', maxAge: 10, deleteOnExpire: 'aggressive' });
            expect(lsCache.get('item1')).toEqual('value1');
            expect(lsCache.get('item2')).toEqual('value2');
            waits(100);
            runs(function () {
                $timeout.flush();
                expect(lsCache.get('item1')).toEqual(null);
                expect(lsCache.get('item2')).toEqual(null);
                mySessionStorage.setItem('angular-cache.caches.ssCache.keys', angular.toJson(['item1', 'item2']));
                mySessionStorage.setItem('angular-cache.caches.ssCache.data.item1', angular.toJson({
                    value: 'value1',
                    timestamp: new Date().getTime()
                }));
                mySessionStorage.setItem('angular-cache.caches.ssCache.data.item2', angular.toJson({
                    value: 'value2',
                    timestamp: new Date().getTime()
                }));
                var ssCache = $angularCacheFactory('ssCache', { sessionStorageImpl: mySessionStorage, storageMode: 'sessionStorage', maxAge: 10, deleteOnExpire: 'aggressive' });
                expect(ssCache.get('item1')).toEqual('value1');
                expect(ssCache.get('item2')).toEqual('value2');
                waits(100);
                runs(function () {
                    $timeout.flush();
                    expect(ssCache.get('item1')).toEqual(null);
                    expect(ssCache.get('item2')).toEqual(null);
                    lsCache.destroy();
                    ssCache.destroy();
                });
            });
        });
    });
    describe('$angularCacheFactory.get(cachedId)', function () {
        it('should return the correct cache with the specified cacheId', function () {
            var cache = $angularCacheFactory('cache');
            expect($angularCacheFactory.get('cache')).toEqual(cache);
            cache.destroy();
        });
        it('should return \"undefined\" if the cache doesn\'t exist', function () {
            expect($angularCacheFactory.get('someNonExistentCache')).toEqual(undefined);
        });
    });
    describe('$angularCacheFactory.info()', function () {
        it('should return the correct info for each cache produced by the factory', function () {
            var options = {
                capacity: Math.floor((Math.random() * 100000) + 1),
                maxAge: Math.floor((Math.random() * 100000) + 1),
                cacheFlushInterval: Math.floor((Math.random() * 100000) + 1)
            };

            var cache = $angularCacheFactory('cache');
            var cache2 = $angularCacheFactory('cache2', {
                maxAge: options.maxAge
            });
            var cache3 = $angularCacheFactory('cache3', {
                capacity: options.capacity,
                cacheFlushInterval: options.cacheFlushInterval
            });
            var info = $angularCacheFactory.info();
            expect(info.size).toEqual(3);
            expect(info.caches.cache.id).toEqual('cache');
            expect(info.caches.cache.capacity).toEqual(Number.MAX_VALUE);
            expect(info.caches.cache.size).toEqual(0);

            expect(info.caches.cache2.id).toEqual('cache2');
            expect(info.caches.cache2.capacity).toEqual(Number.MAX_VALUE);
            expect(info.caches.cache2.size).toEqual(0);

            expect(info.caches.cache3.id).toEqual('cache3');
            expect(info.caches.cache3.cacheFlushInterval).toEqual(options.cacheFlushInterval);
            expect(info.caches.cache3.capacity).toEqual(options.capacity);
            expect(info.caches.cache3.size).toEqual(0);
            expect(info.caches.cache3.cacheFlushIntervalId).toBeDefined();
            cache.destroy();
            cache2.destroy();
            cache3.destroy();
        });
    });
    describe('$angularCacheFactory.keySet()', function () {
        it('should return the correct set of keys associated the caches currently owned by the factory', function () {
            var cacheKeys = ['cache', 'cache1', 'cache2'];

            $angularCacheFactory(cacheKeys[0]);
            $angularCacheFactory(cacheKeys[1]);
            $angularCacheFactory(cacheKeys[2]);

            var keySet = $angularCacheFactory.keySet();

            expect(keySet.hasOwnProperty(cacheKeys[0])).toEqual(true);
            expect(keySet.hasOwnProperty(cacheKeys[1])).toEqual(true);
            expect(keySet.hasOwnProperty(cacheKeys[2])).toEqual(true);

            expect(keySet[cacheKeys[0]]).toEqual(cacheKeys[0]);
            expect(keySet[cacheKeys[1]]).toEqual(cacheKeys[1]);
            expect(keySet[cacheKeys[2]]).toEqual(cacheKeys[2]);

            $angularCacheFactory.get(cacheKeys[0]).destroy();
            $angularCacheFactory.get(cacheKeys[1]).destroy();
            $angularCacheFactory.get(cacheKeys[2]).destroy();

            keySet = $angularCacheFactory.keySet();

            expect(keySet.hasOwnProperty(cacheKeys[0])).toEqual(false);
            expect(keySet.hasOwnProperty(cacheKeys[1])).toEqual(false);
            expect(keySet.hasOwnProperty(cacheKeys[2])).toEqual(false);
        });
    });
    describe('$angularCacheFactory.keys()', function () {
        it('should return the correct array of keys associated the caches currently owned by the factory', function () {
            var cacheKeys = ['cache', 'cache1', 'cache2'];

            $angularCacheFactory(cacheKeys[0]);
            $angularCacheFactory(cacheKeys[1]);
            $angularCacheFactory(cacheKeys[2]);

            var keys = $angularCacheFactory.keys();

            expect(keys[0]).toEqual(cacheKeys[0]);
            expect(keys[1]).toEqual(cacheKeys[1]);
            expect(keys[2]).toEqual(cacheKeys[2]);

            $angularCacheFactory.get(cacheKeys[0]).destroy();
            $angularCacheFactory.get(cacheKeys[1]).destroy();
            $angularCacheFactory.get(cacheKeys[2]).destroy();

            keys = $angularCacheFactory.keys();

            expect(keys.length).toEqual(0);
        });
    });
    describe('$angularCacheFactory.removeAll()', function () {
        it('should call "destroy()" on all caches currently owned by the factory', function () {
            var cacheKeys = ['cache', 'cache1', 'cache2'];

            $angularCacheFactory(cacheKeys[0]);
            $angularCacheFactory(cacheKeys[1]);
            $angularCacheFactory(cacheKeys[2]);

            $angularCacheFactory.removeAll();

            expect($angularCacheFactory.get(cacheKeys[0])).not.toBeDefined();
            expect($angularCacheFactory.get(cacheKeys[1])).not.toBeDefined();
            expect($angularCacheFactory.get(cacheKeys[2])).not.toBeDefined();
        });
    });
    describe('$angularCacheFactory.clearAll()', function () {
        it('should call "removeAll()" on all caches currently owned by the factory', function () {
            var cacheKeys = ['cache', 'cache1', 'cache2'];

            var cache = $angularCacheFactory(cacheKeys[0]);
            cache.put('item', 'value');
            var cache1 = $angularCacheFactory(cacheKeys[1]);
            cache1.put('item', 'value');
            var cache2 = $angularCacheFactory(cacheKeys[2]);
            cache2.put('item', 'value');

            $angularCacheFactory.clearAll();

            expect(cache.get('item')).not.toBeDefined();
            expect(cache1.get('item')).not.toBeDefined();
            expect(cache2.get('item')).not.toBeDefined();

            $angularCacheFactory.get(cacheKeys[0]).destroy();
            $angularCacheFactory.get(cacheKeys[1]).destroy();
            $angularCacheFactory.get(cacheKeys[2]).destroy();
        });
    });
});