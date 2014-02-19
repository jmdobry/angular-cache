describe('DSCache.destroy()', function () {
	it('should destroy the cache and remove all traces of its existence.', function () {
		var cache = DSCacheFactory('cache');
		cache.destroy();
		try {
			assert.equal(cache.info(), { size: 0 });
			fail('should not be able to use a cache after destroying it');
		} catch (err) {

		}
		assert.isUndefined(DSCacheFactory.get('cache'));
	});
	it('should remove items from localStorage when storageMode is used.', function () {
		var localStorageCache = DSCacheFactory('localStorageCache', { storageMode: 'localStorage', storageImpl: $window.localStorage }),
			sessionStorageCache = DSCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage', storageImpl: $window.sessionStorage });

		localStorageCache.put('item1', 'value1');
		sessionStorageCache.put('item1', 'value1');
		localStorageCache.put('item2', 'value2');
		sessionStorageCache.put('item2', 'value2');

		assert.equal(angular.fromJson($window.localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value, 'value1');
		assert.equal(angular.fromJson($window.localStorage.getItem('angular-cache.caches.localStorageCache.data.item2')).value, 'value2');
		assert.equal($window.localStorage.getItem('angular-cache.caches.localStorageCache.keys'), '["item1","item2"]');
		assert.equal(angular.fromJson($window.sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value, 'value1');
		assert.equal(angular.fromJson($window.sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2')).value, 'value2');
		assert.equal($window.sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys'), '["item1","item2"]');

		localStorageCache.destroy();
		sessionStorageCache.destroy();

		assert.isNull(angular.fromJson($window.localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')));
		assert.isNull(angular.fromJson($window.localStorage.getItem('angular-cache.caches.localStorageCache.data.item2')));
		assert.isNull($window.localStorage.getItem('angular-cache.caches.localStorageCache.keys'));
		assert.isNull(angular.fromJson($window.sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')));
		assert.isNull(angular.fromJson($window.sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2')));
		assert.isNull($window.sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys'));
	});
});
