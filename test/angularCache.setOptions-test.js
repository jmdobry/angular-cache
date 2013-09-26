//describe('AngularCache.setOptions()', function () {
//    it('should correctly reset to defaults if strict mode is true', function () {
//        var onExpire = function () {
//        };
//        var cache = $angularCacheFactory('cache', {
//            maxAge: 100,
//            cacheFlushInterval: 200,
//            onExpire: onExpire,
//            storageMode: 'localStorage'
//        });
//        expect(cache.info().maxAge).toEqual(100);
//        expect(cache.info().cacheFlushInterval).toEqual(200);
//        expect(cache.info().onExpire).toEqual(onExpire);
//        expect(cache.info().storageMode).toEqual('localStorage');
//        cache.setOptions({ }, true);
//        expect(cache.info().maxAge).toEqual(null);
//        expect(cache.info().cacheFlushInterval).toEqual(null);
//        expect(cache.info().onExpire).toEqual(null);
//        expect(cache.info().storageMode).toEqual('none');
//    });
//    it('should correctly modify the capacity of a cache', function () {
//        var cache = $angularCacheFactory('cache');
//        expect(cache.info().capacity).toEqual(Number.MAX_VALUE);
//        cache.setOptions({ capacity: 5 }, false);
//        expect(cache.info().capacity).toEqual(5);
//        cache.put('item1', 1);
//        cache.put('item2', 2);
//        cache.put('item3', 3);
//        cache.put('item4', 4);
//        cache.put('item5', 5);
//        cache.put('item6', 6);
//        expect(cache.get('item1')).not.toBeDefined();
//        cache.setOptions({ capacity: 3 }, false);
//        // Least-recently used items over the new capacity should have been removed.
//        expect(cache.get('item2')).not.toBeDefined();
//        expect(cache.get('item3')).not.toBeDefined();
//        expect(cache.info().size).toEqual(3);
//    });
//    it('should correctly modify the maxAge of a cache', function () {
//        var cache = $angularCacheFactory('cache');
//        expect(cache.info().maxAge).toEqual(null);
//        cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
//        expect(cache.info().maxAge).toEqual(10);
//        cache.put('item1', 1);
//        cache.put('item2', 2);
//        waits(100);
//        runs(function () {
//            $timeout.flush();
//            expect(cache.get('item1')).not.toBeDefined();
//            expect(cache.get('item2')).not.toBeDefined();
//            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
//            expect(cache.info().maxAge).toEqual(10);
//            cache.put('item1', 1);
//            cache.put('item2', 2);
//            waits(100);
//            // The new items should be removed after 500 ms (the new maxAge)
//            runs(function () {
//                $timeout.flush();
//                expect(cache.get('item1')).not.toBeDefined();
//                expect(cache.get('item2')).not.toBeDefined();
//            });
//        });
//    });
//    it('should correctly modify the cacheFlushInterval of a cache', function () {
//        var cache = $angularCacheFactory('cache');
//        expect(cache.info().cacheFlushInterval).toEqual(null);
//        cache.setOptions({ cacheFlushInterval: 10 }, false);
//        expect(cache.info().cacheFlushInterval).toEqual(10);
//        cache.put('item1', 1);
//        cache.put('item2', 2);
//        waits(100);
//        // The first items should be removed after 2000 ms
//        runs(function () {
//            expect(cache.get('item1')).not.toBeDefined();
//            expect(cache.get('item2')).not.toBeDefined();
//            cache.setOptions({ cacheFlushInterval: 10 }, false);
//            expect(cache.info().cacheFlushInterval).toEqual(10);
//            cache.put('item1', 1);
//            cache.put('item2', 2);
//            waits(100);
//            // The new items should be removed after 500 ms (the new maxAge)
//            runs(function () {
//                expect(cache.get('item1')).not.toBeDefined();
//                expect(cache.get('item2')).not.toBeDefined();
//            });
//        });
//    });
//    it('should correctly modify the deleteOnExpire of a cache', function () {
//        var cache = $angularCacheFactory('cache', { maxAge: 10 });
//        expect(cache.info().deleteOnExpire).toEqual('none');
//        cache.setOptions({ deleteOnExpire: 'passive' }, false);
//        expect(cache.info().deleteOnExpire).toEqual('passive');
//        cache.put('item1', 1);
//        cache.put('item2', 2);
//        waits(100);
//        // The first items should be removed after 2000 ms
//        runs(function () {
//            expect(cache.get('item1')).not.toBeDefined();
//            expect(cache.get('item2')).not.toBeDefined();
//            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
//            expect(cache.info().deleteOnExpire).toEqual('aggressive');
//            cache.put('item1', 1);
//            cache.put('item2', 2);
//            waits(100);
//            // The new items should be removed after 500 ms (the new maxAge)
//            runs(function () {
//                $timeout.flush();
//                expect(cache.get('item1')).not.toBeDefined();
//                expect(cache.get('item2')).not.toBeDefined();
//            });
//        });
//    });
//    it('should correctly set configuration to default when \'strict\' is true', function () {
//        var cache = $angularCacheFactory('cache', {
//            capacity: 10,
//            maxAge: 1000,
//            cacheFlushInterval: 1000,
//            deleteOnExpire: 'aggressive',
//            storageMode: 'none'
//        });
//        cache.setOptions({}, true);
//        expect(cache.info()).toEqual({
//            capacity: Number.MAX_VALUE,
//            maxAge: null,
//            cacheFlushInterval: null,
//            id: 'cache',
//            size: 0,
//            deleteOnExpire: 'none',
//            storageMode: 'none',
//            onExpire: null
//        });
//    });
//    it('should correctly switch to using local/session storage when storageMode is activated', function () {
//        var cache = $angularCacheFactory('cache'),
//            cache2 = $angularCacheFactory('cache2');
//        cache.put('item', 'value');
//        cache2.put('item', 'value');
//        cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', storageMode: 'localStorage' });
//        cache2.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', storageMode: 'sessionStorage' });
//
//        if (localStorage) {
//            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
//        }
//        if (sessionStorage) {
//            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
//        }
//        waits(100);
//        runs(function () {
//            $timeout.flush();
//            expect(cache.get('item')).toEqual(null);
//            expect(cache2.get('item')).toEqual(null);
//            if (localStorage) {
//                expect(localStorage.getItem('angular-cache.caches.cache.data.item')).toEqual(null);
//            }
//            if (sessionStorage) {
//                expect(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).toEqual(null);
//            }
//        });
//    });
//    it('should correctly stop using local/session storage when storageMode is deactivated', function () {
//        var cache = $angularCacheFactory('cache', { storageMode: 'localStorage' }),
//            cache2 = $angularCacheFactory('cache2', { storageMode: 'sessionStorage' });
//        cache.put('item', 'value');
//        cache2.put('item', 'value');
//
//        if (localStorage) {
//            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
//        }
//        if (sessionStorage) {
//            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
//        }
//
//        cache.setOptions({ storageMode: 'none' }, true);
//        cache2.setOptions({ storageMode: 'none' }, true);
//
//        if (localStorage) {
//            expect(localStorage.getItem('angular-cache.caches.cache.data.item')).toEqual(null);
//        }
//        if (sessionStorage) {
//            expect(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).toEqual(null);
//        }
//    });
//});