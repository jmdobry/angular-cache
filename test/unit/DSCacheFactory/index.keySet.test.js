describe('DSCacheFactory.keySet()', function () {
  it('should return the set of keys of all caches in DSCacheFactory.', function (done) {
    var cacheKeys = ['DSCacheFactory.keySet.cache', 'DSCacheFactory.keySet.cache1', 'DSCacheFactory.keySet.cache2'];

    TestDSCacheFactory(cacheKeys[0]);
    TestDSCacheFactory(cacheKeys[1]);
    TestDSCacheFactory(cacheKeys[2]);

    var keySet = TestDSCacheFactory.keySet();

    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), true);
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), true);
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), true);

    assert.equal(keySet[cacheKeys[0]], cacheKeys[0]);
    assert.equal(keySet[cacheKeys[1]], cacheKeys[1]);
    assert.equal(keySet[cacheKeys[2]], cacheKeys[2]);

    TestDSCacheFactory.get(cacheKeys[0]).destroy();
    keySet = TestDSCacheFactory.keySet();
    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), false);
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), true);
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), true);
    assert.isUndefined(keySet[cacheKeys[0]]);
    assert.equal(keySet[cacheKeys[1]], cacheKeys[1]);
    assert.equal(keySet[cacheKeys[2]], cacheKeys[2]);

    TestDSCacheFactory.get(cacheKeys[1]).destroy();
    keySet = TestDSCacheFactory.keySet();
    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), false);
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), false);
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), true);
    assert.isUndefined(keySet[cacheKeys[0]]);
    assert.isUndefined(keySet[cacheKeys[1]]);
    assert.equal(keySet[cacheKeys[2]], cacheKeys[2]);

    TestDSCacheFactory.get(cacheKeys[2]).destroy();

    keySet = TestDSCacheFactory.keySet();

    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), false);
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), false);
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), false);
    assert.isUndefined(keySet[cacheKeys[0]]);
    assert.isUndefined(keySet[cacheKeys[1]]);
    assert.isUndefined(keySet[cacheKeys[2]]);

    done();
  });
});
