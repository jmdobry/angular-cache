describe('$angularCacheFactory.keys()', function () {
    it('should return the array of keys of all caches in $angularCacheFactory.', function () {
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
