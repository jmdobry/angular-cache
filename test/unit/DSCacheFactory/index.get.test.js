describe('CacheFactory.get(cacheId)', function () {
  it('should return "undefined" if the cache does not exist.', function (done) {
    assert.isUndefined(TestCacheFactory.get('someNonExistentCache'));
    done();
  });
  it('should return the correct cache with the specified cacheId.', function (done) {
    var cache = TestCacheFactory('CacheFactory.get.cache'),
      cache2 = TestCacheFactory('CacheFactory.get.cache2');
    assert.equal(TestCacheFactory.get('CacheFactory.get.cache'), cache);
    assert.equal(TestCacheFactory.get('CacheFactory.get.cache2'), cache2);
    assert.notEqual(cache, cache2);

    done();
  });
});
