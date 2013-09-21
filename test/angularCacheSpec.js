describe('AngularCache', function () {

    var $angularCacheFactory, $timeout;
    beforeEach(module('angular-cache'));
    beforeEach(inject(function ($injector) {
        $angularCacheFactory = $injector.get('$angularCacheFactory');
        $timeout = $injector.get('$timeout');
    }));

    it('should clear itself if cacheFlushInterval is specified', function () {
        var cache = $angularCacheFactory('cache', { cacheFlushInterval: 10 });
        cache.put('item1', 'value1');
        expect(cache.get('item1')).toEqual('value1');
        cache.put('item2', 'value2');
        expect(cache.get('item2')).toEqual('value2');
        waits(100);
        runs(function () {
            expect(cache.get('item1')).toEqual(undefined);
            expect(cache.get('item2')).toEqual(undefined);
            cache.destroy();
        });
    });
    describe('AngularCache.put(key, value, options)', function () {
        it('should disallow keys that aren\'t a string', function () {
            var cache = $angularCacheFactory('cache');
            var mustBeAStringMsg = 'AngularCache.put(): key: must be a string!';
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
        it('should not delete items if maxAge is specified and deleteOnExpire is set to "none"', function () {
            var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'none' });
            cache.put('item1', 'value1');
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                expect(cache.get('item1')).toEqual('value1');
                expect(cache.info('item1').isExpired).toEqual(true);
                cache.destroy();
            });
        });
        it('should set a timeout for an item to expire if maxAge is specified and deleteOnExpire is set to "aggressive"', function () {
            var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive' });
            cache.put('item1', 'value1');
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                $timeout.flush();
                // TODO: expect(cache.info('item1')).toEqual(undefined); because right now it returns the cache's info if the item isn't in the cache
                expect(cache.get('item1')).toEqual(undefined);
                cache.destroy();
            });
        });
        it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive"', function () {
            var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
            cache.put('item1', 'value1');
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                expect(cache.info('item1').isExpired).toEqual(true);
                expect(cache.get('item1')).toEqual(undefined);
                cache.destroy();
            });
        });
        it('should not delete items if maxAge is specified and deleteOnExpire is set to "none" for an item', function () {
            var cache = $angularCacheFactory('cache');
            cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'none' });
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                expect(cache.get('item1')).toEqual('value1');
                expect(cache.info('item1').isExpired).toEqual(true);
                cache.destroy();
            });
        });
        it('should set a timeout for an item to expire if maxAge for item is specified and deleteOnExpire is set to "aggressive"', function () {
            var cache = $angularCacheFactory('cache');
            cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'aggressive' });
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                $timeout.flush();
                // TODO: expect(cache.info('item1')).toEqual(undefined); because right now it returns the cache's info if the item isn't in the cache
                expect(cache.get('item1')).toEqual(undefined);
                cache.destroy();
            });
        });
        it('should passively expire an item if maxAge for the item is specified and deleteOnExpire is set to "passive"', function () {
            var cache = $angularCacheFactory('cache');
            cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'passive' });
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                expect(cache.info('item1').isExpired).toEqual(true);
                expect(cache.get('item1')).toEqual(undefined);
                cache.destroy();
            });
        });
        it('maxAge for a specific item should override maxAge for the cache', function () {
            var cache = $angularCacheFactory('cache', { maxAge: 1000, deleteOnExpire: 'aggressive' });
            cache.put('item1', 'value1', { maxAge: 5 });
            expect(cache.info('item1').maxAge).toEqual(5);
            expect(cache.get('item1')).toEqual('value1');
            waits(100);
            runs(function () {
                $timeout.flush();
                expect(cache.get('item1')).toEqual(undefined);
                cache.destroy();
            });
        });
        it('deleteOnExpire set to "passive" for a specific item should override deleteOnExpire set to "aggressive" for the cache', function () {
            var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive' });
            cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'passive' });
            expect(cache.get('item1')).toEqual('value1');
            expect(cache.info('item1').deleteOnExpire).toEqual("passive");
            waits(100);
            runs(function () {
                expect(cache.info('item1').isExpired).toEqual(true);
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
                maxAge: 10,
                onExpire: function (key, value, done) {
                    done(key, value, 'executed global callback');
                }
            });
            cache.put('item', 'value');
            waits(100);
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
                maxAge: 10,
                deleteOnExpire: 'aggressive',
                onExpire: onExpire
            });
            cache.put('item', 'value');
            waits(100);
            runs(function () {
                $timeout.flush();
                expect(onExpire).toHaveBeenCalled();
                expect(onExpire).toHaveBeenCalledWith('item', 'value');
                cache.destroy();
            });
        });
        it('should execute local \'onExpire\' callback if the item is expired in passive mode and global \'onExpire\' callback is NOT configured', function () {
            var cache = $angularCacheFactory('cache', {
                maxAge: 10
            });
            cache.put('item', 'value');
            waits(100);
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
            var onExpire = function () {
            };
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
                deleteOnExpire: 'none',
                storageMode: null
            });
            cache.put('item', 'value');
            cache.put('item2', 'value2', { maxAge: 200, deleteOnExpire: 'aggressive' });

            // AngularCache#info(key)
            expect(typeof cache.info('item').timestamp).toEqual('number');
            expect(cache.info('item').maxAge).toEqual(null);
            expect(cache.info('item').deleteOnExpire).toEqual('none');
            expect(typeof cache.info('item2').timestamp).toEqual('number');
            expect(cache.info('item2').maxAge).toEqual(200);
            expect(cache.info('item2').deleteOnExpire).toEqual('aggressive');

            expect(cache.info()).toEqual({
                id: 'cache',
                capacity: Number.MAX_VALUE,
                size: 2,
                maxAge: null,
                cacheFlushInterval: null,
                deleteOnExpire: 'none',
                storageMode: null
            });
            expect(cache2.info()).toEqual({
                id: 'cache2',
                capacity: Number.MAX_VALUE,
                maxAge: 1000,
                size: 0,
                cacheFlushInterval: null,
                deleteOnExpire: 'none',
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
                deleteOnExpire: 'none',
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
            var onExpire = function () {
            };
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
            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
            expect(cache.info().maxAge).toEqual(10);
            cache.put('item1', 1);
            cache.put('item2', 2);
            waits(100);
            runs(function () {
                $timeout.flush();
                expect(cache.get('item1')).not.toBeDefined();
                expect(cache.get('item2')).not.toBeDefined();
                cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
                expect(cache.info().maxAge).toEqual(10);
                cache.put('item1', 1);
                cache.put('item2', 2);
                waits(100);
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
            cache.setOptions({ cacheFlushInterval: 10 }, false);
            expect(cache.info().cacheFlushInterval).toEqual(10);
            cache.put('item1', 1);
            cache.put('item2', 2);
            waits(100);
            // The first items should be removed after 2000 ms
            runs(function () {
                expect(cache.get('item1')).not.toBeDefined();
                expect(cache.get('item2')).not.toBeDefined();
                cache.setOptions({ cacheFlushInterval: 10 }, false);
                expect(cache.info().cacheFlushInterval).toEqual(10);
                cache.put('item1', 1);
                cache.put('item2', 2);
                waits(100);
                // The new items should be removed after 500 ms (the new maxAge)
                runs(function () {
                    expect(cache.get('item1')).not.toBeDefined();
                    expect(cache.get('item2')).not.toBeDefined();
                    cache.destroy();
                });
            });
        });
        it('should correctly modify the deleteOnExpire of a cache', function () {
            var cache = $angularCacheFactory('cache', { maxAge: 10 });
            expect(cache.info().deleteOnExpire).toEqual('none');
            cache.setOptions({ deleteOnExpire: 'passive' }, false);
            expect(cache.info().deleteOnExpire).toEqual('passive');
            cache.put('item1', 1);
            cache.put('item2', 2);
            waits(100);
            // The first items should be removed after 2000 ms
            runs(function () {
                expect(cache.get('item1')).not.toBeDefined();
                expect(cache.get('item2')).not.toBeDefined();
                cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
                expect(cache.info().deleteOnExpire).toEqual('aggressive');
                cache.put('item1', 1);
                cache.put('item2', 2);
                waits(100);
                // The new items should be removed after 500 ms (the new maxAge)
                runs(function () {
                    $timeout.flush();
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
                deleteOnExpire: 'aggressive',
                storageMode: null
            });
            cache.setOptions({}, true);
            expect(cache.info()).toEqual({
                capacity: Number.MAX_VALUE,
                maxAge: null,
                cacheFlushInterval: null,
                id: 'cache',
                size: 0,
                deleteOnExpire: 'none',
                storageMode: null
            });
        });
        it('should correctly switch to using local/session storage when storageMode is activated', function () {
            var cache = $angularCacheFactory('cache'),
                cache2 = $angularCacheFactory('cache2');
            cache.put('item', 'value');
            cache2.put('item', 'value');
            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', storageMode: 'localStorage' });
            cache2.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', storageMode: 'sessionStorage' });

            if (localStorage) {
                expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
            }
            if (sessionStorage) {
                expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
            }
            waits(100);
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