/* global TestCacheFactory */
describe('CacheFactory.enableAll()', function () {
  it('should enable all caches in CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.enableAll.cache', 'CacheFactory.enableAll.cache1', 'CacheFactory.enableAll.cache2']

    TestCacheFactory.createCache(cacheKeys[0], { enabled: false })
    TestCacheFactory.createCache(cacheKeys[1])
    TestCacheFactory.createCache(cacheKeys[2], { enabled: false })

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().enabled, false)
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().enabled, true)
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().enabled, false)

    TestCacheFactory.enableAll()

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().enabled, true)
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().enabled, true)
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().enabled, true)

    done()
  })
})
