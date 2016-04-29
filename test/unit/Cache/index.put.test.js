describe('Cache#put(key, value[, options])', function () {
  it('should do nothing if the cache is disabled.', function () {
    var cache = TestCacheFactory('DSCache.put.cache', { disabled: true });

    assert.equal(cache.info().size, 0);
    assert.isUndefined(cache.put('1', 'item'));
    assert.equal(cache.info().size, 0);
  });
  it('should throw an error if "key" is not a string.', function () {
    var cache = TestCacheFactory('DSCache.put.cache');
    for (var i = 0; i < TYPES_EXCEPT_STRING_OR_NUMBER.length; i++) {
      try {
        cache.put(TYPES_EXCEPT_STRING_OR_NUMBER[i], 'value');
        fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
      } catch (err) {
        assert.equal(err.message, 'key must be a string!');
        continue;
      }
      fail(TYPES_EXCEPT_STRING_OR_NUMBER[i]);
    }
  });
  it('should not add values that are not defined.', function () {
    var cache = TestCacheFactory('cache');
    cache.put('item', null);
    assert.equal(cache.get('item'), undefined);
    cache.put('item', undefined);
    assert.equal(cache.get('item'), undefined);
  });
  it('should increase the size of the cache by one.', function () {
    var cache = TestCacheFactory('cache');
    assert.equal(cache.info().size, 0);
    cache.put('item', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item2', 'value2');
    assert.equal(cache.info().size, 2);
  });
  it('should overwrite an item if it is re-added to the cache.', function () {
    var cache = TestCacheFactory('cache');
    assert.equal(cache.info().size, 0);
    cache.put('item', 'value1');
    assert.equal(cache.info().size, 1);
    cache.put('item', 'value2');
    assert.equal(cache.info().size, 1);
    assert.equal(cache.get('item'), 'value2');
  });
  it('should remove the least recently used item if the capacity has been reached.', function () {
    var cache = TestCacheFactory('cache', { capacity: 2 });
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
    var cache = TestCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'none', recycleFreq: 20 });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.equal(cache.get('item1'), 'value1');
      assert.equal(cache.info('item1').isExpired, true);
      done();
    }, 100);
  });
  it('should remove items if maxAge is specified and deleteOnExpire is set to "aggressive".', function (done) {
    var cache = TestCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'aggressive', recycleFreq: 20 });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isUndefined(cache.info('item1'));
      assert.isUndefined(cache.get('item1'));

      done();
    }, 100);
  });
  it('should should lazy delete an item when maxAge is specified and deleteOnExpire is set to "passive".', function (done) {
    var cache = TestCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
    cache.put('item1', 'value1');
    assert.equal(cache.get('item1'), 'value1');
    setTimeout(function () {
      assert.isTrue(cache.info('item1').isExpired);
      assert.isUndefined(cache.get('item1'));

      done();
    }, 100);
  });
  it('should touch an item.', function (done) {
    var cache = TestCacheFactory('cache', { maxAge: 10, deleteOnExpire: 'passive' });
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
    var cache = TestCacheFactory('cache', {
      maxAge: 10,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storeOnResolve: true,
      storeOnReject: true
    });
    var deferred = $q.defer();
    var item = cache.put('item1', deferred.promise);
    assert.equal(typeof item.then, 'function');
    assert.equal(typeof cache.get('item1').then, 'function');
    setTimeout(function () {
      try {
        $rootScope.$apply(function () {
          deferred.resolve('value1');
        });
        assert.equal(cache.get('item1'), 'value1');
        setTimeout(function () {
          assert.isUndefined(cache.get('item1'));
          done();
        }, 100);
      } catch (err) {
        done(err);
      }
    }, 100);
  });
  it('should handle normal promises using localStorage.', function (done) {
    var cache = TestCacheFactory('cache', {
      maxAge: 10,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storageMode: 'localStorage',
      storeOnResolve: true,
      storeOnReject: true
    });
    var deferred = $q.defer();
    var item = cache.put('item1', deferred.promise);
    assert.equal(typeof item.then, 'function');
    assert.equal(typeof cache.get('item1').then, 'function');
    setTimeout(function () {
      try {
        $rootScope.$apply(function () {
          deferred.resolve('value1');
        });
        assert.equal(cache.get('item1'), 'value1');
        setTimeout(function () {
          assert.isUndefined(cache.get('item1'));
          done();
        }, 100);
      } catch (err) {
        done(err);
      }
    }, 100);
  });
  it('should work with $http promises.', function (done) {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = TestCacheFactory('cache', {
      storeOnResolve: true,
      storeOnReject: true
    });
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
      assert.equal(cache.get('test.com')[0], 200);
      assert.deepEqual(cache.get('test.com')[1], { name: 'John' });
      done();
    });
    $httpBackend.flush();
  });
  it('should work with $http promises when storeOnResolve is false.', function () {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = TestCacheFactory('cache', { storeOnReject: true });
    $http.get('test.com', {
      cache: cache
    }).success(function (data) {
      assert.deepEqual(data, { name: 'John' });
      $rootScope.$safeApply();
      assert.equal(cache.get('test.com')[0], 200);
      assert.deepEqual(cache.get('test.com')[1], { name: 'John' });
    });
    $httpBackend.flush();
  });
  it('should work with promises when storeOnResolve is true.', function (done) {
    var deferred = $q.defer();
    var cache = TestCacheFactory('cache', {
      storeOnResolve: true
    });
    cache.put('test', deferred.promise);
    deferred.resolve('value');
    $rootScope.$safeApply();
    setTimeout(function () {
      assert.equal(cache.get('test'), 'value');
      done();
    }, 30);
  });
  it('should work with rejected $http promises when storeOnReject and storeOnResolve are false.', function (done) {
    $httpBackend.expectGET('test.com').respond(404, 'Not Found');
    var cache = TestCacheFactory('cache', {});
    $http.get('test.com', {
      cache: cache
    }).success(function () {
      done('Should not have succeeded');
    }).error(function (data) {
      assert.deepEqual(data, 'Not Found');
      // should not have cached the 404
      $httpBackend.expectGET('test.com').respond(200, { test: 'data' });
      $http.get('test.com', {
        cache: cache
      }).success(function (data) {
        assert.deepEqual(data, { test: 'data' });
        done();
      }).error(function (data) {
        console.log(data);
        done('Should not have failed');
      });
      //$httpBackend.flush();
    });
    $httpBackend.flush();
  });
  it('should work with rejected $http promises when storeOnReject and storeOnResolve are false and using localStorage.', function (done) {
    $httpBackend.expectGET('test.com').respond(404, 'Not Found');
    var cache = TestCacheFactory('cache', {
      storageMode: 'localStorage'
    });
    $http.get('test.com', {
      cache: cache
    }).success(function () {
      done('Should not have succeeded');
    }).error(function (data) {
      assert.deepEqual(data, 'Not Found');
      // should not have cached the 404
      $httpBackend.expectGET('test.com').respond(200, { test: 'data' });
      $http.get('test.com', {
        cache: cache
      }).success(function (data) {
        assert.deepEqual(data, { test: 'data' });
        done();
      }).error(function (data) {
        console.log(data);
        done('Should not have failed');
      });
      //$httpBackend.flush();
    });
    $httpBackend.flush();
  });
  it('should work with rejected promises when storeOnReject is false.', function (done) {
    var deferred = $q.defer();
    var cache = TestCacheFactory('cache', { storeOnResolve: true });
    cache.put('test', deferred.promise);
    deferred.reject('error');
    $rootScope.$safeApply();
    setTimeout(function () {
      assert.equal(typeof cache.get('test').then, 'function');
      done();
    }, 30);
  });
  it('should work with rejected promises.', function (done) {
    var deferred = $q.defer();
    var cache = TestCacheFactory('cache', {
      storeOnResolve: true,
      storeOnReject: true
    });
    cache.put('test', deferred.promise);
    deferred.reject('error');
    $rootScope.$safeApply();
    setTimeout(function () {
      assert.equal(cache.get('test'), 'error');
      done();
    }, 30);
  });
  it('should work with $http promises using localStorage.', function (done) {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = TestCacheFactory('cache', {
      storeOnResolve: true,
      storeOnReject: true,
      storageMode: 'localStorage'
    });
    $http.get('test.com', {
      cache: cache
    }).success(function (data) {
      assert.deepEqual(data, { name: 'John' });
      $http.get('test.com', {
        cache: cache
      }).success(function (data) {
        assert.deepEqual(data, { name: 'John' });
        done();
      }).error(done);
      $rootScope.$safeApply();
    }).error(done);
    $httpBackend.flush();
  });
  it('should work with $http promises with multiple requests.', function (done) {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = TestCacheFactory('cache', {
      storeOnResolve: true,
      storeOnReject: true
    });
    $http.get('test.com', {
      cache: cache
    });
    $rootScope.$safeApply();
    assert.deepEqual(cache.keys(), ['test.com']);
    setTimeout(function () {
      try {
        $rootScope.$safeApply();
        var promise = cache.get('test.com');
        assert.equal(typeof promise.then, 'function');
        $http.get('test.com', {
          cache: cache
        });
        $rootScope.$safeApply();
        assert.deepEqual(cache.keys(), ['test.com']);
        assert.isTrue(promise === cache.get('test.com'));
        setTimeout(function () {
          try {
            $http.get('test.com', {
              cache: cache
            });
            $rootScope.$safeApply();
            assert.deepEqual(cache.keys(), ['test.com']);
            assert.isTrue(promise === cache.get('test.com'));
            $httpBackend.flush();
            assert.deepEqual(cache.keys(), ['test.com']);
            done();
          } catch (err) {
            done(err);
          }
        }, 20);
      } catch (err) {
        done(err);
      }
    }, 20);
  });
  it('should work with $http promises with multiple requests using localStorage.', function (done) {
    $httpBackend.expectGET('test.com').respond({ name: 'John' });
    var cache = TestCacheFactory('cache', {
      storageMode: 'localStorage',
      storeOnResolve: true,
      storeOnReject: true
    });
    $http.get('test.com', {
      cache: cache
    });
    assert.deepEqual(cache.keys(), []);
    setTimeout(function () {
      $http.get('test.com', {
        cache: cache
      });
      assert.deepEqual(cache.keys(), []);
      setTimeout(function () {
        $http.get('test.com', {
          cache: cache
        });
        assert.deepEqual(cache.keys(), []);
        $httpBackend.flush();
        assert.deepEqual(cache.keys(), ['test.com']);
        done();
      }, 20);
    }, 20);
  });
  it('should save data to localStorage when storageMode is used.', function () {
    var localStorageCache = TestCacheFactory('localStorageCache', { storageMode: 'localStorage' });
    var sessionStorageCache = TestCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');

    assert.equal(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')).value, 'value1');
    assert.equal(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '["item1"]');
    assert.equal(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')).value, 'value1');
    assert.equal(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '["item1"]');
  });
});
