describe('CacheFactory(cacheId, options)', function () {
  it('should be able to create a default cache.', function () {
    var cache = TestCacheFactory('CacheFactory.cache');
    assert.isDefined(cache);
    assert.equal(cache.info().id, 'CacheFactory.cache');
    assert.equal(cache.info().capacity, CACHE_DEFAULTS.capacity);
    assert.equal(cache.info().maxAge, CACHE_DEFAULTS.maxAge);
    assert.equal(cache.info().cacheFlushInterval, CACHE_DEFAULTS.cacheFlushInterval);
    assert.equal(cache.info().deleteOnExpire, CACHE_DEFAULTS.deleteOnExpire);
    assert.equal(cache.info().onExpire, CACHE_DEFAULTS.onExpire);
    assert.equal(cache.info().recycleFreq, CACHE_DEFAULTS.recycleFreq);
    assert.equal(cache.info().storageMode, CACHE_DEFAULTS.storageMode);
    assert.equal(cache.info().storageImpl, CACHE_DEFAULTS.storageImpl);
  });
  it('should work with ngResource.', function () {
    var cache = TestCacheFactory('CacheFactory.cache');
    cache.put('test', 'value');
    assert.equal(cache.get('test'), 'value');
    var copyCache = angular.copy(cache);
    assert.equal(copyCache.get('test'), 'value');
    $httpBackend.expectGET('/api/card').respond(200, {
      username: 'test'
    });
    var CreditCard = $resource(
      '/api/card',
      null,
      { charge: { method: 'GET', cache: cache } }
    );
    var card = new CreditCard();
    card.$charge();
    $httpBackend.flush();
    card.$charge().then();
  });
  it('should be able to create a cache with options.', function () {
    var options = {
      capacity: Math.floor((Math.random() * 100000) + 1),
      maxAge: Math.floor((Math.random() * 100000) + 1),
      cacheFlushInterval: Math.floor((Math.random() * 100000) + 1),
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage',
      storageImpl: {
        setItem: function () {
        },
        getItem: function () {
        },
        removeItem: function () {
        }
      },
      recycleFreq: 2000,
      onExpire: function () {
      }
    };
    var cache = TestCacheFactory('CacheFactory.cache', options);
    assert.isDefined(cache);
    assert.equal(cache.info().id, 'CacheFactory.cache');
    assert.equal(cache.info().capacity, options.capacity);
    assert.equal(cache.info().maxAge, options.maxAge);
    assert.equal(cache.info().cacheFlushInterval, options.cacheFlushInterval);
    assert.equal(cache.info().deleteOnExpire, options.deleteOnExpire);
    assert.equal(cache.info().storageMode, options.storageMode);
    assert.equal(cache.info().storageImpl, options.storageImpl);
    assert.equal(cache.info().onExpire, options.onExpire);
  });
  it('should not use localStorage if it is not available.', function () {
    function setItem() {
      throw new Error();
    }

    var options = {
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    };
    var orig = localStorage.setItem;
    localStorage.setItem = setItem;
    if (localStorage.setItem === setItem) {
      var cache = TestCacheFactory('CacheFactory.cache', options);
      assert.isDefined(cache);
      assert.equal(cache.info().id, 'CacheFactory.cache');
      assert.equal(cache.info().deleteOnExpire, options.deleteOnExpire);
      assert.equal(cache.info().storageMode, 'memory');
      assert.isUndefined(cache.info().storageImpl);
      localStorage.setItem = orig;
    } else {
      console.log('skipping because Firefox!');
    }
  });
  it('should not use sessionStorage if it is not available.', function () {
    function setItem() {
      throw new Error();
    }

    var options = {
      deleteOnExpire: 'aggressive',
      storageMode: 'sessionStorage'
    };
    var orig = sessionStorage.setItem;
    sessionStorage.setItem = setItem;
    if (sessionStorage.setItem === setItem) {
      var cache = TestCacheFactory('CacheFactory.cache', options);
      assert.isDefined(cache);
      assert.equal(cache.info().id, 'CacheFactory.cache');
      assert.equal(cache.info().deleteOnExpire, options.deleteOnExpire);
      assert.equal(cache.info().storageMode, 'memory');
      assert.isUndefined(cache.info().storageImpl);
      sessionStorage.setItem = orig;
    } else {
      console.log('skipping because Firefox!');
    }
  });
  it('should throw an exception if "capacity" is not a number or is less than zero.', function () {
    var capacity = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      TestCacheFactory('capacityCache99', { capacity: capacity });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'capacity must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      if (TYPES_EXCEPT_NUMBER[i] === null) {
        continue;
      }
      try {
        TestCacheFactory('capacityCache' + i, { capacity: TYPES_EXCEPT_NUMBER[i] });
        fail();
      } catch (err) {
        assert.equal(err.message, 'capacity must be a number!');
        continue;
      }
      fail();
    }
  });
  it('should validate maxAge.', function () {
    var maxAge = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      TestCacheFactory('maxAgeCache99', { maxAge: maxAge });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'maxAge must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        TestCacheFactory('maxAgeCache' + i, { maxAge: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null) {
          fail(TYPES_EXCEPT_NUMBER[i]);
        }
      } catch (err) {
        assert.equal(err.message, 'maxAge must be a number!');
        continue;
      }
      if (TYPES_EXCEPT_NUMBER[i] !== null) {
        fail(TYPES_EXCEPT_NUMBER[i]);
      }
    }
  });
  it('should validate cacheFlushInterval.', function () {
    var cacheFlushInterval = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      TestCacheFactory('cacheFlushIntervalCache99', { cacheFlushInterval: cacheFlushInterval });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'cacheFlushInterval must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        TestCacheFactory('cacheFlushIntervalCache' + i, { cacheFlushInterval: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null) {
          fail();
        }
      } catch (err) {
        assert.equal(err.message, 'cacheFlushInterval must be a number!');
        continue;
      }
      if (TYPES_EXCEPT_NUMBER[i] !== null) {
        fail();
      }
    }
  });
  it('should validate recycleFreq.', function () {
    var recycleFreq = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      TestCacheFactory('recycleFreqCache99', { recycleFreq: recycleFreq });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'recycleFreq must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        TestCacheFactory('recycleFreqCache' + i, { recycleFreq: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null) {
          fail();
        }
      } catch (err) {
        assert.equal(err.message, 'recycleFreq must be a number!');
        continue;
      }
      if (TYPES_EXCEPT_NUMBER[i] !== null) {
        fail();
      }
    }
  });
  it('should validate onExpire.', function () {
    var onExpire = 234;
    try {
      TestCacheFactory('onExpireCache99', { onExpire: onExpire });
      assert.equal('should not reach this!', false);
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'onExpire must be a function!');
    for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
      try {
        if (TYPES_EXCEPT_FUNCTION[i]) {
          TestCacheFactory('onExpireCache' + i, { onExpire: TYPES_EXCEPT_FUNCTION[i] });
        } else {
          continue;
        }
      } catch (err) {
        assert.equal(err.message, 'onExpire must be a function!');
        continue;
      }
      if (TYPES_EXCEPT_FUNCTION[i] !== null) {
        fail();
      }
    }
  });
  it('should validate deleteOnExpire.', function () {
    var deleteOnExpire = 'fail';
    try {
      TestCacheFactory('cache', { deleteOnExpire: deleteOnExpire });
      fail('should not reach this!');
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'deleteOnExpire must be "none", "passive" or "aggressive"!');
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      if (TYPES_EXCEPT_STRING[i] === null) {
        continue;
      }
      try {
        TestCacheFactory('deleteOnExpireCache' + i, { deleteOnExpire: TYPES_EXCEPT_STRING[i] });
        fail(TYPES_EXCEPT_STRING[i]);
      } catch (err) {
        assert.equal(err.message, 'deleteOnExpire must be a string!');
        continue;
      }
      fail(TYPES_EXCEPT_STRING[i]);
    }
  });
  it('should validate storageMode.', function () {
    var storageMode = 'fail';
    try {
      TestCacheFactory('cache', { storageMode: storageMode });
      assert.equal('should not reach this!', false);
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'storageMode must be "memory", "localStorage" or "sessionStorage"!');
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      if (!TYPES_EXCEPT_STRING[i]) {
        continue;
      }
      try {
        TestCacheFactory('storageModeCache' + i, { storageMode: TYPES_EXCEPT_STRING[i] });
        fail(TYPES_EXCEPT_STRING[i]);
      } catch (err) {
        assert.equal(err.message, 'storageMode must be a string!');
        continue;
      }
      fail(TYPES_EXCEPT_STRING[i]);
    }
  });
  it('should validate storageImpl.', function () {
    var storageImpl = 'fail';
    try {
      TestCacheFactory('cache', { storageMode: 'localStorage', storageImpl: storageImpl });
      assert.equal('should not reach this!', false);
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'storageImpl must be an object!');
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        TestCacheFactory('storageImplCache' + i, { storageMode: 'localStorage', storageImpl: TYPES_EXCEPT_OBJECT[i] });
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        assert.equal(err.message, 'storageImpl must be an object!');
        continue;
      }
      if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
        fail(TYPES_EXCEPT_OBJECT[i]);
      }
    }
    try {
      storageImpl = {
        getItem: function () {
        },
        removeItem: function () {
        }
      };
      TestCacheFactory('storageImplCache-noSetItem', {
        storageMode: 'localStorage',
        storageImpl: storageImpl
      });
      fail();
    } catch (err) {
      assert.equal(err.message, 'storageImpl must implement "setItem(key, value)"!');
    }
    try {
      storageImpl = {
        setItem: function () {
        },
        removeItem: function () {
        }
      };
      TestCacheFactory('storageImplCache-noGetItem', {
        storageMode: 'localStorage',
        storageImpl: storageImpl
      });
      fail();
    } catch (err) {
      assert.equal(err.message, 'storageImpl must implement "getItem(key)"!');
    }
    try {
      storageImpl = {
        getItem: function () {
        },
        setItem: function () {
        }
      };
      TestCacheFactory('storageImplCache-noRemoveItem', {
        storageMode: 'localStorage',
        storageImpl: storageImpl
      });
      fail();
    } catch (err) {
      assert.equal(err.message, 'storageImpl must implement "removeItem(key)"!');
    }
  });
  it('should prevent a cache from being duplicated.', function () {
    try {
      TestCacheFactory('cache');
      TestCacheFactory('cache');
    } catch (err) {
      var msg = err.message;
    }
    assert.equal(msg, 'cache already exists!');
  });
  it('should require cacheId to be a string.', function () {
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      try {
        TestCacheFactory(TYPES_EXCEPT_STRING[i]);
        fail(TYPES_EXCEPT_STRING[i]);
      } catch (err) {
        assert.equal(err.message, 'cacheId must be a string!');
        continue;
      }
      fail(TYPES_EXCEPT_STRING[i]);
    }
  });
});
