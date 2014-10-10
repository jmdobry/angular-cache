describe('$angularCacheFactoryProvider.setCacheDefaults(options)', function () {
  it('should have the correct defaults.', function () {
    expect($angularCacheFactory.info().cacheDefaults).toEqual({
      capacity: CACHE_DEFAULTS.capacity,
      maxAge: CACHE_DEFAULTS.maxAge,
      cacheFlushInterval: CACHE_DEFAULTS.cacheFlushInterval,
      deleteOnExpire: CACHE_DEFAULTS.deleteOnExpire,
      onExpire: CACHE_DEFAULTS.onExpire,
      recycleFreq: CACHE_DEFAULTS.recycleFreq,
      storageMode: CACHE_DEFAULTS.storageMode,
      storageImpl: CACHE_DEFAULTS.storageImpl,
      verifyIntegrity: CACHE_DEFAULTS.verifyIntegrity,
      disabled: CACHE_DEFAULTS.disabled,
      readOnGet: CACHE_DEFAULTS.readOnGet,
      storePromises : CACHE_DEFAULTS.storePromises
    });
    var cache = $angularCacheFactory('cache');
    expect(cache).toBeDefined();
    expect(cache.info().id).toEqual('cache');
    expect(cache.info().capacity).toEqual(CACHE_DEFAULTS.capacity);
    expect(cache.info().maxAge).toEqual(CACHE_DEFAULTS.maxAge);
    expect(cache.info().cacheFlushInterval).toEqual(CACHE_DEFAULTS.cacheFlushInterval);
    expect(cache.info().deleteOnExpire).toEqual(CACHE_DEFAULTS.deleteOnExpire);
    expect(cache.info().onExpire).toEqual(CACHE_DEFAULTS.onExpire);
    expect(cache.info().recycleFreq).toEqual(CACHE_DEFAULTS.recycleFreq);
    expect(cache.info().storageMode).toEqual(CACHE_DEFAULTS.storageMode);
    expect(cache.info().storageImpl).toEqual(CACHE_DEFAULTS.storageImpl);
    expect(cache.info().verifyIntegrity).toEqual(CACHE_DEFAULTS.verifyIntegrity);
    expect(cache.info().readOnGet).toEqual(CACHE_DEFAULTS.readOnGet);
    expect(cache.info().disabled).toEqual(CACHE_DEFAULTS.disabled);
    cache.destroy();
  });
  it('should set the default options.', function () {
    var options = {
      capacity: Math.floor((Math.random() * 100000) + 1),
      maxAge: Math.floor((Math.random() * 100000) + 1),
      cacheFlushInterval: Math.floor((Math.random() * 100000) + 1),
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage',
      localStorageImpl: {
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
    $angularCacheFactoryProvider.setCacheDefaults(options);
    var cache = $angularCacheFactory('cache');
    expect(cache).toBeDefined();
    expect(cache.info().id).toEqual('cache');
    expect(cache.info().capacity).toEqual(options.capacity);
    expect(cache.info().maxAge).toEqual(options.maxAge);
    expect(cache.info().cacheFlushInterval).toEqual(options.cacheFlushInterval);
    expect(cache.info().deleteOnExpire).toEqual(options.deleteOnExpire);
    expect(cache.info().storageMode).toEqual(options.storageMode);
    expect(cache.info().localStorageImpl).not.toBeDefined(); // We don't expose this to the user
    expect(cache.info().onExpire).toEqual(options.onExpire);
    expect(cache.info().disabled).toEqual(options.disabled);
    cache.destroy();
    expect($angularCacheFactory.get('cache')).not.toBeDefined();
  });
  it('should throw an exception if "capacity" is not a number or is less than zero.', function () {
    try {
      $angularCacheFactoryProvider.setCacheDefaults({ capacity: Math.floor((Math.random() * 100000) + 1) * -1 });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): capacity: must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ capacity: TYPES_EXCEPT_NUMBER[i] });
        fail();
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): capacity: must be a number!');
        continue;
      }
      fail();
    }
  });
  it('should validate maxAge.', function () {
    var maxAge = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      $angularCacheFactoryProvider.setCacheDefaults({ maxAge: maxAge });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): maxAge: must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ maxAge: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null) {
          fail();
        }
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): maxAge: must be a number!');
        continue;
      }
      if (TYPES_EXCEPT_NUMBER[i] !== null) {
        fail();
      }
    }
  });
  it('should validate cacheFlushInterval.', function () {
    var cacheFlushInterval = Math.floor((Math.random() * 100000) + 1) * -1;
    try {
      $angularCacheFactoryProvider.setCacheDefaults({ cacheFlushInterval: cacheFlushInterval });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): cacheFlushInterval: must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ cacheFlushInterval: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null) {
          fail();
        }
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): cacheFlushInterval: must be a number!');
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
      $angularCacheFactoryProvider.setCacheDefaults({ recycleFreq: recycleFreq });
      fail();
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): recycleFreq: must be greater than zero!');
    for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ recycleFreq: TYPES_EXCEPT_NUMBER[i] });
        if (TYPES_EXCEPT_NUMBER[i] !== null) {
          fail();
        }
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): recycleFreq: must be a number!');
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
      $angularCacheFactoryProvider.setCacheDefaults({ onExpire: onExpire });
      expect('should not reach this!').toEqual(false);
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): onExpire: must be a function!');
    for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ onExpire: TYPES_EXCEPT_FUNCTION[i] });
        if (TYPES_EXCEPT_FUNCTION[i] !== null) {
          fail();
        }
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): onExpire: must be a function!');
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
      $angularCacheFactoryProvider.setCacheDefaults({ deleteOnExpire: deleteOnExpire });
      expect('should not reach this!').toEqual(false);
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ deleteOnExpire: TYPES_EXCEPT_STRING[i] });
        fail();
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): deleteOnExpire: must be a string!');
        continue;
      }
      fail();
    }
  });
  it('should validate storageMode.', function () {
    var storageMode = 'fail';
    try {
      $angularCacheFactoryProvider.setCacheDefaults({ storageMode: storageMode });
      expect('should not reach this!').toEqual(false);
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
    for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ storageMode: TYPES_EXCEPT_STRING[i] });
        fail();
      } catch (err) {
        expect(err.message).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): storageMode: must be a string!');
        continue;
      }
      fail();
    }
  });
  it('should validate storageImpl.', function () {
    var storageImpl = 'fail';
    try {
      $angularCacheFactoryProvider.setCacheDefaults({ storageMode: 'localStorage', storageImpl: storageImpl });
      expect('should not reach this!').toEqual(false);
    } catch (err) {
      var msg = err.message;
    }
    expect(msg).toEqual('$angularCacheFactoryProvider.setCacheDefaults(options): storageImpl: must be an object!');
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults({ storageMode: 'localStorage', storageImpl: TYPES_EXCEPT_OBJECT[i] });
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        expect(err.message.length).not.toEqual(0);
        continue;
      }
      if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
        fail(TYPES_EXCEPT_OBJECT[i]);
      }
    }
    try {
      $angularCacheFactoryProvider.setCacheDefaults({
        storageMode: 'localStorage',
        storageImpl: {
          getItem: function () {
          },
          removeItem: function () {
          }
        }
      });
      fail();
    } catch (err) {
      expect(err.message.length).not.toEqual(0);
    }
    try {
      $angularCacheFactoryProvider.setCacheDefaults({
        storageMode: 'localStorage',
        storageImpl: {
          setItem: function () {
          },
          removeItem: function () {
          }
        }
      });
      fail();
    } catch (err) {
      expect(err.message.length).not.toEqual(0);
    }
    try {
      $angularCacheFactoryProvider.setCacheDefaults({
        storageMode: 'localStorage',
        storageImpl: {
          getItem: function () {
          },
          setItem: function () {
          }
        }
      });
      fail();
    } catch (err) {
      expect(err.message.length).not.toEqual(0);
    }
    try {
      $angularCacheFactoryProvider.setCacheDefaults({
        storageMode: 'localStorage',
        storageImpl: {
          getItem: 'should not be a string',
          setItem: function () {
          },
          removeItem: function () {
          }
        }
      });
      fail();
    } catch (err) {
      expect(err.message.length).not.toEqual(0);
    }
    try {
      $angularCacheFactoryProvider.setCacheDefaults({
        storageMode: 'localStorage',
        storageImpl: {
          getItem: function () {
          },
          setItem: 'should not be a string',
          removeItem: function () {
          }
        }
      });
      fail();
    } catch (err) {
      expect(err.message.length).not.toEqual(0);
    }
    try {
      $angularCacheFactoryProvider.setCacheDefaults({
        storageMode: 'localStorage',
        storageImpl: {
          setItem: function () {
          },
          getItem: function () {
          },
          removeItem: 'should not be a string'
        }
      });
      fail();
    } catch (err) {
      expect(err.message.length).not.toEqual(0);
    }
  });
  it('should require options to be an object.', function () {
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        $angularCacheFactoryProvider.setCacheDefaults(TYPES_EXCEPT_OBJECT[i]);
        if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
          fail(TYPES_EXCEPT_OBJECT[i]);
        }
      } catch (err) {
        expect(err.message.length).not.toEqual(0);
        continue;
      }
      if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
        fail(TYPES_EXCEPT_OBJECT[i]);
      }
    }
  });
});
