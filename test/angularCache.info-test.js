describe('AngularCache.info()', function () {
    it('should return the correct values.', function () {
        var onExpire = function () {
        };
        var cache = $angularCacheFactory('cache'),
            cache2 = $angularCacheFactory('cache2', { maxAge: 1000 }),
            cache3 = $angularCacheFactory('cache3', { cacheFlushInterval: 1000 }),
            cache4 = $angularCacheFactory('cache4', { capacity: 1000 }),
            cache5 = $angularCacheFactory('cache5', { storageMode: 'localStorage' }),
            cache6 = $angularCacheFactory('cache6', { storageMode: 'sessionStorage' });
        cache7 = $angularCacheFactory('cache7', { maxAge: 100, onExpire: onExpire });
        var cacheInfo = cache.info();
        expect(cacheInfo.id).toEqual('cache');
        expect(cacheInfo.capacity).toEqual(Number.MAX_VALUE);
        expect(cacheInfo.size).toEqual(0);
        expect(cacheInfo.recycleFreq).toEqual(1000);
        expect(cacheInfo.maxAge).toEqual(null);
        expect(cacheInfo.cacheFlushInterval).toEqual(null);
        expect(typeof cacheInfo.recycleFreqId).toEqual('number');
        expect(cacheInfo.deleteOnExpire).toEqual('none');
        expect(cacheInfo.storageMode).toEqual('none');
        expect(cacheInfo.onExpire).toEqual(null);
        cache.put('item', 'value');
        cache.put('item2', 'value2', { maxAge: 200, deleteOnExpire: 'aggressive' });

        // AngularCache#info(key)
        expect(cache.info('non-existent item')).not.toBeDefined();
        expect(typeof cache.info('item').created).toEqual('number');
        expect(typeof cache.info('item').expires).toEqual('undefined');
        expect(typeof cache.info('item').accessed).toEqual('number');
        expect(cache.info('item').maxAge).toEqual(null);
        expect(cache.info('item').deleteOnExpire).toEqual('none');
        expect(typeof cache.info('item2').created).toEqual('number');
        expect(typeof cache.info('item2').expires).toEqual('number');
        expect(typeof cache.info('item2').accessed).toEqual('number');
        expect(cache.info('item2').maxAge).toEqual(200);
        expect(cache.info('item2').deleteOnExpire).toEqual('aggressive');

        expect(cache.info().size).toEqual(2);

        var cacheInfo2 = cache2.info();
        expect(cacheInfo2.id).toEqual('cache2');
        expect(cacheInfo2.capacity).toEqual(Number.MAX_VALUE);
        expect(cacheInfo2.size).toEqual(0);
        expect(cacheInfo2.recycleFreq).toEqual(1000);
        expect(cacheInfo2.maxAge).toEqual(1000);
        expect(cacheInfo2.cacheFlushInterval).toEqual(null);
        expect(typeof cacheInfo2.recycleFreqId).toEqual('number');
        expect(cacheInfo2.deleteOnExpire).toEqual('none');
        expect(cacheInfo2.storageMode).toEqual('none');
        expect(cacheInfo2.onExpire).toEqual(null);

        expect(cache3.info().id).toEqual('cache3');
        expect(cache3.info().capacity).toEqual(Number.MAX_VALUE);
        expect(cache3.info().cacheFlushInterval).toEqual(1000);
        expect(cache3.info().size).toEqual(0);

        var cacheInfo4 = cache4.info();
        expect(cacheInfo4.id).toEqual('cache4');
        expect(cacheInfo4.capacity).toEqual(1000);
        expect(cacheInfo4.size).toEqual(0);
        expect(cacheInfo4.recycleFreq).toEqual(1000);
        expect(cacheInfo4.maxAge).toEqual(null);
        expect(cacheInfo4.cacheFlushInterval).toEqual(null);
        expect(typeof cacheInfo4.recycleFreqId).toEqual('number');
        expect(cacheInfo4.deleteOnExpire).toEqual('none');
        expect(cacheInfo4.storageMode).toEqual('none');
        expect(cacheInfo4.onExpire).toEqual(null);
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
    });
});