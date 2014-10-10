describe('AngularCache.remove(key)', function () {
  it('should remove the item with the specified key.', function () {
    var cache = $angularCacheFactory('cache');
    var value1 = 'value1',
      value2 = 2,
      value3 = {
        value3: 'stuff'
      };
    cache.put('item1', value1);
    cache.put('item2', value2);
    cache.put('item3', value3);
    cache.remove('item1');
    expect(cache.get('item1')).toEqual(undefined);
    cache.remove('item2');
    expect(cache.get('item2')).toEqual(undefined);
    cache.remove('item3');
    expect(cache.get('item3')).toEqual(undefined);
  });
  it('should reduce the size of the cache by one if the size is greater than zero.', function () {
    var cache = $angularCacheFactory('cache');
    cache.put('item1', 'value1');
    expect(cache.info().size).toEqual(1);
    cache.put('item2', 'value2');
    expect(cache.info().size).toEqual(2);
    cache.remove('item1');
    expect(cache.info().size).toEqual(1);
    cache.remove('item2');
    expect(cache.info().size).toEqual(0);
    cache.remove('item1');
    expect(cache.info().size).toEqual(0);
    cache.remove('item2');
    expect(cache.info().size).toEqual(0);
  });
  it('should remove items from localStorage when storageMode is used.', function () {
    var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
      sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

    localStorageCache.put('item1', 'value1');
    sessionStorageCache.put('item1', 'value1');

    if (localStorage) {
      expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
      expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1"]');
    }
    if (sessionStorage) {
      expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
      expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1"]');
    }

    localStorageCache.remove('item1');
    sessionStorageCache.remove('item1');

    if (localStorage) {
      expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1'))).toEqual(null);
      expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('[]');
    }
    if (sessionStorage) {
      expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1'))).toEqual(null);
      expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('[]');
    }
  });
  it('should allow to remove a promise if storePromises is true.', function () {
    var cache = $angularCacheFactory('cache', {storePromises : true});
    var deferred = $q.defer();
    var promise = deferred.promise;
    cache.put('mypromise', promise);
    cache.remove('mypromise');
    //we can't check on cache info size as promises are not counted
    expect(cache.get('mypromise')).toBeUndefined();
  });
});
