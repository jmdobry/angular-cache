describe('AngularCache.removeExpired()', function () {
  it('should remove all expired items.', function () {
    var cache = $angularCacheFactory('cache', {
      deleteOnExpire: 'none',
      maxAge: 10,
      recycleFreq: 20
    });
    var value1 = 'value1',
      value2 = 2,
      value3 = {
        value3: 'stuff'
      };
    cache.put('item1', value1, {
      deleteOnExpire: 'passive'
    });
    cache.put('item2', value2, {
      deleteOnExpire: 'aggressive'
    });
    cache.put('item3', value3);
    waits(100);
    runs(function () {
      cache.removeExpired();
      expect(cache.info().size).toEqual(0);
      cache.put('item3', value3);
      expect(cache.info().size).toEqual(1);
    });
  });
});
