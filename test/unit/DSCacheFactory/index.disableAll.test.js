describe('CacheFactory.disableAll()', function () {
  it('should disable all caches in CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.disableAll.cache', 'CacheFactory.disableAll.cache1', 'CacheFactory.disableAll.cache2'];

    TestCacheFactory(cacheKeys[0]);
    TestCacheFactory(cacheKeys[1], { disabled: true });
    TestCacheFactory(cacheKeys[2]);

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
