describe('CacheFactoryProvider.setCacheDefaults(options)', function () {
  it('should have the correct defaults.', function () {
    var cache = TestCacheFactory('CacheFactoryProvider.setCacheDefaults.cache');
    assert.isDefined(cache);
    assert.equal(cache.info().id, 'CacheFactoryProvider.setCacheDefaults.cache');
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
    angular.extend(TestCacheFactoryProvider.defaults, options);
    var cache = TestCacheFactory('cache');
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
});
