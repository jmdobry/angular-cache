describe('AngularCache.keys()', function () {
  it('should return the array of keys of all items in the cache.', function () {
    var itemKeys = ['item1', 'item2', 'item3'];

    var cache = $angularCacheFactory('cache');

    cache.put(itemKeys[0], itemKeys[0]);
    cache.put(itemKeys[1], itemKeys[1]);
    cache.put(itemKeys[2], itemKeys[2]);

    var keys = cache.keys();

    expect(keys[0]).toEqual(itemKeys[0]);
    expect(keys[1]).toEqual(itemKeys[1]);
    expect(keys[2]).toEqual(itemKeys[2]);

    cache.remove(itemKeys[0]);
    cache.remove(itemKeys[1]);
    cache.remove(itemKeys[2]);

    keys = cache.keys();

    expect(keys.length).toEqual(0);
  });
});
