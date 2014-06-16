describe('AngularCache.put(key, value, options)', function () {
  it('should do nothing if the cache is disabled.', function () {
    var cache = $angularCacheFactory('cache', { disabled: true });

    expect(cache.info().size).toEqual(0);
    expect(cache.put('1', 'item')).toBeUndefined();
    expect(cache.info().size).toEqual(0);
  });
  it('should throw an error if "key" is not a string.', function () {
    var cache = $angularCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_STRING_OR_NUMBER.length; i++) {
      try {
        cache.put(TYPES_EXCEPT_STRING_OR_NUMBER[i], 'value');
        fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
      } catch (err) {
        expect(err.message).toEqual('AngularCache.put(key, value, options): key: must be a string!');
        continue;
      }
      fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
    }
  });
  it('should throw an error if "options" is not an object.', function () {
    var cache = $angularCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        cache.put('item', 'value', TYPES_EXCEPT_OBJECT[i]);
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        expect(err.message).toEqual('AngularCache.put(key, value, options): options: must be an object!');
        continue;
      }
      if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
        fail(TYPES_EXCEPT_OBJECT[i]);
      }
    }
  });
  it('should throw an error if "maxAge" is not valid.', function () {
    var cache = $angularCacheFactory('cache');
    var maxAge = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      cache.put('item', 'value', { maxAge: maxAge });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('AngularCache.put(key, value, options): maxAge: must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        cache.put('item', 'value', { maxAge: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null && TYPES_EXCEPT_NUMBER[i] !== undefined && TYPES_EXCEPT_NUMBER[i] !== false) {
          fail(TYPES_EXCEPT_NUMBER[i]);
        }
      } catch (err) {
        expect(err.message).toEqual('AngularCache.put(key, value, options): maxAge: must be a number!');
        continue;
      }
      if (TYPES_EXCEPT_NUMBER[i] !== null && TYPES_EXCEPT_NUMBER[i] !== undefined && TYPES_EXCEPT_NUMBER[i] !== false) {
        fail(TYPES_EXCEPT_NUMBER[i]);
      }
    }
  });
  it('should throw an error if "deleteOnExpire" is not valid.', function () {
    var cache = $angularCacheFactory('cache');
    var deleteOnExpire = 'fail';
    try {
      cache.put('item', 'value', { deleteOnExpire: deleteOnExpire });
      fail('should not reach this!');
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('AngularCache.put(key, value, options): deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      try {
        cache.put('item', 'value', { deleteOnExpire: TYPES_EXCEPT_STRING[i] });
        if (TYPES_EXCEPT_STRING[i] !== null && TYPES_EXCEPT_STRING[i] !== undefined && TYPES_EXCEPT_STRING[i] !== false) {
          fail(TYPES_EXCEPT_STRING[i]);
        }
      } catch (err) {
        expect(err.message).toEqual('AngularCache.put(key, value, options): deleteOnExpire: must be a string!');
        continue;
      }
      if (TYPES_EXCEPT_STRING[i] !== null && TYPES_EXCEPT_STRING[i] !== undefined && TYPES_EXCEPT_STRING[i] !== false) {
        fail(TYPES_EXCEPT_STRING[i]);
      }
    }
  });
  it('should not add values that are not defined.', function () {
    var cache = $angularCacheFactory('cache');
    cache.put('item', null);
    expect(cache.get('item')).toEqual(undefined);
    cache.put('item', undefined);
    expect(cache.get('item')).toEqual(undefined);
  });
  it('should increase the size of the cache by one.', function () {
    var cache = $angularCacheFactory('cache');
    expect(cache.info().size).toEqual(0);
    cache.put('item', 'value1');
    expect(cache.info().size).toEqual(1);
    cache.put('item2', 'value2');
    expect(cache.info().size).toEqual(2);
  });
  it('should overwrite an item if it is re-added to the cache.', function () {
    var cache = $angularCacheFactory('cache');
    expect(cache.info().size).toEqual(0);
    cache.put('item', 'value1');
    expect(cache.info().size).toEqual(1);
    cache.put('item', 'value2');
    expect(cache.info().size).toEqual(1);
    expect(cache.get('item')).toEqual('value2');
  });
  it('should remove the least recently used item if the capacity has been reached.', function () {
    var cache = $angularCacheFactory('cache', { capacity: 2 });
    expect(cache.info().size).toEqual(0);
    cache.put('item1', 'value1');
    expect(cache.info().size).toEqual(1);
    cache.put('item2', 'value2');
    expect(cache.info().size).toEqual(2);
    cache.put('item3', 'value3');
    expect(cache.info().size).toEqual(2);
    expect(cache.get('item1')).toEqual(undefined);
    expect(cache.get('item2')).toEqual('value2');
    expect(cache.get('item3')).toEqual('value3');
    cache.get('item2');
    cache.put('item1', 'value1');
    expect(cache.get('item3')).toEqual(undefined);
    expect(cache.get('item1')).toEqual('value1');
    expect(cache.get('item2')).toEqual('value2');
  });
  it('should not delete items if maxAge is specified and deleteOnExpire is set to "none".', function () {
    var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'none', recycleFreq: 20 });
    cache.put('item1', 'value1');
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.get('item1')).toEqual('value1');
      expect(cache.info('item1').isExpired).toEqual(true);
    });
  });
  it('should remove items if maxAge is specified and deleteOnExpire is set to "aggressive".', function () {
    var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 });
    cache.put('item1', 'value1');
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.info('item1')).not.toBeDefined();
      expect(cache.get('item1')).not.toBeDefined();
    });
  });
  it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive".', function () {
    var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
    cache.put('item1', 'value1');
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.info('item1').isExpired).toEqual(true);
      expect(cache.get('item1')).not.toBeDefined();
    });
  });
  it('should not delete items if maxAge is specified and deleteOnExpire is set to "none" for an item.', function () {
    var cache = $angularCacheFactory('cache');
    cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'none' });
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.get('item1')).toEqual('value1');
      expect(cache.info('item1').isExpired).toEqual(true);
    });
  });
  it('should remove an item if maxAge for item is specified and deleteOnExpire is set to "aggressive".', function () {
    var cache = $angularCacheFactory('cache', { recycleFreq: 10 });
    cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'aggressive' });
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.info('item1')).not.toBeDefined();
      expect(cache.get('item1')).not.toBeDefined();
    });
  });
  it('should passively expire an item if maxAge for the item is specified and deleteOnExpire is set to "passive".', function () {
    var cache = $angularCacheFactory('cache');
    cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'passive' });
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.info('item1').isExpired).toEqual(true);
      expect(cache.get('item1')).toEqual(undefined);
    });
  });
  it('maxAge for a specific item should override maxAge for the cache.', function () {
    var cache = $angularCacheFactory('cache', { maxAge: 1000, deleteOnExpire: 'aggressive', recycleFreq: 20 });
    cache.put('item1', 'value1', { maxAge: 5 });
    expect(cache.info('item1').maxAge).toEqual(5);
    expect(cache.get('item1')).toEqual('value1');
    waits(100);
    runs(function () {
      expect(cache.get('item1')).toEqual(undefined);
    });
  });
  it('deleteOnExpire set to "passive" for a specific item should override deleteOnExpire set to "aggressive" for the cache.', function () {
    var cache = $angularCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive' });
    cache.put('item1', 'value1', { maxAge: 10, deleteOnExpire: 'passive' });
    expect(cache.get('item1')).toEqual('value1');
    expect(cache.info('item1').deleteOnExpire).toEqual("passive");
    waits(100);
    runs(function () {
      expect(cache.info('item1').isExpired).toEqual(true);
      expect(cache.get('item1')).toEqual(undefined);
    });
  });
  it('should work with normal promises.', function () {
    var cache = $angularCacheFactory('cache', {
      maxAge: 10,
      deleteOnExpire: 'aggressive',
      recycleFreq: 20
    });
    var deferred = $q.defer();
    cache.put('item1', deferred.promise);
    waits(100);
    runs(function () {
      $rootScope.$apply(function () {
        deferred.resolve('value1');
      });
      $rootScope.$apply(function () {
        expect(cache.get('item1')).toEqual('value1');
        waits(100);
        runs(function () {
          expect(cache.get('item1')).toBeUndefined();
        });
      });
    });
  });
  it('should work with $http promises.', function () {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = $angularCacheFactory('cache', {});
    $http.get('test.com', {
      cache: cache
    }).success(function (data) {
      expect(data).toEqual({ name: 'John' });
      $http.get('test.com', {
        cache: cache
      }).success(function (data) {
        expect(data).toEqual({ name: 'John' });
      });
      $rootScope.$safeApply();
    });
    $httpBackend.flush();
  });
  it('should save data to localStorage when storageMode is used.', function () {
    var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
      sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');

    if (localStorage) {
      expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
      expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1"]');
    }
    if (sessionStorage) {
      expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
      expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1"]');
    }
  });
});
