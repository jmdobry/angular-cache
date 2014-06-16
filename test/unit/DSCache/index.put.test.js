describe('DSCache.put(key, value, options)', function () {
  it('should do nothing if the cache is disabled.', function () {
    var cache = TestDSCacheFactory('DSCache.put.cache', { disabled: true });

    assert.equal(cache.info().size, 0);
    assert.isUndefined(cache.put('1', 'item'));
    assert.equal(cache.info().size, 0);
  });
  it('should throw an error if "key" is not a string.', function () {
    var cache = TestDSCacheFactory('DSCache.put.cache');
    for (var i = 0; i < TYPES_EXCEPT_STRING_OR_NUMBER.length; i++) {
      try {
        cache.put(TYPES_EXCEPT_STRING_OR_NUMBER[i], 'value');
        fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
      } catch (err) {
        assert.equal(err.message, '[ng:areq] Expected key to be a string! Found: ' + typeof TYPES_EXCEPT_STRING_OR_NUMBER[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_STRING_OR_NUMBER[i]);
        continue;
      }
      fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
    }
  });
  it('should not add values that are not defined.', function () {
    var cache = TestDSCacheFactory('cache');
    cache.put('item', null);
    assert.equal(cache.get('item'), undefined);
    cache.put('item', undefined);
    assert.equal(cache.get('item'), undefined);
  });
  it('should increase the size of the cache by one.', function () {
    var cache = TestDSCacheFactory('cache');
    assert.equal(cache.info().size, 0);
    cache.put('item', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item2', 'value2');
    assert.equal(cache.info().size, 2);
  });
  it('should overwrite an item if it is re-added to the cache.', function () {
    var cache = TestDSCacheFactory('cache');
    assert.equal(cache.info().size, 0);
    cache.put('item', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item', 'value2');
    assert.equal(cache.info().size, 1);
    assert.equal(cache.get('item'), 'value2');
  });
  it('should remove the least recently used item if the capacity has been reached.', function () {
    var cache = TestDSCacheFactory('cache', { capacity: 2 });
    assert.equal(cache.info().size, 0);
    cache.put('item1', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item2', 'value2');
    assert.equal(cache.info().size, 2);
    cache.put('item3', 'value3');
    assert.equal(cache.info().size, 2);
    assert.equal(cache.get('item1'), undefined);
    assert.equal(cache.get('item2'), 'value2');
    assert.equal(cache.get('item3'), 'value3');
    cache.get('item2');
    cache.put('item1', 'value1');
    assert.equal(cache.get('item3'), undefined);
    assert.equal(cache.get('item1'), 'value1');
    assert.equal(cache.get('item2'), 'value2');
  });
  it('should not delete items if maxAge is specified and deleteOnExpire is set to "none".', function (done) {
    var cache = TestDSCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'none', recycleFreq: 20 });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.equal(cache.get('item1'), 'value1');
      assert.equal(cache.info('item1').isExpired, true);
      done();
    }, 100);
  });
  it('should remove items if maxAge is specified and deleteOnExpire is set to "aggressive".', function (done) {
    var cache = TestDSCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isUndefined(cache.info('item1'));
      assert.isUndefined(cache.get('item1'));

      done();
    }, 100);
  });
  it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive".', function (done) {
    var cache = TestDSCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired);
      assert.isUndefined(cache.get('item1'));

      done();
    }, 100);
  });
  it('should touch an item.', function (done) {
    var cache = TestDSCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired);
      cache.touch('item1');
      assert.equal(cache.get('item1'), 'value1');

      done();
    }, 100);
  });
  it('should handle normal promises.', function (done) {
    var cache = TestDSCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive', recycleFreq: 20 });
    var deferred = $q.defer();
    cache.put('item1', deferred.promise);
    setTimeout(function () {
      $rootScope.$apply(function () {
        deferred.resolve('value1');
      });
      assert.equal(cache.get('item1'), 'value1');
      setTimeout(function () {
        assert.isUndefined(cache.get('item1'));
        done();
      }, 100);
    }, 100);
  });
  it('should work with $http promises.', function () {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = TestDSCacheFactory('cache', {});
    $http.get('test.com', {
      cache: cache
    }).success(function (data) {
      assert.deepEqual(data, { name: 'John' });
      $http.get('test.com', {
        cache: cache
      }).success(function (data) {
        assert.deepEqual(data, { name: 'John' });
      });
      $rootScope.$safeApply();
    });
    $httpBackend.flush();
  });
  it('should save data to localStorage when storageMode is used.', function () {
    var localStorageCache = TestDSCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
      sessionStorageCache = TestDSCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');

    assert.equal(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')).value, 'value1');
    assert.equal(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '["item1"]');
    assert.equal(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')).value, 'value1');
    assert.equal(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '["item1"]');
  });
});
