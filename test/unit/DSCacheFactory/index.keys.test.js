describe('DSCacheFactory.keys()', function () {
  it('should return the array of keys of all caches in DSCacheFactory.', function (done) {
    var cacheKeys = ['cache', 'cache1', 'cache2'];

    TestDSCacheFactory(cacheKeys[0]);
    TestDSCacheFactory(cacheKeys[1]);
    TestDSCacheFactory(cacheKeys[2]);

    var keys = TestDSCacheFactory.keys();
    assert.equal(keys.length, 3);
    assert.equal(keys[0], cacheKeys[0]);
    assert.equal(keys[1], cacheKeys[1]);
    assert.equal(keys[2], cacheKeys[2]);

    TestDSCacheFactory.get(cacheKeys[0]).destroy();
    keys = TestDSCacheFactory.keys();
    assert.equal(keys.length, 2);
    assert.notEqual(keys.indexOf(cacheKeys[1]), -1);
    assert.notEqual(keys.indexOf(cacheKeys[2]), -1);

    TestDSCacheFactory.get(cacheKeys[1]).destroy();
    keys = TestDSCacheFactory.keys();
    assert.equal(keys.length, 1);
    assert.notEqual(keys.indexOf(cacheKeys[2]), -1);

    TestDSCacheFactory.get(cacheKeys[2]).destroy();

    keys = TestDSCacheFactory.keys();

    assert.equal(keys.length, 0);

    done();
  });
});
