describe('asCache.get(key)', function () {
  it('should do nothing if the cache is disabled.', function () {
    var cache = TestDSCacheFactory('cache');

    assert.equal(cache.info().size, 0);
    cache.put('1', 'item');
    assert.equal(cache.get('1'), 'item');
    assert.equal(cache.info().size, 1);
    cache.setOptions({ disabled: true });
    assert.equal(cache.info().size, 1);
    assert.isUndefined(cache.get('1'));
  });
  it('should throw an error if "key" is not a string or array.', function () {
    var cache = TestDSCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER.length; i++) {
      try {
        cache.get(TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
        fail(TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
      } catch (err) {
        assert.equal(err.message, '[ng:areq] Expected key to be a string! Found: ' + typeof TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
        continue;
      }
      fail(TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
    }
  });
  it('should throw an error if "options" is not an object.', function () {
    var cache = TestDSCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
      try {
        cache.get('item', TYPES_EXCEPT_OBJECT[i]);
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
  });
  it('should throw an error if "onExpire" is not a function.', function () {
    var cache = TestDSCacheFactory('cache');
    for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
      try {
        if (!TYPES_EXCEPT_FUNCTION[i]) {
          continue;
        }
        cache.get('item', { onExpire: TYPES_EXCEPT_FUNCTION[i] });
        if (TYPES_EXCEPT_FUNCTION[i] !== null && TYPES_EXCEPT_FUNCTION[i] !== undefined && TYPES_EXCEPT_FUNCTION[i] !== false) {
          fail(TYPES_EXCEPT_FUNCTION[i]);
        }
      } catch (err) {
        assert.equal(err.message, '[ng:areq] Expected options.onExpire to be a function! Found: ' + typeof TYPES_EXCEPT_FUNCTION[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_FUNCTION[i]);
        continue;
      }
      if (TYPES_EXCEPT_FUNCTION[i] !== null && TYPES_EXCEPT_FUNCTION[i] !== undefined && TYPES_EXCEPT_FUNCTION[i] !== false) {
        fail(TYPES_EXCEPT_FUNCTION[i]);
      }
    }
  });
  it('should return the correct value for the specified key.', function () {
    var cache = TestDSCacheFactory('cache');
    var value1 = 'value1',
      value2 = 2,
      value3 = {
        value3: 'stuff'
      };
    cache.put('item1', value1);
    cache.put('item2', value2);
    cache.put('item3', value3);
    assert.equal(cache.get('item1'), value1);
    assert.equal(cache.get('item2'), value2);
    assert.equal(cache.get('item3'), value3);
  });
  it('should return undefined if the key isn\'t in the cache.', function () {
    var cache = TestDSCacheFactory('cache');
    assert.isUndefined(cache.get('item'));
  });
  it('should execute globally configured "onExpire" callback if the item is expired in passive mode and global "onExpire" callback is configured.', function (done) {
    var cache = TestDSCacheFactory('cache', {
      maxAge: 10,
      recycleFreq: 20,
      deleteOnExpire: 'passive',
      onExpire: function (key, value, done2) {
        done2(key, value, 'executed global callback');
      }
    });
    cache.put('item', 'value');
    setTimeout(function () {
      cache.get('item', { onExpire: function (key, value, test) {
        assert.equal(key, 'item');
        assert.equal(value, 'value');
        assert.equal(test, 'executed global callback');
      }});
      done();
    }, 100);
  });
  it('should execute globally configured "onExpire" callback when an item is aggressively deleted and global "onExpire" callback is configured.', function (done) {
    var options = {
      maxAge: 10,
      recycleFreq: 20,
      deleteOnExpire: 'aggressive',
      onExpire: function (key, value) {
      }
    };
    sinon.spy(options, 'onExpire');
    var cache = TestDSCacheFactory('cache', options);
    cache.put('item', 'value');
    setTimeout(function () {
      assert.isTrue(options.onExpire.called);
      assert.isTrue(options.onExpire.calledWith('item', 'value'));
      done();
    }, 100);
  });
  it('should execute local "onExpire" callback if the item is expired in passive mode and global "onExpire" callback is NOT configured.', function (done) {
    var cache = TestDSCacheFactory('cache', {
      maxAge: 10,
      deleteOnExpire: 'passive',
      recycleFreq: 20
    });
    cache.put('item', 'value');
    setTimeout(function () {
      cache.get('item', { onExpire: function (key, value) {
        assert.equal(key, 'item');
        assert.equal(value, 'value');
      }});
      done();
    }, 100);
  });
  it('should return the correct values for multiple keys.', function () {
    var cache = TestDSCacheFactory('cache');
    var value1 = 'value1',
      value2 = 2,
      value3 = {
        value3: 'stuff'
      };
    cache.put('item1', value1);
    cache.put('item2', value2);
    cache.put('item3', value3);
    assert.deepEqual(cache.get(['item1', 'item2', 'item3']), [value1, value2, value3]);
  });
  it('should not return undefined values for multiple keys.', function () {
    var cache = TestDSCacheFactory('cache');
    var value1 = 'value1',
      value2 = 2;
    cache.put('item1', value1);
    cache.put('item2', value2);
    assert.deepEqual(cache.get(['item1', 'item2', 'item3']), [value1, value2]);
  });
});
