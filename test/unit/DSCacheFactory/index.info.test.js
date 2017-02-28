/* global TestCacheFactory, CACHE_DEFAULTS */
describe('CacheFactory.info()', function () {
  it('should return the correct info for CacheFactory.', function (done) {
    var options = {
      capacity: Math.floor((Math.random() * 100000) + 1),
      maxAge: Math.floor((Math.random() * 100000) + 1),
      cacheFlushInterval: Math.floor((Math.random() * 100000) + 1)
    }
    var caches = []

    caches.push(TestCacheFactory.createCache('cache'))
    caches.push(TestCacheFactory.createCache('cache2', {
      maxAge: options.maxAge
    }))
    caches.push(TestCacheFactory.createCache('cache3', {
      capacity: options.capacity,
      cacheFlushInterval: options.cacheFlushInterval
    }))
    var info = TestCacheFactory.info()
    assert.equal(info.size, 3)

    assert.equal(info.capacity, CACHE_DEFAULTS.capacity)
    assert.equal(info.maxAge, CACHE_DEFAULTS.maxAge)
    assert.equal(info.cacheFlushInterval, CACHE_DEFAULTS.cacheFlushInterval)
    assert.equal(info.deleteOnExpire, CACHE_DEFAULTS.deleteOnExpire)
    assert.equal(info.onExpire, CACHE_DEFAULTS.onExpire)
    assert.equal(info.recycleFreq, CACHE_DEFAULTS.recycleFreq)
    assert.equal(info.storageMode, CACHE_DEFAULTS.storageMode)
    assert.equal(info.storageImpl, CACHE_DEFAULTS.storageImpl)

    assert.equal(info.caches.cache.id, caches[0].info().id)
    assert.equal(info.caches.cache.capacity, caches[0].info().capacity)
    assert.equal(info.caches.cache.size, caches[0].info().size)

    assert.equal(info.caches.cache2.id, caches[1].info().id)
    assert.equal(info.caches.cache2.capacity, caches[1].info().capacity)
    assert.equal(info.caches.cache2.size, caches[1].info().size)
    assert.equal(info.caches.cache2.maxAge, caches[1].info().maxAge)

    assert.equal(info.caches.cache3.id, caches[2].info().id)
    assert.equal(info.caches.cache3.capacity, caches[2].info().capacity)
    assert.equal(info.caches.cache3.size, caches[2].info().size)
    assert.equal(info.caches.cache3.cacheFlushInterval, caches[2].info().cacheFlushInterval)

    done()
  })
})
