describe('AngularCache.setOptions()', function () {
  it('should throw an error if "options" is not an object.', function () {
    var cache = $angularCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        cache.setOptions(TYPES_EXCEPT_OBJECT[i]);
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        expect(err.message).toEqual('AngularCache.setOptions(cacheOptions, strict, options): cacheOptions: must be an object!');
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
    var cache = $angularCacheFactory('cache', {
      maxAge: 100,
      cacheFlushInterval: 200,
      onExpire: onExpire,
      storageMode: 'localStorage',
      disabled: true
    });
    expect(cache.info().maxAge).toEqual(100);
    expect(cache.info().cacheFlushInterval).toEqual(200);
    expect(cache.info().onExpire).toEqual(onExpire);
    expect(cache.info().storageMode).toEqual('localStorage');
    expect(cache.info().disabled).toEqual(true);
    cache.setOptions({ }, true);
    expect(cache.info().maxAge).toEqual(null);
    expect(cache.info().cacheFlushInterval).toEqual(null);
    expect(cache.info().onExpire).toEqual(null);
    expect(cache.info().storageMode).toEqual('none');
    expect(cache.info().disabled).toEqual(false);
  });
  it('should correctly modify the capacity of a cache', function () {
    var cache = $angularCacheFactory('cache');
    expect(cache.info().capacity).toEqual(Number.MAX_VALUE);
    cache.setOptions({ capacity: 5 }, false);
    expect(cache.info().capacity).toEqual(5);
    cache.put('item1', 1);
    cache.put('item2', 2);
    cache.put('item3', 3);
    cache.put('item4', 4);
    cache.put('item5', 5);
    cache.put('item6', 6);
    expect(cache.get('item1')).not.toBeDefined();
    waits(50);
    runs(function () {
      cache.get('item2');
      cache.get('item3');
      cache.get('item6');
      cache.setOptions({ capacity: 3 }, false);
      // Least-recently used items over the new capacity should have been removed.
      expect(cache.get('item4')).not.toBeDefined();
      expect(cache.get('item5')).not.toBeDefined();
      expect(cache.info().size).toEqual(3);
    });
  });
  it('should correctly modify the maxAge of a cache', function () {
    var cache = $angularCacheFactory('cache');
    expect(cache.info().maxAge).toEqual(null);
    cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
    expect(cache.info().maxAge).toEqual(10);
    cache.put('item1', 1);
    cache.put('item2', 2);
    waits(100);
    runs(function () {
      expect(cache.get('item1')).not.toBeDefined();
      expect(cache.get('item2')).not.toBeDefined();
      cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
      expect(cache.info().maxAge).toEqual(10);
      cache.put('item1', 1);
      cache.put('item2', 2);
      waits(100);
      // The new items should be removed after 500 ms (the new maxAge)
      runs(function () {
        expect(cache.get('item1')).not.toBeDefined();
        expect(cache.get('item2')).not.toBeDefined();
        cache.put('item1', 1);
        cache.put('item2', 2, { maxAge: 25, deleteOnExpire: 'aggressive' });
        cache.setOptions({ maxAge: null, deleteOnExpire: 'none', recycleFreq: 20 }, false);
        expect(cache.info().maxAge).toEqual(null);
        waits(100);
        // The new items should be removed after 500 ms (the new maxAge)
        runs(function () {
          expect(cache.get('item1')).toEqual(1);
          expect(cache.info('item1').expires).not.toBeDefined();
          expect(cache.get('item2')).not.toBeDefined();
          expect(cache.info('item2')).not.toBeDefined();

          cache.setOptions({ maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
          cache.put('item1', 1);
          cache.put('item2', 2);
          waits(100);
          // The new items should be removed after 500 ms (the new maxAge)
          runs(function () {
            cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive' }, false);
            expect(cache.get('item1')).not.toBeDefined();
            expect(cache.get('item2')).not.toBeDefined();
          });
        });
      });
    });
  });
  it('should correctly modify the cacheFlushInterval of a cache', function () {
    var cache = $angularCacheFactory('cache');
    expect(cache.info().cacheFlushInterval).toEqual(null);
    cache.setOptions({ cacheFlushInterval: 10 }, false);
    expect(cache.info().cacheFlushInterval).toEqual(10);
    cache.put('item1', 1);
    cache.put('item2', 2);
    waits(100);
    // The first items should be removed after 2000 ms
    runs(function () {
      expect(cache.get('item1')).not.toBeDefined();
      expect(cache.get('item2')).not.toBeDefined();
      cache.setOptions({ cacheFlushInterval: 20 }, false);
      expect(cache.info().cacheFlushInterval).toEqual(20);
      cache.put('item1', 1);
      cache.put('item2', 2);
      waits(100);
      // The new items should be removed after 500 ms (the new maxAge)
      runs(function () {
        expect(cache.get('item1')).not.toBeDefined();
        expect(cache.get('item2')).not.toBeDefined();
        cache.setOptions({ cacheFlushInterval: 20 }, false);
        expect(cache.info().cacheFlushInterval).toEqual(20);
        cache.put('item1', 1);
        cache.put('item2', 2);
        waits(100);
        // The new items should be removed after 500 ms (the new maxAge)
        runs(function () {
          expect(cache.get('item1')).not.toBeDefined();
          expect(cache.get('item2')).not.toBeDefined();
        });
      });
    });
  });
  it('should correctly modify the deleteOnExpire of a cache', function () {
    var cache = $angularCacheFactory('cache', { maxAge: 10 });
    expect(cache.info().deleteOnExpire).toEqual('none');
    cache.setOptions({ deleteOnExpire: 'passive' }, false);
    expect(cache.info().deleteOnExpire).toEqual('passive');
    cache.put('item1', 1);
    cache.put('item2', 2);
    waits(100);
    // The first items should be removed after 2000 ms
    runs(function () {
      expect(cache.get('item1')).not.toBeDefined();
      expect(cache.get('item2')).not.toBeDefined();
      cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 }, false);
      expect(cache.info().deleteOnExpire).toEqual('aggressive');
      cache.put('item1', 1);
      cache.put('item2', 2);
      waits(100);
      // The new items should be removed after 500 ms (the new maxAge)
      runs(function () {
        expect(cache.get('item1')).not.toBeDefined();
        expect(cache.get('item2')).not.toBeDefined();
      });
    });
  });
  it('should correctly set configuration to default when "strict" is true', function () {
    var cache = $angularCacheFactory('cache', {
      capacity: 10,
      maxAge: 1000,
      cacheFlushInterval: 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'none'
    });
    cache.setOptions({}, true);
    var cacheInfo = cache.info();
    expect(cacheInfo.id).toEqual('cache');
    expect(cacheInfo.capacity).toEqual(Number.MAX_VALUE);
    expect(cacheInfo.size).toEqual(0);
    expect(cacheInfo.recycleFreq).toEqual(1000);
    expect(cacheInfo.maxAge).toEqual(null);
    expect(cacheInfo.cacheFlushInterval).toEqual(null);
    expect(typeof cacheInfo.recycleFreqId).toEqual('number');
    expect(cacheInfo.deleteOnExpire).toEqual('none');
    expect(cacheInfo.storageMode).toEqual('none');
    expect(cacheInfo.onExpire).toEqual(null);

    cache.setOptions({ recycleFreq: null });
    expect(cache.info().recycleFreq).toEqual(1000);
  });
  it('should correctly switch to using local/session storage when storageMode is activated', function () {
    var cache = $angularCacheFactory('cache'),
      cache2 = $angularCacheFactory('cache2');
    cache.put('item', 'value');
    cache2.put('item', 'value');
    cache.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', storageMode: 'localStorage', recycleFreq: 20 });
    cache2.setOptions({ maxAge: 10, deleteOnExpire: 'aggressive', storageMode: 'sessionStorage', recycleFreq: 20 });

    if (localStorage) {
      expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
    }
    if (sessionStorage) {
      expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
    }
    waits(100);
    runs(function () {
      expect(cache.get('item')).not.toBeDefined();
      expect(cache2.get('item')).not.toBeDefined();
      if (localStorage) {
        expect(localStorage.getItem('angular-cache.caches.cache.data.item')).toEqual(null);
      }
      if (sessionStorage) {
        expect(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).toEqual(null);
      }
    });
  });
  it('should correctly stop using local/session storage when storageMode is deactivated', function () {
    var cache = $angularCacheFactory('cache', { storageMode: 'localStorage' }),
      cache2 = $angularCacheFactory('cache2', { storageMode: 'sessionStorage' });
    cache.put('item', 'value');
    cache2.put('item', 'value');

    if (localStorage) {
      expect(angular.fromJson(localStorage.getItem('angular-cache.caches.cache.data.item')).value).toEqual('value');
    }
    if (sessionStorage) {
      expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).value).toEqual('value');
    }

    cache.setOptions({ storageMode: 'none' }, true);
    cache2.setOptions({ storageMode: 'none' }, true);

    if (localStorage) {
      expect(localStorage.getItem('angular-cache.caches.cache.data.item')).toEqual(null);
    }
    if (sessionStorage) {
      expect(sessionStorage.getItem('angular-cache.caches.cache2.data.item')).toEqual(null);
    }
  });
});
