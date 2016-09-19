describe('CacheFactory.disableAll()', function () {
  it('should disable all caches in CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.disableAll.cache', 'CacheFactory.disableAll.cache1', 'CacheFactory.disableAll.cache2'];

    TestCacheFactory.createCache(cacheKeys[0]);
    TestCacheFactory.createCache(cacheKeys[1], { disabled: true });
    TestCacheFactory.createCache(cacheKeys[2]);

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().disabled, false);
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().disabled, true);
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().disabled, false);

    TestCacheFactory.disableAll();

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().disabled, true);
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().disabled, true);
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().disabled, true);

    done();
  });
});
