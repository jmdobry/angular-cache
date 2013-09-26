//describe('AngularCache.info()', function () {
//    it('should return the correct values', function () {
//        var onExpire = function () {
//        };
//        var cache = $angularCacheFactory('cache'),
//            cache2 = $angularCacheFactory('cache2', { maxAge: 1000 }),
//            cache3 = $angularCacheFactory('cache3', { cacheFlushInterval: 1000 }),
//            cache4 = $angularCacheFactory('cache4', { capacity: 1000 }),
//            cache5 = $angularCacheFactory('cache5', { storageMode: 'localStorage' }),
//            cache6 = $angularCacheFactory('cache6', { storageMode: 'sessionStorage' });
//        cache7 = $angularCacheFactory('cache7', { maxAge: 100, onExpire: onExpire });
//        expect(cache.info()).toEqual({
//            id: 'cache',
//            capacity: Number.MAX_VALUE,
//            size: 0,
//            maxAge: null,
//            cacheFlushInterval: null,
//            deleteOnExpire: 'none',
//            storageMode: 'none',
//            onExpire: null
//        });
//        cache.put('item', 'value');
//        cache.put('item2', 'value2', { maxAge: 200, deleteOnExpire: 'aggressive' });
//
//        // AngularCache#info(key)
//        expect(typeof cache.info('item').timestamp).toEqual('number');
//        expect(cache.info('item').maxAge).toEqual(null);
//        expect(cache.info('item').deleteOnExpire).toEqual('none');
//        expect(typeof cache.info('item2').timestamp).toEqual('number');
//        expect(cache.info('item2').maxAge).toEqual(200);
//        expect(cache.info('item2').deleteOnExpire).toEqual('aggressive');
//
//        expect(cache.info()).toEqual({
//            id: 'cache',
//            capacity: Number.MAX_VALUE,
//            size: 2,
//            maxAge: null,
//            cacheFlushInterval: null,
//            deleteOnExpire: 'none',
//            storageMode: 'none',
//            onExpire: null
//        });
//        expect(cache2.info()).toEqual({
//            id: 'cache2',
//            capacity: Number.MAX_VALUE,
//            maxAge: 1000,
//            size: 0,
//            cacheFlushInterval: null,
//            deleteOnExpire: 'none',
//            storageMode: 'none',
//            onExpire: null
//        });
//        expect(cache3.info().id).toEqual('cache3');
//        expect(cache3.info().capacity).toEqual(Number.MAX_VALUE);
//        expect(cache3.info().cacheFlushInterval).toEqual(1000);
//        expect(cache3.info().size).toEqual(0);
//        expect(cache4.info()).toEqual({
//            id: 'cache4',
//            capacity: 1000,
//            size: 0,
//            maxAge: null,
//            cacheFlushInterval: null,
//            deleteOnExpire: 'none',
//            storageMode: 'none',
//            onExpire: null
//        });
//        if (localStorage) {
//            expect(cache5.info().storageMode).toEqual('localStorage');
//        } else {
//            expect(cache5.info().storageMode).toEqual(null);
//        }
//        if (sessionStorage) {
//            expect(cache6.info().storageMode).toEqual('sessionStorage');
//        } else {
//            expect(cache6.info().storageMode).toEqual(null);
//        }
//        expect(cache7.info().onExpire).toEqual(onExpire);
//        cache.destroy();
//        cache2.destroy();
//        cache3.destroy();
//        cache4.destroy();
//        cache5.destroy();
//        cache6.destroy();
//        cache7.destroy();
//    });
//});