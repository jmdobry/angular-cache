describe('DSCacheFactory.info()', function () {
  it('should return the correct info for DSCacheFactory.', function (done) {
    var options = {
        capacity: Math.floor((Math.random() * 100000) + 1),
        maxAge: Math.floor((Math.random() * 100000) + 1),
        cacheFlushInterval: Math.floor((Math.random() * 100000) + 1)
      },
      caches = [];

    caches.push(TestDSCacheFactory('cache'));
    caches.push(TestDSCacheFactory('cache2', {
      maxAge: options.maxAge
    }));
    caches.push(TestDSCacheFactory('cache3', {
      capacity: options.capacity,
      cacheFlushInterval: options.cacheFlushInterval
    }));
    var info = TestDSCacheFactory.info();
    assert.equal(info.size, 3);

    assert.equal(info.cacheDefaults.capacity, CACHE_DEFAULTS.capacity);
    assert.equal(info.cacheDefaults.maxAge, CACHE_DEFAULTS.maxAge);
    assert.equal(info.cacheDefaults.cacheFlushInterval, CACHE_DEFAULTS.cacheFlushInterval);
    assert.equal(info.cacheDefaults.deleteOnExpire, CACHE_DEFAULTS.deleteOnExpire);
    assert.equal(info.cacheDefaults.onExpire, CACHE_DEFAULTS.onExpire);
    assert.equal(info.cacheDefaults.recycleFreq, CACHE_DEFAULTS.recycleFreq);
    assert.equal(info.cacheDefaults.storageMode, CACHE_DEFAULTS.storageMode);
    assert.equal(info.cacheDefaults.storageImpl, CACHE_DEFAULTS.storageImpl);

    assert.equal(info.caches.cache.id, caches[0].info().id);
    assert.equal(info.caches.cache.capacity, caches[0].info().capacity);
    assert.equal(info.caches.cache.size, caches[0].info().size);

    assert.equal(info.caches.cache2.id, caches[1].info().id);
    assert.equal(info.caches.cache2.capacity, caches[1].info().capacity);
    assert.equal(info.caches.cache2.size, caches[1].info().size);
    assert.equal(info.caches.cache2.maxAge, caches[1].info().maxAge);

    assert.equal(info.caches.cache3.id, caches[2].info().id);
    assert.equal(info.caches.cache3.capacity, caches[2].info().capacity);
    assert.equal(info.caches.cache3.size, caches[2].info().size);
    assert.equal(info.caches.cache3.cacheFlushInterval, caches[2].info().cacheFlushInterval);

    done();
  });
});
