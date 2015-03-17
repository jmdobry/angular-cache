describe('CacheFactory.keys()', function () {
  it('should return the array of keys of all caches in CacheFactory.', function (done) {
    var cacheKeys = ['cache', 'cache1', 'cache2'];

    TestCacheFactory(cacheKeys[0]);
    TestCacheFactory(cacheKeys[1]);
    TestCacheFactory(cacheKeys[2]);

    var keys = TestCacheFactory.keys();
    assert.equal(keys.length, 3);
    assert.equal(keys[0], cacheKeys[0]);
    assert.equal(keys[1], cacheKeys[1]);
    assert.equal(keys[2], cacheKeys[2]);

    TestCacheFactory.get(cacheKeys[0]).destroy();
    keys = TestCacheFactory.keys();
    assert.equal(keys.length, 2);
    assert.notEqual(keys.indexOf(cacheKeys[1]), -1);
    assert.notEqual(keys.indexOf(cacheKeys[2]), -1);

    TestCacheFactory.get(cacheKeys[1]).destroy();
    keys = TestCacheFactory.keys();
    assert.equal(keys.length, 1);
    assert.notEqual(keys.indexOf(cacheKeys[2]), -1);

    TestCacheFactory.get(cacheKeys[2]).destroy();

    keys = TestCacheFactory.keys();

    assert.equal(keys.length, 0);

    done();
  });
});
