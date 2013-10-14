describe('$angularCacheFactory.removeAll()', function () {
    it('should call "destroy()" on all caches currently owned by the factory.', function () {
        var cacheKeys = ['cache', 'cache1', 'cache2'],
            caches = [];

        caches.push($angularCacheFactory(cacheKeys[0]));
        caches.push($angularCacheFactory(cacheKeys[1]));
        caches.push($angularCacheFactory(cacheKeys[2]));

        spyOn(caches[0], 'destroy');
        spyOn(caches[1], 'destroy');
        spyOn(caches[2], 'destroy');
        $angularCacheFactory.removeAll();

        expect(caches[0].destroy.callCount).toEqual(1);
        expect(caches[1].destroy.callCount).toEqual(1);
        expect(caches[2].destroy.callCount).toEqual(1);
    });
    it('should result in all caches being removed from $angularCacheFactory.', function () {
        var cacheKeys = ['cache', 'cache1', 'cache2'],
            caches = [];

        caches.push($angularCacheFactory(cacheKeys[0]));
        caches.push($angularCacheFactory(cacheKeys[1]));
        caches.push($angularCacheFactory(cacheKeys[2]));

        $angularCacheFactory.removeAll();

        expect($angularCacheFactory.get(cacheKeys[0])).not.toBeDefined();
        expect($angularCacheFactory.get(cacheKeys[1])).not.toBeDefined();
        expect($angularCacheFactory.get(cacheKeys[2])).not.toBeDefined();
    });
});
