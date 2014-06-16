describe('DSCacheFactory.get(cacheId)', function () {
  it('should throw an exception if "cacheId" is not a string.', function (done) {
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      try {
        TestDSCacheFactory.get(TYPES_EXCEPT_STRING[i]);
        fail();
      } catch (err) {
        assert.equal(err.message, '[ng:areq] Expected cacheId to be a string! Found: ' + typeof TYPES_EXCEPT_STRING[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_STRING[i]);
        continue;
      }
      fail();
    }
    done();
  });
  it('should return "undefined" if the cache does not exist.', function (done) {
    assert.isUndefined(TestDSCacheFactory.get('someNonExistentCache'));
    done();
  });
  it('should return the correct cache with the specified cacheId.', function (done) {
    var cache = TestDSCacheFactory('DSCacheFactory.get.cache'),
      cache2 = TestDSCacheFactory('DSCacheFactory.get.cache2');
    assert.equal(TestDSCacheFactory.get('DSCacheFactory.get.cache'), cache);
    assert.equal(TestDSCacheFactory.get('DSCacheFactory.get.cache2'), cache2);
    assert.notEqual(cache, cache2);

    done();
  });
});
