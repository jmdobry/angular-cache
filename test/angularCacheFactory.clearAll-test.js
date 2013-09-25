describe('$angularCacheFactory.clearAll()', function () {
    it('should call "removeAll()" on all caches in $angularCacheFactory', function () {
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
