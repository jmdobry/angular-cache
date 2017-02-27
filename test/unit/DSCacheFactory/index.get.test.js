/* global fail, TestCacheFactory */
describe('CacheFactory.get(cacheId)', function () {
  it('should throw if the cache does not exist.', function () {
    try {
      TestCacheFactory.get('someNonExistentCache')
      fail('should not reach this!')
    } catch (err) {
      var msg = err.message
    }
    assert.equal(msg, 'Cache "someNonExistentCache" does not exist!')
  })
  it('should return the correct cache with the specified cacheId.', function (done) {
    var cache = TestCacheFactory.createCache('CacheFactory.get.cache')
    var cache2 = TestCacheFactory.createCache('CacheFactory.get.cache2')
    assert.equal(TestCacheFactory.get('CacheFactory.get.cache'), cache)
    assert.equal(TestCacheFactory.get('CacheFactory.get.cache2'), cache2)
    assert.notEqual(cache, cache2)

    done()
  })
})
