describe('angular-cache', function () {

    var $angularCacheFactory, $timeout;
    beforeEach(module('angular-cache'));
    beforeEach(inject(function ($injector) {
        $angularCacheFactory = $injector.get('$angularCacheFactory');
        $timeout = $injector.get('$timeout');
    }));

    describe('$angularCacheFactory', function () {
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
                    aggressiveDelete: true,
                    storageMode: 'localStorage',
                    localStorageImpl: {
                        setItem: function () {},
                        getItem: function () {},
                        removeItem: function () {}
                    },
                    onExpire: function () {}
                };
                var cache = $angularCacheFactory('cache', options);
                expect(cache).toBeDefined();
                expect(cache.info().id).toEqual('cache');
                expect(cache.info().capacity).toEqual(options.capacity);
                expect(cache.info().maxAge).toEqual(options.maxAge);
                expect(cache.info().cacheFlushInterval).toEqual(options.cacheFlushInterval);
                expect(cache.info().aggressiveDelete).toEqual(options.aggressiveDelete);
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
                    localStorage.setItem('angular-cache.caches.lsCache.keys', angular.toJson(['item1', 'item2']));
                    localStorage.setItem('angular-cache.caches.lsCache.data.item1', angular.toJson({
                        value: 'value1',
                        timestamp: new Date().getTime()
                    }));
                    localStorage.setItem('angular-cache.caches.lsCache.data.item2', angular.toJson({
                        value: 'value2',
                        timestamp: new Date().getTime()
                    }));
                    var lsCache = $angularCacheFactory('lsCache', { storageMode: 'localStorage', maxAge: 300, aggressiveDelete: true });
                    expect(lsCache.get('item1')).toEqual('value1');
                    expect(lsCache.get('item2')).toEqual('value2');
                    waits(600);
                    runs(function () {
                        $timeout.flush();
                        expect(lsCache.get('item1')).toEqual(null);
                        expect(lsCache.get('item2')).toEqual(null);
                        if (sessionStorage) {
                            sessionStorage.setItem('angular-cache.caches.ssCache.keys', angular.toJson(['item1', 'item2']));
                            sessionStorage.setItem('angular-cache.caches.ssCache.data.item1', angular.toJson({
                                value: 'value1',
                                timestamp: new Date().getTime()
                            }));
                            sessionStorage.setItem('angular-cache.caches.ssCache.data.item2', angular.toJson({
                                value: 'value2',
                                timestamp: new Date().getTime()
                            }));
                            var ssCache = $angularCacheFactory('ssCache', { storageMode: 'sessionStorage', maxAge: 300, aggressiveDelete: true });
                            expect(ssCache.get('item1')).toEqual('value1');
                            expect(ssCache.get('item2')).toEqual('value2');
                            waits(600);
                            runs(function () {
                                $timeout.flush();
                                expect(ssCache.get('item1')).toEqual(null);
                                expect(ssCache.get('item2')).toEqual(null);
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
                var lsCache = $angularCacheFactory('lsCache', { localStorageImpl: myLocalStorage, storageMode: 'localStorage', maxAge: 300, aggressiveDelete: true });
                expect(lsCache.get('item1')).toEqual('value1');
                expect(lsCache.get('item2')).toEqual('value2');
                waits(600);
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
                    var ssCache = $angularCacheFactory('ssCache', { sessionStorageImpl: mySessionStorage, storageMode: 'sessionStorage', maxAge: 300, aggressiveDelete: true });
                    expect(ssCache.get('item1')).toEqual('value1');
                    expect(ssCache.get('item2')).toEqual('value2');
                    waits(600);
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
                expect(info.cache.id).toEqual('cache');
                expect(info.cache.capacity).toEqual(Number.MAX_VALUE);
                expect(info.cache.size).toEqual(0);

                expect(info.cache2.id).toEqual('cache2');
                expect(info.cache2.capacity).toEqual(Number.MAX_VALUE);
                expect(info.cache2.size).toEqual(0);

                expect(info.cache3.id).toEqual('cache3');
                expect(info.cache3.cacheFlushInterval).toEqual(options.cacheFlushInterval);
                expect(info.cache3.capacity).toEqual(options.capacity);
                expect(info.cache3.size).toEqual(0);
                expect(info.cache3.cacheFlushIntervalId).toBeDefined();
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

    describe('AngularCache', function () {
        it('should clear itself if cacheFlushInterval is specified', function () {
            var cache = $angularCacheFactory('cache', { cacheFlushInterval: 1000 });
            cache.put('item1', 'value1');
            expect(cache.get('item1')).toEqual('value1');
            cache.put('item2', 'value2');
            expect(cache.get('item2')).toEqual('value2');
            waits(1500);
            runs(function () {
                expect(cache.get('item1')).toEqual(undefined);
                expect(cache.get('item2')).toEqual(undefined);
                cache.destroy();
            });
        });
        describe('AngularCache.put(key, value, options)', function () {
            it('should disallow keys that aren\'t a string', function () {
                var cache = $angularCacheFactory('cache');
                var mustBeAStringMsg = 'The key must be a string!';
                try {
                    cache.put(2, 'value');
                } catch (err) {
                    var errorMsg = err.message;
                }
                expect(errorMsg).toEqual(mustBeAStringMsg);
                try {
                    cache.put(true, 'value');
                } catch (err) {
                    errorMsg = err.message;
                }
                expect(errorMsg).toEqual(mustBeAStringMsg);
                try {
                    cache.put({ obj: 'obj' }, 'value');
                } catch (err) {
                    errorMsg = err.message;
                }
                expect(errorMsg).toEqual(mustBeAStringMsg);
                cache.destroy();
            });
            it('should not add values that aren\'t defined', function () {
                var cache = $angularCacheFactory('cache');
                cache.put('item', null);
                expect(cache.get('item')).toEqual(undefined);
                cache.put('item', undefined);
                expect(cache.get('item')).toEqual(undefined);
                cache.destroy();
            });
            it('should validate maxAge', function () {
                var cache = $angularCacheFactory('cache');
                try {
                    cache.put('item', 'value', { maxAge: 'als;dlfkajsd'});
                } catch (err) {
                    var errorMsg = err.message;
                }
                expect(errorMsg).toEqual('AngularCache.put(): maxAge: must be a number!');
                try {
                    cache.put('item', 'value', { maxAge: Math.floor((Math.random() * 100000) + 1) * -1 });
                } catch (err) {
                    errorMsg = err.message;
                }
                expect(errorMsg).toEqual('AngularCache.put(): maxAge: must be greater than zero!');
                errorMsg = null;
                try {
                    cache.put('item', 'value', { maxAge: Math.floor((Math.random() * 100000) + 1) });
                } catch (err) {
                    errorMsg = 'should not reach this!';
                }
                expect(errorMsg).toEqual(null);
                cache.destroy();
            });
            it('should increase the size of the cache by one', function () {
                var cache = $angularCacheFactory('cache');
                expect(cache.info().size).toEqual(0);
                cache.put('item', 'value1');
                expect(cache.info().size).toEqual(1);
                cache.put('item2', 'value2');
                expect(cache.info().size).toEqual(2);
                cache.destroy();
            });
            it('should overwrite an item if it is re-added to the cache', function () {
                var cache = $angularCacheFactory('cache');
                expect(cache.info().size).toEqual(0);
                cache.put('item', 'value1');
                expect(cache.info().size).toEqual(1);
                cache.put('item', 'value2');
                expect(cache.info().size).toEqual(1);
                expect(cache.get('item')).toEqual('value2');
                cache.destroy();
            });
            it('should remove the least recently used item if the capacity has been reached', function () {
                var cache = $angularCacheFactory('cache', { capacity: 2 });
                expect(cache.info().size).toEqual(0);
                cache.put('item1', 'value1');
                expect(cache.info().size).toEqual(1);
                cache.put('item2', 'value2');
                expect(cache.info().size).toEqual(2);
                cache.put('item3', 'value3');
                expect(cache.info().size).toEqual(2);
                expect(cache.get('item1')).toEqual(undefined);
                expect(cache.get('item2')).toEqual('value2');
                expect(cache.get('item3')).toEqual('value3');
                cache.get('item2');
                cache.put('item1', 'value1');
                expect(cache.get('item3')).toEqual(undefined);
                expect(cache.get('item1')).toEqual('value1');
                expect(cache.get('item2')).toEqual('value2');
                cache.destroy();
            });
            it('should set a timeout for an item to expire if maxAge and aggressiveDelete for cache are specified', function () {
                var cache = $angularCacheFactory('cache', { maxAge: 1000, aggressiveDelete: true });
                cache.put('item1', 'value1');
                expect(cache.get('item1')).toEqual('value1');
                waits(1500);
                runs(function () {
                    $timeout.flush();
                    expect(cache.get('item1')).toEqual(undefined);
                    cache.destroy();
                });
            });
            it('should should lazy delete an item when maxAge is specified and aggressiveDelete is false for cache', function () {
                var cache = $angularCacheFactory('cache', { maxAge: 1000 });
                cache.put('item1', 'value1');
                expect(cache.get('item1')).toEqual('value1');
                waits(1500);
                runs(function () {
                    expect(cache.get('item1')).toEqual(undefined);
                    cache.destroy();
                });
            });
            it('should set a timeout for an item to expire if maxAge for item is specified and aggressiveDelete is true', function () {
                var cache = $angularCacheFactory('cache');
                cache.put('item1', 'value1', { maxAge: 1000, aggressiveDelete: true });
                expect(cache.get('item1')).toEqual('value1');
                waits(1500);
                runs(function () {
                    $timeout.flush();
                    expect(cache.get('item1')).toEqual(undefined);
                    cache.destroy();
                });
            });
            it('maxAge for a specific item should override maxAge for the cache', function () {
                var cache = $angularCacheFactory('cache', { maxAge: 3000, aggressiveDelete: true });
                cache.put('item1', 'value1', { maxAge: 1000 });
                expect(cache.get('item1')).toEqual('value1');
                waits(1500);
                runs(function () {
                    $timeout.flush();
                    expect(cache.get('item1')).toEqual(undefined);
                    cache.destroy();
                });
            });
            it('aggressiveDelete false for a specific item should override aggressiveDelete true for the cache', function () {
                var cache = $angularCacheFactory('cache', { maxAge: 1000, aggressiveDelete: true });
                cache.put('item1', 'value1', { maxAge: 1000, aggressiveDelete: false });
                expect(cache.get('item1')).toEqual('value1');
                waits(1500);
                runs(function () {
                    expect(cache.get('item1')).toEqual(undefined);
                    cache.destroy();
                });
            });
            it('should save data to localStorage when storageMode is used', function () {
                var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
                    sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

                localStorageCache.put('item1', 'value1');
                sessionStorageCache.put('item1', 'value1');

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1"]');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1"]');
                }

                localStorageCache.destroy();
                sessionStorageCache.destroy();
            });
        });
        describe('AngularCache.get(key)', function () {
            it('should return the correct value for the specified key', function () {
                var cache = $angularCacheFactory('cache');
                var value1 = 'value1',
                    value2 = 2,
                    value3 = {
                        value3: 'stuff'
                    };
                cache.put('item1', value1);
                cache.put('item2', value2);
                cache.put('item3', value3);
                expect(cache.get('item1')).toEqual(value1);
                expect(cache.get('item2')).toEqual(value2);
                expect(cache.get('item3')).toEqual(value3);
                cache.destroy();
            });
            it('should return undefined if the key isn\'t in the cache', function () {
                var cache = $angularCacheFactory('cache');
                expect(cache.get('item')).toEqual(undefined);
                cache.destroy();
            });
            it('should execute globally configured \'onExpire\' callback if the item is expired in passive mode and global \'onExpire\' callback is configured', function () {
                var cache = $angularCacheFactory('cache', {
                    maxAge: 300,
                    onExpire: function (key, value, done) {
                        done(key, value, 'executed global callback');
                    }
                });
                cache.put('item', 'value');
                waits(700);
                runs(function () {
                    cache.get('item', function (key, value, test) {
                        expect(key).toEqual('item');
                        expect(value).toEqual('value');
                        expect(test).toEqual('executed global callback');
                    });
                    cache.destroy();
                });
            });
            it('should execute globally configured \'onExpire\' callback when an item is aggressively deleted and global \'onExpire\' callback is configured', function () {
                var onExpire = jasmine.createSpy();
                var cache = $angularCacheFactory('cache', {
                    maxAge: 300,
                    aggressiveDelete: true,
                    onExpire: onExpire
                });
                cache.put('item', 'value');
                waits(700);
                runs(function () {
                    $timeout.flush();
                    expect(onExpire).toHaveBeenCalled();
                    expect(onExpire).toHaveBeenCalledWith('item', 'value');
                    cache.destroy();
                });
            });
            it('should execute local \'onExpire\' callback if the item is expired in passive mode and global \'onExpire\' callback is NOT configured', function () {
                var cache = $angularCacheFactory('cache', {
                    maxAge: 300
                });
                cache.put('item', 'value');
                waits(700);
                runs(function () {
                    cache.get('item', function (key, value) {
                        expect(key).toEqual('item');
                        expect(value).toEqual('value');
                    });
                    cache.destroy();
                });
            });
        });
        describe('AngularCache.remove(key)', function () {
            it('should remove the item with the specified key', function () {
                var cache = $angularCacheFactory('cache');
                var value1 = 'value1',
                    value2 = 2,
                    value3 = {
                        value3: 'stuff'
                    };
                cache.put('item1', value1);
                cache.put('item2', value2);
                cache.put('item3', value3);
                cache.remove('item1');
                expect(cache.get('item1')).toEqual(undefined);
                cache.remove('item2');
                expect(cache.get('item2')).toEqual(undefined);
                cache.remove('item3');
                expect(cache.get('item3')).toEqual(undefined);
                cache.destroy();
            });
            it('should reduce the size of the cache by one if the size is greater than zero', function () {
                var cache = $angularCacheFactory('cache');
                cache.put('item1', 'value1');
                expect(cache.info().size).toEqual(1);
                cache.put('item2', 'value2');
                expect(cache.info().size).toEqual(2);
                cache.remove('item1');
                expect(cache.info().size).toEqual(1);
                cache.remove('item2');
                expect(cache.info().size).toEqual(0);
                cache.remove('item1');
                expect(cache.info().size).toEqual(0);
                cache.remove('item2');
                expect(cache.info().size).toEqual(0);
                cache.destroy();
            });
            it('should remove items from localStorage when storageMode is used', function () {
                var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
                    sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

                localStorageCache.put('item1', 'value1');
                sessionStorageCache.put('item1', 'value1');

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1"]');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1"]');
                }

                localStorageCache.remove('item1');
                sessionStorageCache.remove('item1');

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1'))).toEqual(null);
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('[]');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1'))).toEqual(null);
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('[]');
                }

                localStorageCache.destroy();
                sessionStorageCache.destroy();
            });
        });
        describe('AngularCache.removeAll()', function () {
            it('should remove all items in the cache', function () {
                var cache = $angularCacheFactory('cache');
                var value1 = 'value1',
                    value2 = 2,
                    value3 = {
                        value3: 'stuff'
                    };
                cache.put('item1', value1);
                cache.put('item2', value2);
                cache.put('item3', value3);
                cache.removeAll();
                expect(cache.get('item1')).toEqual(undefined);
                expect(cache.get('item2')).toEqual(undefined);
                expect(cache.get('item3')).toEqual(undefined);
                cache.destroy();
            });
            it('should remove items from localStorage when storageMode is used', function () {
                var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
                    sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

                localStorageCache.put('item1', 'value1');
                sessionStorageCache.put('item1', 'value1');
                localStorageCache.put('item2', 'value2');
                sessionStorageCache.put('item2', 'value2');

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2')).value).toEqual('value2');
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1","item2"]');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2')).value).toEqual('value2');
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1","item2"]');
                }

                localStorageCache.removeAll();
                sessionStorageCache.removeAll();

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1'))).toEqual(null);
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2'))).toEqual(null);
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('[]');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1'))).toEqual(null);
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2'))).toEqual(null);
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('[]');
                }

                localStorageCache.destroy();
                sessionStorageCache.destroy();
            });
        });
        describe('AngularCache.destroy()', function () {
            it('should completely destroy the cache', function () {
                var cache = $angularCacheFactory('cache');
                cache.destroy();
                expect($angularCacheFactory.get('cache')).toEqual(undefined);
            });
            it('should remove items from localStorage when storageMode is used', function () {
                var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
                    sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

                localStorageCache.put('item1', 'value1');
                sessionStorageCache.put('item1', 'value1');
                localStorageCache.put('item2', 'value2');
                sessionStorageCache.put('item2', 'value2');

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2')).value).toEqual('value2');
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1","item2"]');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2')).value).toEqual('value2');
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1","item2"]');
                }

                localStorageCache.destroy();
                sessionStorageCache.destroy();

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1'))).toEqual(null);
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2'))).toEqual(null);
                    expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual(null);
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1'))).toEqual(null);
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2'))).toEqual(null);
                    expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual(null);
                }
            });
        });
        describe('AngularCache.info()', function () {
            it('should return the correct values', function () {
                var onExpire = function () {};
                var cache = $angularCacheFactory('cache'),
                    cache2 = $angularCacheFactory('cache2', { maxAge: 1000 }),
                    cache3 = $angularCacheFactory('cache3', { cacheFlushInterval: 1000 }),
                    cache4 = $angularCacheFactory('cache4', { capacity: 1000 }),
                    cache5 = $angularCacheFactory('cache5', { storageMode: 'localStorage' }),
                    cache6 = $angularCacheFactory('cache6', { storageMode: 'sessionStorage' });
                    cache7 = $angularCacheFactory('cache7', { maxAge: 100, onExpire: onExpire });
                expect(cache.info()).toEqual({
                    id: 'cache',
                    capacity: Number.MAX_VALUE,
                    size: 0,
                    maxAge: null,
                    cacheFlushInterval: null,
                    aggressiveDelete: false,
                    storageMode: null
                });
                cache.put('item', 'value');
                expect(cache.info()).toEqual({
                    id: 'cache',
                    capacity: Number.MAX_VALUE,
                    size: 1,
                    maxAge: null,
                    cacheFlushInterval: null,
                    aggressiveDelete: false,
                    storageMode: null
                });
                expect(cache2.info()).toEqual({
                    id: 'cache2',
                    capacity: Number.MAX_VALUE,
                    maxAge: 1000,
                    size: 0,
                    cacheFlushInterval: null,
                    aggressiveDelete: false,
                    storageMode: null
                });
                expect(cache3.info().id).toEqual('cache3');
                expect(cache3.info().capacity).toEqual(Number.MAX_VALUE);
                expect(cache3.info().cacheFlushInterval).toEqual(1000);
                expect(cache3.info().size).toEqual(0);
                expect(cache4.info()).toEqual({
                    id: 'cache4',
                    capacity: 1000,
                    size: 0,
                    maxAge: null,
                    cacheFlushInterval: null,
                    aggressiveDelete: false,
                    storageMode: null
                });
                if (localStorage) {
                    expect(cache5.info().storageMode).toEqual('localStorage');
                } else {
                    expect(cache5.info().storageMode).toEqual(null);
                }
                if (sessionStorage) {
                    expect(cache6.info().storageMode).toEqual('sessionStorage');
                } else {
                    expect(cache6.info().storageMode).toEqual(null);
                }
                expect(cache7.info().onExpire).toEqual(onExpire);
                cache.destroy();
                cache2.destroy();
                cache3.destroy();
                cache4.destroy();
                cache5.destroy();
                cache6.destroy();
                cache7.destroy();
            });
        });
        describe('AngularCache.keySet()', function () {
            it('should return the correct set of keys of all items currently in a cache', function () {
                var itemKeys = ['item1', 'item2', 'item3'];

                var cache = $angularCacheFactory('cache');

                cache.put(itemKeys[0], itemKeys[0]);
                cache.put(itemKeys[1], itemKeys[1]);
                cache.put(itemKeys[2], itemKeys[2]);

                var keySet = cache.keySet();

                expect(keySet.hasOwnProperty(itemKeys[0])).toEqual(true);
                expect(keySet.hasOwnProperty(itemKeys[1])).toEqual(true);
                expect(keySet.hasOwnProperty(itemKeys[2])).toEqual(true);

                expect(keySet[itemKeys[0]]).toEqual(itemKeys[0]);
                expect(keySet[itemKeys[1]]).toEqual(itemKeys[1]);
                expect(keySet[itemKeys[2]]).toEqual(itemKeys[2]);

                cache.remove(itemKeys[0]);
                cache.remove(itemKeys[1]);
                cache.remove(itemKeys[2]);

                keySet = cache.keySet();

                expect(keySet.hasOwnProperty(itemKeys[0])).toEqual(false);
                expect(keySet.hasOwnProperty(itemKeys[1])).toEqual(false);
                expect(keySet.hasOwnProperty(itemKeys[2])).toEqual(false);
                cache.destroy();
            });
        });
        describe('AngularCache.keys()', function () {
            it('should return the correct array of keys of all items currently in a cache', function () {
                var itemKeys = ['item1', 'item2', 'item3'];

                var cache = $angularCacheFactory('cache');

                cache.put(itemKeys[0], itemKeys[0]);
                cache.put(itemKeys[1], itemKeys[1]);
                cache.put(itemKeys[2], itemKeys[2]);

                var keys = cache.keys();

                expect(keys[0]).toEqual(itemKeys[0]);
                expect(keys[1]).toEqual(itemKeys[1]);
                expect(keys[2]).toEqual(itemKeys[2]);

                cache.remove(itemKeys[0]);
                cache.remove(itemKeys[1]);
                cache.remove(itemKeys[2]);

                keys = cache.keys();

                expect(keys.length).toEqual(0);
                cache.destroy();
            });
        });
        describe('AngularCache.setOptions()', function () {
            it('should correctly reset to defaults if strict mode is true', function () {
                var onExpire = function () {};
                var cache = $angularCacheFactory('cache', {
                    maxAge: 100,
                    cacheFlushInterval: 200,
                    onExpire: onExpire,
                    storageMode: 'localStorage'
                });
                expect(cache.info().maxAge).toEqual(100);
                expect(cache.info().cacheFlushInterval).toEqual(200);
                expect(cache.info().onExpire).toEqual(onExpire);
                expect(cache.info().storageMode).toEqual('localStorage');
                cache.setOptions({ }, true);
                expect(cache.info().maxAge).toEqual(null);
                expect(cache.info().cacheFlushInterval).toEqual(null);
                expect(cache.info().onExpire).toEqual(null);
                expect(cache.info().storageMode).toEqual(null);
                cache.destroy();
            });
            it('should correctly modify the capacity of a cache', function () {
                var cache = $angularCacheFactory('cache');
                expect(cache.info().capacity).toEqual(Number.MAX_VALUE);
                cache.setOptions({ capacity: 5 }, false);
                expect(cache.info().capacity).toEqual(5);
                cache.put('item1', 1);
                cache.put('item2', 2);
                cache.put('item3', 3);
                cache.put('item4', 4);
                cache.put('item5', 5);
                cache.put('item6', 6);
                expect(cache.get('item1')).not.toBeDefined();
                cache.setOptions({ capacity: 3 }, false);
                // Least-recently used items over the new capacity should have been removed.
                expect(cache.get('item2')).not.toBeDefined();
                expect(cache.get('item3')).not.toBeDefined();
                expect(cache.info().size).toEqual(3);
                cache.destroy();
            });
            it('should correctly modify the maxAge of a cache', function () {
                var cache = $angularCacheFactory('cache');
                expect(cache.info().maxAge).toEqual(null);
                cache.setOptions({ maxAge: 2000, aggressiveDelete: true }, false);
                expect(cache.info().maxAge).toEqual(2000);
                cache.put('item1', 1);
                cache.put('item2', 2);
                waits(2200);
                // The first items should be removed after 2000 ms
                runs(function () {
                    $timeout.flush();
                    expect(cache.get('item1')).not.toBeDefined();
                    expect(cache.get('item2')).not.toBeDefined();
                    cache.setOptions({ maxAge: 500, aggressiveDelete: true }, false);
                    expect(cache.info().maxAge).toEqual(500);
                    cache.put('item1', 1);
                    cache.put('item2', 2);
                    waits(700);
                    // The new items should be removed after 500 ms (the new maxAge)
                    runs(function () {
                        $timeout.flush();
                        expect(cache.get('item1')).not.toBeDefined();
                        expect(cache.get('item2')).not.toBeDefined();
                        cache.destroy();
                    });
                });
            });
            it('should correctly modify the cacheFlushInterval of a cache', function () {
                var cache = $angularCacheFactory('cache');
                expect(cache.info().cacheFlushInterval).toEqual(null);
                cache.setOptions({ cacheFlushInterval: 2000 }, false);
                expect(cache.info().cacheFlushInterval).toEqual(2000);
                cache.put('item1', 1);
                cache.put('item2', 2);
                waits(2200);
                // The first items should be removed after 2000 ms
                runs(function () {
                    expect(cache.get('item1')).not.toBeDefined();
                    expect(cache.get('item2')).not.toBeDefined();
                    cache.setOptions({ cacheFlushInterval: 500 }, false);
                    expect(cache.info().cacheFlushInterval).toEqual(500);
                    cache.put('item1', 1);
                    cache.put('item2', 2);
                    waits(700);
                    // The new items should be removed after 500 ms (the new maxAge)
                    runs(function () {
                        expect(cache.get('item1')).not.toBeDefined();
                        expect(cache.get('item2')).not.toBeDefined();
                        cache.destroy();
                    });
                });
            });
            it('should correctly modify the aggressiveDelete of a cache', function () {
                var cache = $angularCacheFactory('cache', { maxAge: 2000 });
                expect(cache.info().aggressiveDelete).toEqual(false);
                cache.setOptions({ aggressiveDelete: true }, false);
                expect(cache.info().aggressiveDelete).toEqual(true);
                cache.put('item1', 1);
                cache.put('item2', 2);
                waits(2500);
                // The first items should be removed after 2000 ms
                runs(function () {
                    $timeout.flush();
                    expect(cache.get('item1')).not.toBeDefined();
                    expect(cache.get('item2')).not.toBeDefined();
                    cache.setOptions({ maxAge: 500, aggressiveDelete: false }, false);
                    expect(cache.info().aggressiveDelete).toEqual(false);
                    cache.put('item1', 1);
                    cache.put('item2', 2);
                    waits(700);
                    // The new items should be removed after 500 ms (the new maxAge)
                    runs(function () {
                        expect(cache.get('item1')).not.toBeDefined();
                        expect(cache.get('item2')).not.toBeDefined();
                        cache.destroy();
                    });
                });
            });
            it('should correctly set configuration to default when \'strict\' is true', function () {
                var cache = $angularCacheFactory('cache', {
                    capacity: 10,
                    maxAge: 1000,
                    cacheFlushInterval: 1000,
                    aggressiveDelete: true,
                    storageMode: null
                });
                cache.setOptions({}, true);
                expect(cache.info()).toEqual({
                    capacity: Number.MAX_VALUE,
                    maxAge: null,
                    cacheFlushInterval: null,
                    id: 'cache',
                    size: 0,
                    aggressiveDelete: false,
                    storageMode: null
                });
            });
            it('should correctly switch to using local/session storage when storageMode is activated', function () {
                var cache = $angularCacheFactory('cache'),
                    cache2 = $angularCacheFactory('cache2');
                cache.put('item', 'value');
                cache2.put('item', 'value');
                cache.setOptions({ maxAge: 300, aggressiveDelete: true, storageMode: 'localStorage' });
                cache2.setOptions({ maxAge: 300, aggressiveDelete: true, storageMode: 'sessionStorage' });

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
                }
                waits(600);
                runs(function () {
                    $timeout.flush();
                    expect(cache.get('item')).toEqual(null);
                    expect(cache2.get('item')).toEqual(null);
                    if (localStorage) {
                        expect(localStorage.getItem('angular-cache.caches.cache.data.item')).toEqual(null);
                    }
                    if (sessionStorage) {
                        expect(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).toEqual(null);
                    }
                    cache.destroy();
                    cache2.destroy();
                });
            });
            it('should correctly stop using local/session storage when storageMode is deactivated', function () {
                var cache = $angularCacheFactory('cache', { storageMode: 'localStorage' }),
                    cache2 = $angularCacheFactory('cache2', { storageMode: 'sessionStorage' });
                cache.put('item', 'value');
                cache2.put('item', 'value');

                if (localStorage) {
                    expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
                }
                if (sessionStorage) {
                    expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
                }

                cache.setOptions({ storageMode: null }, true);
                cache2.setOptions({ storageMode: null }, true);

                if (localStorage) {
                    expect(localStorage.getItem('angular-cache.caches.cache.data.item')).toEqual(null);
                }
                if (sessionStorage) {
                    expect(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).toEqual(null);
                }

                cache.destroy();
                cache2.destroy();
            });
        });
    });
});