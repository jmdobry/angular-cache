describe('DSCache.info()', function () {
  it('should return the correct values.', function () {
    var onExpire = function () {
    };
    var cache = TestDSCacheFactory('cache'),
      cache2 = TestDSCacheFactory('cache2', { maxAge: 1000 }),
      cache3 = TestDSCacheFactory('cache3', { cacheFlushInterval: 1000 }),
      cache4 = TestDSCacheFactory('cache4', { capacity: 1000 }),
      cache5 = TestDSCacheFactory('cache5', { storageMode: 'localStorage' }),
      cache6 = TestDSCacheFactory('cache6', { storageMode: 'sessionStorage' }),
      cache7 = TestDSCacheFactory('cache7', { maxAge: 100, onExpire: onExpire });
    var cacheInfo = cache.info();
    assert.equal(cacheInfo.id, 'cache');
    assert.equal(cacheInfo.capacity, Number.MAX_VALUE);
    assert.equal(cacheInfo.size, 0);
    assert.equal(cacheInfo.recycleFreq, 1000);
    assert.equal(cacheInfo.maxAge, Number.MAX_VALUE);
    assert.equal(cacheInfo.cacheFlushInterval, null);
    assert.equal(cacheInfo.deleteOnExpire, 'none');
    assert.equal(cacheInfo.storageMode, 'memory');
    assert.equal(cacheInfo.onExpire, null);
    cache.put('item', 'value');
    cache.put('item2', 'value2');

    // DSCache#info(key)
    assert.isUndefined(cache.info('non-existent item'));
    assert.isNumber(cache.info('item').created);
    assert.isNumber(cache.info('item').expires);
    assert.isFalse(cache.info('item').isExpired);
    assert.isNumber(cache.info('item').accessed);
    assert.isNumber(cache.info('item2').created);
    assert.isNumber(cache.info('item2').expires);
    assert.isFalse(cache.info('item2').isExpired);
    assert.isNumber(cache.info('item2').accessed);

    assert.equal(cache.info().size, 2);

    var cacheInfo2 = cache2.info();
    assert.equal(cacheInfo2.id, 'cache2');
    assert.equal(cacheInfo2.capacity, Number.MAX_VALUE);
    assert.equal(cacheInfo2.size, 0);
    assert.equal(cacheInfo2.recycleFreq, 1000);
    assert.equal(cacheInfo2.maxAge, 1000);
    assert.equal(cacheInfo2.cacheFlushInterval, null);
    assert.equal(cacheInfo2.deleteOnExpire, 'none');
    assert.equal(cacheInfo2.storageMode, 'memory');
    assert.equal(cacheInfo2.onExpire, null);

    assert.equal(cache3.info().id, 'cache3');
    assert.equal(cache3.info().capacity, Number.MAX_VALUE);
    assert.equal(cache3.info().cacheFlushInterval, 1000);
    assert.equal(cache3.info().size, 0);

    var cacheInfo4 = cache4.info();
    assert.equal(cacheInfo4.id, 'cache4');
    assert.equal(cacheInfo4.capacity, 1000);
    assert.equal(cacheInfo4.size, 0);
    assert.equal(cacheInfo4.recycleFreq, 1000);
    assert.equal(cacheInfo4.maxAge, Number.MAX_VALUE);
    assert.equal(cacheInfo4.cacheFlushInterval, null);
    assert.equal(cacheInfo4.deleteOnExpire, 'none');
    assert.equal(cacheInfo4.storageMode, 'memory');
    assert.equal(cacheInfo4.onExpire, null);
    if (localStorage) {
      assert.equal(cache5.info().storageMode, 'localStorage', 'cache5 storageMode should be "memory"');
    } else {
      assert.equal(cache5.info().storageMode, null);
    }
    if (sessionStorage) {
      assert.equal(cache6.info().storageMode, 'sessionStorage');
    } else {
      assert.equal(cache6.info().storageMode, null);
    }
    assert.equal(cache7.info().onExpire, onExpire);
  });
});
