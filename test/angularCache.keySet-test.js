describe('AngularCache.keySet()', function () {
    it('should return the set of keys of all items in the cache.', function () {
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
    });
});