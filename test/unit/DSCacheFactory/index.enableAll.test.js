describe('DSCacheFactory.enableAll()', function () {
  it('should enable all caches in DSCacheFactory.', function (done) {
    var cacheKeys = ['DSCacheFactory.enableAll.cache', 'DSCacheFactory.enableAll.cache1', 'DSCacheFactory.enableAll.cache2'];

    TestDSCacheFactory(cacheKeys[0], { disabled: true });
    TestDSCacheFactory(cacheKeys[1]);
    TestDSCacheFactory(cacheKeys[2], { disabled: true });

    assert.equal(TestDSCacheFactory.get(cacheKeys[0]).info().disabled, true);
    assert.equal(TestDSCacheFactory.get(cacheKeys[1]).info().disabled, false);
    assert.equal(TestDSCacheFactory.get(cacheKeys[2]).info().disabled, true);

    TestDSCacheFactory.enableAll();

    assert.equal(TestDSCacheFactory.get(cacheKeys[0]).info().disabled, false);
    assert.equal(TestDSCacheFactory.get(cacheKeys[1]).info().disabled, false);
    assert.equal(TestDSCacheFactory.get(cacheKeys[2]).info().disabled, false);

    done();
  });
});
