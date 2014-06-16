describe('DSCache.setOptions()', function () {
  it('should throw an error if "options" is not an object.', function () {
    var cache = TestDSCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        cache.setOptions(TYPES_EXCEPT_OBJECT[i]);
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        assert.equal(err.message, '[ng:areq] Expected cacheOptions to be an object! Found: ' + typeof TYPES_EXCEPT_OBJECT[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_OBJECT[i]);
        continue;
      }
      if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
        fail(TYPES_EXCEPT_OBJECT[i]);
      }
    }
  });
  it('should correctly reset to defaults if strict mode is true', function () {
    var onExpire = function () {
    };
    var cache = TestDSCacheFactory('cache', {
      maxAge: 100,
      cacheFlushInterval: 200,
      onExpire: onExpire,
      storageMode: 'localStorage',
      disabled: true
    });
    assert.equal(cache.info().maxAge, 100);
    assert.equal(cache.info().cacheFlushInterval, 200);
    assert.equal(cache.info().onExpire, onExpire);
    assert.equal(cache.info().storageMode, 'localStorage');
    assert.isTrue(cache.info().disabled);
    cache.setOptions({ }, true);
    assert.equal(cache.info().maxAge, Number.MAX_VALUE);
    assert.isNull(cache.info().cacheFlushInterval);
    assert.isNull(cache.info().onExpire);
    assert.equal(cache.info().storageMode, 'localStorage');
    assert.isFalse(cache.info().disabled);
  });
  it('should correctly modify the capacity of a cache', function (done) {
    var cache = TestDSCacheFactory('cache');
    assert.equal(cache.info().capacity, Number.MAX_VALUE);
    cache.setOptions({ capacity: 5 }, false);
    assert.equal(cache.info().capacity, 5);
    cache.put('item1', 1);
    cache.put('item2', 2);
    cache.put('item3', 3);
    cache.put('item4', 4);
    cache.put('item5', 5);
    cache.put('item6', 6);
    assert.isUndefined(cache.get('item1'));
    setTimeout(function () {
      cache.get('item2');
      cache.get('item3');
      cache.get('item6');
      cache.setOptions({ capacity: 3 }, false);
      // Least-recently used items over the new capacity should have been removed.
      assert.isUndefined(cache.get('item4'));
      assert.isUndefined(cache.get('item5'));
      assert.equal(cache.info().size, 3);

      done();
    }, 50);
  });
  it('should correctly modify the maxAge of a cache', function (done) {
    var cache = TestDSCacheFactory('cache');
    assert.equal(cache.info().maxAge, Number.MAX_VALUE);
    cache.setOptions({ maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
    assert.equal(cache.info().maxAge, 1000);
    cache.put('item1', 1);
    cache.put('item2', 2);
    setTimeout(function () {
      assert.isDefined(cache.get('item1'));
      assert.isDefined(cache.get('item2'));
      cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
      assert.equal(cache.info().maxAge, 10);
      cache.put('item1', 1);
      cache.put('item2', 2);
      // The new items should be removed after 500 ms (the new maxAge)
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'));
        assert.isUndefined(cache.get('item2'));
        cache.put('item1', 1);
        cache.put('item2', 2);
        cache.setOptions({ maxAge: null, deleteOnExpire: 'none', recycleFreq: 20 }, false);
        assert.equal(cache.info().maxAge, Number.MAX_VALUE);
        // The new items should be removed after 500 ms (the new maxAge)
        setTimeout(function () {
          assert.equal(cache.get('item1'), 1);
          assert.isNumber(cache.info('item1').expires);
          assert.equal(cache.get('item2'), 2);
          assert.isNumber(cache.info('item2').expires);

          cache.setOptions({ maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
          cache.put('item1', 1);
          cache.put('item2', 2);
          // The new items should be removed after 500 ms (the new maxAge)
          setTimeout(function () {
            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
            assert.isUndefined(cache.get('item1'));
            assert.isUndefined(cache.get('item2'));

            done();
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  });
  it('should correctly modify the cacheFlushInterval of a cache', function (done) {
    var cache = TestDSCacheFactory('cache');
    assert.isNull(cache.info().cacheFlushInterval);
    cache.setOptions({ cacheFlushInterval: 10 }, false);
    assert.equal(cache.info().cacheFlushInterval, 10);
    cache.put('item1', 1);
    cache.put('item2', 2);
    // The first items should be removed after 2000 ms
    setTimeout(function () {
      assert.isUndefined(cache.get('item1'));
      assert.isUndefined(cache.get('item2'));
      cache.setOptions({ cacheFlushInterval: 20 }, false);
      assert.equal(cache.info().cacheFlushInterval, 20);
      cache.put('item1', 1);
      cache.put('item2', 2);
      // The new items should be removed after 500 ms (the new maxAge)
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'));
        assert.isUndefined(cache.get('item2'));
        cache.setOptions({ cacheFlushInterval: 20 });
        assert.equal(cache.info().cacheFlushInterval, 20);
        cache.put('item1', 1);
        cache.put('item2', 2);
        // The new items should be removed after 500 ms (the new maxAge)
        setTimeout(function () {
          assert.isUndefined(cache.get('item1'));
          assert.isUndefined(cache.get('item2'));

          done();
        }, 100);
      }, 100);
    }, 100);
  });
  it('should correctly modify the deleteOnExpire of a cache', function (done) {
    var cache = TestDSCacheFactory('cache', { maxAge: 10 });
    assert.equal(cache.info().deleteOnExpire, 'none');
    cache.setOptions({ deleteOnExpire: 'passive' });
    assert.equal(cache.info().deleteOnExpire, 'passive');
    cache.put('item1', 1);
    cache.put('item2', 2);
    // The first items should be removed after 2000 ms
    setTimeout(function () {
      assert.isUndefined(cache.get('item1'));
      assert.isUndefined(cache.get('item2'));
      cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
      assert.equal(cache.info().deleteOnExpire, 'aggressive');
      cache.put('item1', 1);
      cache.put('item2', 2);
      // The new items should be removed after 500 ms (the new maxAge)
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'));
        assert.isUndefined(cache.get('item2'));

        done();
      }, 100);
    }, 100);
  });
  it('should correctly set configuration to default when "strict" is true', function () {
    var cache = TestDSCacheFactory('cache', {
      capacity: 10,
      maxAge: 1000,
      cacheFlushInterval: 1000,
      deleteOnExpire: 'aggressive',
      recycleFreq: 20000,
      storageMode: 'localStorage'
    });
    cache.setOptions({}, true);
    var cacheInfo = cache.info();
    assert.equal(cacheInfo.id, 'cache');
    assert.equal(cacheInfo.capacity, Number.MAX_VALUE);
    assert.equal(cacheInfo.size, 0);
    assert.equal(cacheInfo.recycleFreq, 1000);
    assert.equal(cacheInfo.maxAge, Number.MAX_VALUE);
    assert.equal(cacheInfo.cacheFlushInterval, null);
    assert.equal(cacheInfo.deleteOnExpire, 'none');
    // Storage mode is not dynamically configurable
    assert.equal(cacheInfo.storageMode, 'localStorage');
    assert.equal(cacheInfo.onExpire, null);
  });
});
