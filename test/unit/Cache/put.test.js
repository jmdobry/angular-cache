describe('Cache#put', function () {
  it('should handle normal promises.', function (done) {
    const cache = cacheFactory.createCache('cache', {
      maxAge: 10,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storeOnResolve: true,
      storeOnReject: true
    })
    const deferred = $q.defer()
    const item = cache.put('item1', deferred.promise)
    assert.equal(typeof item.then, 'function')
    assert.equal(typeof cache.get('item1').then, 'function')
    setTimeout(() => {
      try {
        $rootScope.$apply(() => {
          deferred.resolve('value1')
        })
        assert.equal(cache.get('item1'), 'value1')
        setTimeout(() => {
          assert.isUndefined(cache.get('item1'))
          done()
        }, 100)
      } catch (err) {
        done(err)
      }
    }, 100)
  })

  it('should handle normal promises using localStorage.', function (done) {
    const cache = cacheFactory.createCache(testId, {
      maxAge: 10,
      deleteOnExpire: 'passive',
      recycleFreq: 20,
      storageMode: 'localStorage',
      storeOnResolve: true,
      storeOnReject: true
    })
    const deferred = $q.defer()
    const item = cache.put('item1', deferred.promise)
    assert.equal(typeof item.then, 'function')
    assert.equal(typeof cache.get('item1').then, 'function')
    setTimeout(() => {
      try {
        $rootScope.$apply(() => {
          deferred.resolve('value1')
        })
        assert.equal(cache.get('item1'), 'value1')
        setTimeout(() => {
          assert.isUndefined(cache.get('item1'))
          done()
        }, 100)
      } catch (err) {
        done(err)
      }
    }, 100)
  })

  it('should work with $http promises.', function (done) {
    $httpBackend.expectGET(testId + '.com').respond({ name: 'John' })
    const cache = cacheFactory.createCache(testId, {
      storeOnResolve: true,
      storeOnReject: true
    })
    $http.get(testId + '.com', {
      cache: cache
    }).then((data) => {
      assert.deepEqual(data.data, { name: 'John' })
      $http.get(testId + '.com', {
        cache: cache
      }).then((data) => {
        assert.deepEqual(data.data, { name: 'John' })
      })
      $rootScope.$safeApply()
      assert.equal(cache.get(testId + '.com')[0], 200)
      assert.deepEqual(cache.get(testId + '.com')[1], { name: 'John' })
      done()
    })
    $httpBackend.flush()
  })

  it('should work with $http promises when storeOnResolve is false.', function () {
    $httpBackend.expectGET(testId + '.com').respond({ name: 'John' })
    const cache = cacheFactory.createCache(testId, { storeOnReject: true })
    $http.get(testId + '.com', {
      cache: cache
    }).then((data) => {
      assert.deepEqual(data.data, { name: 'John' })
      $rootScope.$safeApply()
      assert.equal(cache.get(testId + '.com')[0], 200)
      assert.deepEqual(cache.get(testId + '.com')[1], { name: 'John' })
    })
    $httpBackend.flush()
  })

  it('should work with promises when storeOnResolve is true.', function (done) {
    const deferred = $q.defer()
    const cache = cacheFactory.createCache(testId, {
      storeOnResolve: true
    })
    cache.put('test', deferred.promise)
    deferred.resolve('value')
    $rootScope.$safeApply()
    setTimeout(() => {
      assert.equal(cache.get('test'), 'value')
      done()
    }, 30)
  })

  it('should work with rejected $http promises when storeOnReject and storeOnResolve are false.', function (done) {
    $httpBackend.expectGET(testId + '.com').respond(404, 'Not Found')
    const cache = cacheFactory.createCache(testId, {})
    $http.get(testId + '.com', {
      cache: cache
    }).then(() => {
      done('Should not have succeeded')
    }, (data) => {
      assert.deepEqual(data.data, 'Not Found')
      // should not have cached the 404
      $httpBackend.expectGET(testId + '.com').respond(200, { test: 'data' })
      $http.get(testId + '.com', {
        cache: cache
      }).then((data) => {
        assert.deepEqual(data.data, { test: 'data' })
        done()
      }, (data) => {
        done('Should not have failed')
      })
    })
    $httpBackend.flush()
  })

  it('should work with rejected $http promises when storeOnReject and storeOnResolve are false and using localStorage.', function (done) {
    $httpBackend.expectGET(testId + '.com').respond(404, 'Not Found')
    const cache = cacheFactory.createCache(testId, {
      storageMode: 'localStorage'
    })
    $http.get(testId + '.com', {
      cache: cache
    }).then((response) => {
      done('Should not have succeeded')
    }, (data) => {
      assert.deepEqual(data.data, 'Not Found')
      // should not have cached the 404
      $httpBackend.expectGET(testId + '.com').respond(200, { test: 'data' })
      $http.get(testId + '.com', {
        cache: cache
      }).then((data) => {
        assert.deepEqual(data.data, { test: 'data' })
        done()
      }, (data) => {
        done('Should not have failed')
      })
    })
    $httpBackend.flush()
  })

  it('should work with rejected promises when storeOnReject is false.', function (done) {
    const deferred = $q.defer()
    const cache = cacheFactory.createCache(testId, { storeOnResolve: true })
    cache.put('test', deferred.promise)
    deferred.reject('error')
    $rootScope.$safeApply()
    setTimeout(() => {
      assert.equal(typeof cache.get('test').then, 'function')
      done()
    }, 30)
  })

  it('should work with rejected promises.', function (done) {
    const deferred = $q.defer()
    const cache = cacheFactory.createCache(testId, {
      storeOnResolve: true,
      storeOnReject: true
    })
    cache.put('test', deferred.promise)
    deferred.reject('error')
    $rootScope.$safeApply()
    setTimeout(() => {
      assert.equal(cache.get('test'), 'error')
      done()
    }, 30)
  })

  it('should work with $http promises using localStorage.', function (done) {
    $httpBackend.expectGET(testId + '.com').respond({ name: 'John' })
    const cache = cacheFactory.createCache(testId, {
      storeOnResolve: true,
      storeOnReject: true,
      storageMode: 'localStorage'
    })
    $http.get(testId + '.com', {
      cache: cache
    }).then((data) => {
      assert.deepEqual(data.data, { name: 'John' })
      $http.get(testId + '.com', {
        cache: cache
      }).then((data) => {
        assert.deepEqual(data.data, { name: 'John' })
        done()
      }, done)
      $rootScope.$safeApply()
    }, done)
    $httpBackend.flush()
  })

  it('should work with $http promises with multiple requests.', function (done) {
    $httpBackend.expectGET(testId + '.com').respond({ name: 'John' })
    const cache = cacheFactory.createCache(testId, {
      storeOnResolve: true,
      storeOnReject: true
    })
    $http.get(testId + '.com', {
      cache: cache
    })
    $rootScope.$safeApply()
    assert.deepEqual(cache.keys(), [testId + '.com'])
    setTimeout(() => {
      try {
        $rootScope.$safeApply()
        const promise = cache.get(testId + '.com')
        assert.equal(typeof promise.then, 'function')
        $http.get(testId + '.com', {
          cache: cache
        })
        $rootScope.$safeApply()
        assert.deepEqual(cache.keys(), [testId + '.com'])
        assert.isTrue(promise === cache.get(testId + '.com'))
        $httpBackend.flush()
        setTimeout(() => {
          assert.deepEqual(cache.get(testId + '.com'), { name: 'John' })
          done()
        }, 20)
      } catch (err) {
        done(err)
      }
    }, 20)
  })

  it('should work with $http promises with multiple requests using localStorage.', function (done) {
    $httpBackend.expectGET(testId + '.com').respond({ name: 'John' })
    const cache = cacheFactory.createCache(testId, {
      storageMode: 'localStorage',
      storeOnResolve: true,
      storeOnReject: true
    })
    $http.get(testId + '.com', {
      cache: cache
    })
    assert.deepEqual(cache.keys(), [])
    setTimeout(() => {
      $http.get(testId + '.com', {
        cache: cache
      })
      assert.deepEqual(cache.keys(), [])
      setTimeout(() => {
        $http.get(testId + '.com', {
          cache: cache
        })
        assert.deepEqual(cache.keys(), [])
        $httpBackend.flush()
        assert.deepEqual(cache.keys(), [testId + '.com'])
        done()
      }, 20)
    }, 20)
  })
})
