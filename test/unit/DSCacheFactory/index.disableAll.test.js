describe('DSCacheFactory.disableAll()', function () {
  it('should disable all caches in DSCacheFactory.', function (done) {
    var cacheKeys = ['DSCacheFactory.disableAll.cache', 'DSCacheFactory.disableAll.cache1', 'DSCacheFactory.disableAll.cache2'];

    TestDSCacheFactory(cacheKeys[0]);
    TestDSCacheFactory(cacheKeys[1], { disabled: true });
    TestDSCacheFactory(cacheKeys[2]);

    assert.equal(TestDSCacheFactory.get(cacheKeys[0]).info().disabled, false);
    assert.equal(TestDSCacheFactory.get(cacheKeys[1]).info().disabled, true);
    assert.equal(TestDSCacheFactory.get(cacheKeys[2]).info().disabled, false);

    TestDSCacheFactory.disableAll();

    assert.equal(TestDSCacheFactory.get(cacheKeys[0]).info().disabled, true);
    assert.equal(TestDSCacheFactory.get(cacheKeys[1]).info().disabled, true);
    assert.equal(TestDSCacheFactory.get(cacheKeys[2]).info().disabled, true);

    done();
  });
});
