/* global TestCacheFactory */
describe('CacheFactory.disableAll()', function () {
  it('should disable all caches in CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.disableAll.cache', 'CacheFactory.disableAll.cache1', 'CacheFactory.disableAll.cache2']

    TestCacheFactory.createCache(cacheKeys[0])
    TestCacheFactory.createCache(cacheKeys[1], { enabled: false })
    TestCacheFactory.createCache(cacheKeys[2])

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().enabled, true)
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().enabled, false)
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().enabled, true)

    TestCacheFactory.disableAll()

    assert.equal(TestCacheFactory.get(cacheKeys[0]).info().enabled, false)
    assert.equal(TestCacheFactory.get(cacheKeys[1]).info().enabled, false)
    assert.equal(TestCacheFactory.get(cacheKeys[2]).info().enabled, false)

    done()
  })
})
