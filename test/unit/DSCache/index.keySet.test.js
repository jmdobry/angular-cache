describe('DSCache.keySet()', function () {
  it('should return the set of keys of all items in the cache.', function () {
    var itemKeys = ['item1', 'item2', 'item3'];

    var cache = TestDSCacheFactory('DSCache.keySet.cache');

    cache.put(itemKeys[0], itemKeys[0]);
    cache.put(itemKeys[1], itemKeys[1]);
    cache.put(itemKeys[2], itemKeys[2]);

    var keySet = cache.keySet();

    assert.equal(keySet.hasOwnProperty(itemKeys[0]), true);
    assert.equal(keySet.hasOwnProperty(itemKeys[1]), true);
    assert.equal(keySet.hasOwnProperty(itemKeys[2]), true);

    assert.equal(keySet[itemKeys[0]], itemKeys[0]);
    assert.equal(keySet[itemKeys[1]], itemKeys[1]);
    assert.equal(keySet[itemKeys[2]], itemKeys[2]);

    cache.remove(itemKeys[0]);
    cache.remove(itemKeys[1]);
    cache.remove(itemKeys[2]);

    keySet = cache.keySet();

    assert.equal(keySet.hasOwnProperty(itemKeys[0]), false);
    assert.equal(keySet.hasOwnProperty(itemKeys[1]), false);
    assert.equal(keySet.hasOwnProperty(itemKeys[2]), false);
  });
});
