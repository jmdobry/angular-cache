describe('CacheFactory.destroyAll()', function () {
  it('should call "destroy()" on all caches currently owned by the factory.', function (done) {
    var cacheKeys = ['CacheFactory.destroyAll.cache', 'CacheFactory.destroyAll.cache1', 'CacheFactory.destroyAll.cache2'],
      caches = [];

    caches.push(TestCacheFactory(cacheKeys[0]));
    caches.push(TestCacheFactory(cacheKeys[1]));
    caches.push(TestCacheFactory(cacheKeys[2]));

    sinon.spy(caches[0], 'destroy');
    sinon.spy(caches[1], 'destroy');
    sinon.spy(caches[2], 'destroy');
    TestCacheFactory.destroyAll();

    assert.equal(caches[0].destroy.callCount, 1);
    assert.equal(caches[1].destroy.callCount, 1);
    assert.equal(caches[2].destroy.callCount, 1);

    done();
  });
  it('should result in all caches being removed from CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.destroyAll.cache', 'CacheFactory.destroyAll.cache1', 'CacheFactory.destroyAll.cache2'],
      caches = [];

    caches.push(TestCacheFactory(cacheKeys[0]));
    caches.push(TestCacheFactory(cacheKeys[1]));
    caches.push(TestCacheFactory(cacheKeys[2]));

    TestCacheFactory.destroyAll();

    assert.isUndefined(TestCacheFactory.get(cacheKeys[0]));
    assert.isUndefined(TestCacheFactory.get(cacheKeys[1]));
    assert.isUndefined(TestCacheFactory.get(cacheKeys[2]));

    done();
  });
});
