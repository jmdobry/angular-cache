describe('DSCache.destroy()', function () {
  it('should destroy the cache and remove all traces of its existence.', function () {
    var cache = TestDSCacheFactory('cache');
    cache.destroy();
    try {
      assert.equal(cache.info(), { size: 0 });
      fail('should not be able to use a cache after destroying it');
    } catch (err) {

    }
    assert.isUndefined(TestDSCacheFactory.get('cache'));
  });
  it('should remove items from localStorage when storageMode is used.', function () {
    var localStorageCache = TestDSCacheFactory('localStorageCache', { storageMode: 'localStorage', storagePrefix: 'acc.' }),
      sessionStorageCache = TestDSCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');
    localStorageCache.put('item2', 'value2');
    sessionStorageCache.put('item2', 'value2');

    assert.equal(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')).value, 'value1');
    assert.equal(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item2')).value, 'value2');
    assert.equal(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'), '["item1","item2"]');
    assert.equal(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')).value, 'value1');
    assert.equal(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item2')).value, 'value2');
    assert.equal(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'), '["item1","item2"]');

    localStorageCache.destroy();
    sessionStorageCache.destroy();

    assert.isNull(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item1')));
    assert.isNull(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.data.item2')));
    assert.isNull(localStorage.getItem(localStorageCache.$$storagePrefix + 'localStorageCache.keys'));
    assert.isNull(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item1')));
    assert.isNull(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.data.item2')));
    assert.isNull(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'sessionStorageCache.keys'));
  });
});
