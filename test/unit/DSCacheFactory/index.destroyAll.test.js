/* global fail, sinon, TestCacheFactory */
describe('CacheFactory.destroyAll()', function () {
  it('should call "destroy()" on all caches currently owned by the factory.', function (done) {
    var cacheKeys = ['CacheFactory.destroyAll.cache', 'CacheFactory.destroyAll.cache1', 'CacheFactory.destroyAll.cache2']
    var caches = []

    caches.push(TestCacheFactory.createCache(cacheKeys[0]))
    caches.push(TestCacheFactory.createCache(cacheKeys[1]))
    caches.push(TestCacheFactory.createCache(cacheKeys[2]))

    sinon.spy(caches[0], 'destroy')
    sinon.spy(caches[1], 'destroy')
    sinon.spy(caches[2], 'destroy')
    TestCacheFactory.destroyAll()

    assert.equal(caches[0].destroy.callCount, 1)
    assert.equal(caches[1].destroy.callCount, 1)
    assert.equal(caches[2].destroy.callCount, 1)

    done()
  })
  it('should result in all caches being removed from CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.destroyAll.cache', 'CacheFactory.destroyAll.cache1', 'CacheFactory.destroyAll.cache2']
    var caches = []
    var i
    for (i = 0; i < cacheKeys.length; i++) {
      caches.push(TestCacheFactory.createCache(cacheKeys[i]))
    }

    TestCacheFactory.destroyAll()
    for (i = 0; i < cacheKeys.length; i++) {
      try {
        TestCacheFactory.get(cacheKeys[i])
        fail('should not reach this!')
      } catch (err) {
        assert.equal(err.message, 'Cache "' + cacheKeys[i] + '" does not exist!')
        continue
      }
      fail('should not reach this!')
    }
    done()
  })
})
