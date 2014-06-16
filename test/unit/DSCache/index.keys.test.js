describe('DSCache.keys()', function () {
  it('should return the array of keys of all items in the cache.', function () {
    var itemKeys = ['item1', 'item2', 'item3'];

    var cache = TestDSCacheFactory('DSCache.keys.cache');

    cache.put(itemKeys[0], itemKeys[0]);
    assert.deepEqual(cache.keys(), [itemKeys[0]]);

    cache.put(itemKeys[0], itemKeys[2]);
    assert.deepEqual(cache.keys(), [itemKeys[0]]);
    assert.deepEqual(cache.get(itemKeys[0]), itemKeys[2]);

    cache.put(itemKeys[1], itemKeys[1]);
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1]]);

    cache.put(itemKeys[2], itemKeys[2]);
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1], itemKeys[2]]);

    var keys = cache.keys();

    assert.equal(keys[0], itemKeys[0]);
    assert.equal(keys[1], itemKeys[1]);
    assert.equal(keys[2], itemKeys[2]);

    cache.remove(itemKeys[0]);
    cache.remove(itemKeys[1]);
    cache.remove(itemKeys[2]);

    keys = cache.keys();

    assert.equal(keys.length, 0);
    assert.deepEqual(keys, []);
  });
  it('should return the array of keys of all items in the cache when using localStorage.', function () {
    var itemKeys = ['item1', 'item2', 'item3'];

    var cache = TestDSCacheFactory('DSCache.keys.cache', {
      storageMode: 'localStorage'
    });

    cache.put(itemKeys[0], itemKeys[0]);
    assert.deepEqual(cache.keys(), [itemKeys[0]]);

    cache.put(itemKeys[0], itemKeys[2]);
    assert.deepEqual(cache.keys(), [itemKeys[0]]);
    assert.deepEqual(cache.get(itemKeys[0]), itemKeys[2]);

    cache.put(itemKeys[1], itemKeys[1]);
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1]]);

    cache.put(itemKeys[2], itemKeys[2]);
    assert.deepEqual(cache.keys(), [itemKeys[0], itemKeys[1], itemKeys[2]]);

    var keys = cache.keys();

    assert.equal(keys[0], itemKeys[0]);
    assert.equal(keys[1], itemKeys[1]);
    assert.equal(keys[2], itemKeys[2]);

    cache.remove(itemKeys[0]);
    cache.remove(itemKeys[1]);
    cache.remove(itemKeys[2]);

    keys = cache.keys();

    assert.equal(keys.length, 0);
    assert.deepEqual(keys, []);
  });
});
