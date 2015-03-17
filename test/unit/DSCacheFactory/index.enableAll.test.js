describe('CacheFactory.enableAll()', function () {
  it('should enable all caches in CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.enableAll.cache', 'CacheFactory.enableAll.cache1', 'CacheFactory.enableAll.cache2'];

    TestCacheFactory(cacheKeys[0], { disabled: true });
    TestCacheFactory(cacheKeys[1]);
    TestCacheFactory(cacheKeys[2], { disabled: true });

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().disabled, true);
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().disabled, false);
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().disabled, true);

    TestCacheFactory.enableAll();

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().disabled, false);
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().disabled, false);
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().disabled, false);

    done();
  });
});
