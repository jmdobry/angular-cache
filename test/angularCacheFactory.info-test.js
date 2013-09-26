describe('$angularCacheFactory.info()', function () {
    it('should return the correct info for $angularCacheFactory.', function () {
        var options = {
            capacity: Math.floor((Math.random() * 100000) + 1),
            maxAge: Math.floor((Math.random() * 100000) + 1),
            cacheFlushInterval: Math.floor((Math.random() * 100000) + 1)
            },
            caches = [];

        caches.push($angularCacheFactory('cache'));
        caches.push($angularCacheFactory('cache2', {
            maxAge: options.maxAge
        }));
        caches.push($angularCacheFactory('cache3', {
            capacity: options.capacity,
            cacheFlushInterval: options.cacheFlushInterval
        }));
        var info = $angularCacheFactory.info();
        expect(info.size).toEqual(3);

        expect(info.cacheDefaults.capacity).toEqual(CACHE_DEFAULTS.capacity);
        expect(info.cacheDefaults.maxAge).toEqual(CACHE_DEFAULTS.maxAge);
        expect(info.cacheDefaults.cacheFlushInterval).toEqual(CACHE_DEFAULTS.cacheFlushInterval);
        expect(info.cacheDefaults.deleteOnExpire).toEqual(CACHE_DEFAULTS.deleteOnExpire);
        expect(info.cacheDefaults.onExpire).toEqual(CACHE_DEFAULTS.onExpire);
        expect(info.cacheDefaults.recycleFreq).toEqual(CACHE_DEFAULTS.recycleFreq);
        expect(info.cacheDefaults.verifyIntegrity).toEqual(CACHE_DEFAULTS.verifyIntegrity);
        expect(info.cacheDefaults.storageMode).toEqual(CACHE_DEFAULTS.storageMode);
        expect(info.cacheDefaults.storageImpl).toEqual(CACHE_DEFAULTS.storageImpl);

        expect(info.caches.cache.id).toEqual(caches[0].info().id);
        expect(info.caches.cache.capacity).toEqual(caches[0].info().capacity);
        expect(info.caches.cache.size).toEqual(caches[0].info().size);

        expect(info.caches.cache2.id).toEqual(caches[1].info().id);
        expect(info.caches.cache2.capacity).toEqual(caches[1].info().capacity);
        expect(info.caches.cache2.size).toEqual(caches[1].info().size);
        expect(info.caches.cache2.maxAge).toEqual(caches[1].info().maxAge);

        expect(info.caches.cache3.id).toEqual(caches[2].info().id);
        expect(info.caches.cache3.capacity).toEqual(caches[2].info().capacity);
        expect(info.caches.cache3.size).toEqual(caches[2].info().size);
        expect(info.caches.cache3.cacheFlushInterval).toEqual(caches[2].info().cacheFlushInterval);
    });
});
