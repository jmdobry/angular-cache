describe('$angularCacheFactory.get(cacheId)', function () {
  it('should throw an exception if "cacheId" is not a string.', function () {
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      try {
        $angularCacheFactory.get(TYPES_EXCEPT_STRING[i]);
        fail();
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactory.get(cacheId): cacheId: must be a string!');
        continue;
      }
      fail();
    }
  });
  it('should return "undefined" if the cache does not exist.', function () {
    expect($angularCacheFactory.get('someNonExistentCache')).toEqual(undefined);
  });
  it('should return the correct cache with the specified cacheId.', function () {
    var cache = $angularCacheFactory('cache'),
      cache2 = $angularCacheFactory('cache2');
    expect($angularCacheFactory.get('cache')).toEqual(cache);
    expect($angularCacheFactory.get('cache2')).toEqual(cache2);
    expect(cache).not.toEqual(cache2);
  });
});
