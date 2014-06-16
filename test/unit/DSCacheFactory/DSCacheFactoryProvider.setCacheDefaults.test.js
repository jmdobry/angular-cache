describe('DSCacheFactoryProvider.setCacheDefaults(options)', function () {
  it('should have the correct defaults.', function () {
    var cache = TestDSCacheFactory('DSCacheFactoryProvider.setCacheDefaults.cache');
    assert.isDefined(cache);
    assert.equal(cache.info().id, 'DSCacheFactoryProvider.setCacheDefaults.cache');
    assert.equal(cache.info().capacity, CACHE_DEFAULTS.capacity);
    assert.equal(cache.info().maxAge, CACHE_DEFAULTS.maxAge);
    assert.equal(cache.info().cacheFlushInterval, CACHE_DEFAULTS.cacheFlushInterval);
    assert.equal(cache.info().deleteOnExpire, CACHE_DEFAULTS.deleteOnExpire);
    assert.equal(cache.info().onExpire, CACHE_DEFAULTS.onExpire);
    assert.equal(cache.info().recycleFreq, CACHE_DEFAULTS.recycleFreq);
    assert.equal(cache.info().storageMode, CACHE_DEFAULTS.storageMode);
    assert.equal(cache.info().storageImpl, CACHE_DEFAULTS.storageImpl);
    assert.equal(cache.info().disabled, CACHE_DEFAULTS.disabled);
  });
  it('should set the default options.', function () {
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
      verifyIntegrity: false,
      recycleFreq: 2000,
      disabled: true,
      onExpire: function () {
      }
    };
    TestDSCacheFactoryProvider.setCacheDefaults(options);
    var cache = TestDSCacheFactory('cache');
    assert.isDefined(cache);
    assert.equal(cache.info().id, 'cache');
    assert.equal(cache.info().capacity, options.capacity);
    assert.equal(cache.info().maxAge, options.maxAge);
    assert.equal(cache.info().cacheFlushInterval, options.cacheFlushInterval);
    assert.equal(cache.info().deleteOnExpire, options.deleteOnExpire);
    assert.equal(cache.info().storageMode, options.storageMode);
    assert.equal(cache.info().storageImpl, options.storageImpl);
    assert.equal(cache.info().onExpire, options.onExpire);
    assert.equal(cache.info().disabled, options.disabled);
  });
  it('should require options to be an object.', function (done) {
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      if (!TYPES_EXCEPT_OBJECT[i]) {
        continue;
      }
      try {
        TestDSCacheFactoryProvider.setCacheDefaults(TYPES_EXCEPT_OBJECT[i]);
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        assert.equal(err.message, '[ng:areq] Expected options to be an object! Found: ' + typeof TYPES_EXCEPT_OBJECT[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_OBJECT[i]);
        continue;
      }
      if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
        fail(TYPES_EXCEPT_OBJECT[i]);
      }
    }

    done();
  });
});
