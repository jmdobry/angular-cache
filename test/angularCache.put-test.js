//describe('AngularCache.put(key, value, options)', function () {
//    it('should disallow keys that aren\'t a string', function () {
//        var cache = $angularCacheFactory('cache');
//        var mustBeAStringMsg = 'AngularCache.put(): key: must be a string!';
//        try {
//            cache.put(2, 'value');
//        } catch (err) {
//            var errorMsg = err.message;
//        }
//        expect(errorMsg).toEqual(mustBeAStringMsg);
//        try {
//            cache.put(true, 'value');
//        } catch (err) {
//            errorMsg = err.message;
//        }
//        expect(errorMsg).toEqual(mustBeAStringMsg);
//        try {
//            cache.put({ obj: 'obj' }, 'value');
//        } catch (err) {
//            errorMsg = err.message;
//        }
//        expect(errorMsg).toEqual(mustBeAStringMsg);
//    });
//    it('should not add values that aren\'t defined', function () {
//        var cache = $angularCacheFactory('cache');
//        cache.put('item', null);
//        expect(cache.get('item')).toEqual(undefined);
//        cache.put('item', undefined);
//        expect(cache.get('item')).toEqual(undefined);
//    });
//    it('should validate maxAge', function () {
//        var cache = $angularCacheFactory('cache');
//        try {
//            cache.put('item', 'value', { maxAge: 'als;dlfkajsd'});
//        } catch (err) {
//            var errorMsg = err.message;
//        }
//        expect(errorMsg).toEqual('AngularCache.put(): maxAge: must be a number!');
//        try {
//            cache.put('item', 'value', { maxAge: Math.floor((Math.random() * 100000) + 1) * -1 });
//        } catch (err) {
//            errorMsg = err.message;
//        }
//        expect(errorMsg).toEqual('AngularCache.put(): maxAge: must be greater than zero!');
//        errorMsg = null;
//        try {
//            cache.put('item', 'value', { maxAge: Math.floor((Math.random() * 100000) + 1) });
//        } catch (err) {
//            errorMsg = 'should not reach this!';
//        }
//        expect(errorMsg).toEqual(null);
//    });
//    it('should increase the size of the cache by one', function () {
//        var cache = $angularCacheFactory('cache');
//        expect(cache.info().size).toEqual(0);
//        cache.put('item', 'value1');
//        expect(cache.info().size).toEqual(1);
//        cache.put('item2', 'value2');
//        expect(cache.info().size).toEqual(2);
//    });
//    it('should overwrite an item if it is re-added to the cache', function () {
//        var cache = $angularCacheFactory('cache');
//        expect(cache.info().size).toEqual(0);
//        cache.put('item', 'value1');
//        expect(cache.info().size).toEqual(1);
//        cache.put('item', 'value2');
//        expect(cache.info().size).toEqual(1);
//        expect(cache.get('item')).toEqual('value2');
//    });
//    it('should remove the least recently used item if the capacity has been reached', function () {
//        var cache = $angularCacheFactory('cache', { capacity: 2 });
//        expect(cache.info().size).toEqual(0);
//        cache.put('item1', 'value1');
//        expect(cache.info().size).toEqual(1);
//        cache.put('item2', 'value2');
//        expect(cache.info().size).toEqual(2);
//        cache.put('item3', 'value3');
//        expect(cache.info().size).toEqual(2);
//        expect(cache.get('item1')).toEqual(undefined);
//        expect(cache.get('item2')).toEqual('value2');
//        expect(cache.get('item3')).toEqual('value3');
//        cache.get('item2');
//        cache.put('item1', 'value1');
//        expect(cache.get('item3')).toEqual(undefined);
//        expect(cache.get('item1')).toEqual('value1');
//        expect(cache.get('item2')).toEqual('value2');
//    });
//    it('should not delete items if maxAge is specified and deleteOnExpire is set to "none"', function () {
//        var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'none' });
//        cache.put('item1', 'value1');
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            expect(cache.get('item1')).toEqual('value1');
//            expect(cache.info('item1').isExpired).toEqual(true);
//        });
//    });
//    it('should set a timeout for an item to expire if maxAge is specified and deleteOnExpire is set to "aggressive"', function () {
//        var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive' });
//        cache.put('item1', 'value1');
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            $timeout.flush();
//            expect(cache.info('item1')).toEqual(undefined);
//            expect(cache.get('item1')).toEqual(undefined);
//        });
//    });
//    it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive"', function () {
//        var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
//        cache.put('item1', 'value1');
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            expect(cache.info('item1').isExpired).toEqual(true);
//            expect(cache.get('item1')).toEqual(undefined);
//        });
//    });
//    it('should not delete items if maxAge is specified and deleteOnExpire is set to "none" for an item', function () {
//        var cache = $angularCacheFactory('cache');
//        cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'none' });
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            expect(cache.get('item1')).toEqual('value1');
//            expect(cache.info('item1').isExpired).toEqual(true);
//        });
//    });
//    it('should set a timeout for an item to expire if maxAge for item is specified and deleteOnExpire is set to "aggressive"', function () {
//        var cache = $angularCacheFactory('cache');
//        cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'aggressive' });
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            $timeout.flush();
//            expect(cache.info('item1')).toEqual(undefined);
//            expect(cache.get('item1')).toEqual(undefined);
//        });
//    });
//    it('should passively expire an item if maxAge for the item is specified and deleteOnExpire is set to "passive"', function () {
//        var cache = $angularCacheFactory('cache');
//        cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'passive' });
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            expect(cache.info('item1').isExpired).toEqual(true);
//            expect(cache.get('item1')).toEqual(undefined);
//        });
//    });
//    it('maxAge for a specific item should override maxAge for the cache', function () {
//        var cache = $angularCacheFactory('cache', { maxAge: 1000, deleteOnExpire: 'aggressive' });
//        cache.put('item1', 'value1', { maxAge: 5 });
//        expect(cache.info('item1').maxAge).toEqual(5);
//        expect(cache.get('item1')).toEqual('value1');
//        waits(100);
//        runs(function () {
//            $timeout.flush();
//            expect(cache.get('item1')).toEqual(undefined);
//        });
//    });
//    it('deleteOnExpire set to "passive" for a specific item should override deleteOnExpire set to "aggressive" for the cache', function () {
//        var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive' });
//        cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'passive' });
//        expect(cache.get('item1')).toEqual('value1');
//        expect(cache.info('item1').deleteOnExpire).toEqual("passive");
//        waits(100);
//        runs(function () {
//            expect(cache.info('item1').isExpired).toEqual(true);
//            expect(cache.get('item1')).toEqual(undefined);
//        });
//    });
//    it('should save data to localStorage when storageMode is used', function () {
//        var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
//            sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });
//
//        localStorageCache.put('item1', 'value1');
//        sessionStorageCache.put('item1', 'value1');
//
//        if (localStorage) {
//            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
//            expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1"]');
//        }
//        if (sessionStorage) {
//            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
//            expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1"]');
//        }
//    });
//});