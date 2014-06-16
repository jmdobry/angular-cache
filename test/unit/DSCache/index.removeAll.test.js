describe('DSCache.removeAll()', function () {
  it('should remove all items in the cache.', function () {
    var cache = TestDSCacheFactory('DSCache.removeAll.cache');
    var value1 = 'value1',
      value2 = 2,
      value3 = {
        value3: 'stuff'
      };
    cache.put('item1', value1);
    cache.put('item2', value2);
    cache.put('item3', value3);
    cache.removeAll();
    assert.isUndefined(cache.get('item1'));
    assert.isUndefined(cache.get('item2'));
    assert.isUndefined(cache.get('item3'));
  });
  it('should remove items from localStorage when storageMode is used.', function () {
    var localStorageCache = TestDSCacheFactory('DSCache.removeAll.localStorageCache', { storageMode: 'localStorage', storageImpl: localStorage }),
      sessionStorageCache = TestDSCacheFactory('DSCache.removeAll.sessionStorageCache', { storageMode: 'sessionStorage', storageImpl: sessionStorage, storagePrefix: 'affas' });

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');
    localStorageCache.put('item2', 'value2');
    sessionStorageCache.put('item2', 'value2');

    assert.equal(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item1')).value, 'value1');
    assert.equal(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item2')).value, 'value2');
    assert.equal(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.keys'), '["item1","item2"]');
    assert.equal(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item1')).value, 'value1');
    assert.equal(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item2')).value, 'value2');
    assert.equal(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.keys'), '["item1","item2"]');

    localStorageCache.removeAll();
    sessionStorageCache.removeAll();

    assert.isNull(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item1')));
    assert.isNull(angular.fromJson(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.data.item2')));
    assert.equal(localStorage.getItem(localStorageCache.$$storagePrefix + 'DSCache.removeAll.localStorageCache.keys'), '[]');
    assert.isNull(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item1')));
    assert.isNull(angular.fromJson(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.data.item2')));
    assert.equal(sessionStorage.getItem(sessionStorageCache.$$storagePrefix + 'DSCache.removeAll.sessionStorageCache.keys'), '[]');
  });
});
