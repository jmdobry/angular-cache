describe('$angularCacheFactory.info()', function () {
    it('should return the correct info for each cache produced by the factory.', function () {
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
    });
});
