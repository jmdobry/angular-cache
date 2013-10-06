describe('AngularCache.destroy()', function () {
    it('should destroy the cache and remove all traces of its existence.', function () {
        var cache = $angularCacheFactory('cache');
        cache.destroy();
        expect(cache.info()).toEqual({ size: 0 });
        expect($angularCacheFactory.get('cache')).toEqual(undefined);
    });
    it('should remove items from localStorage when storageMode is used.', function () {
        var localStorageCache = $angularCacheFactory('localStorageCache', { storageMode: 'localStorage' }),
            sessionStorageCache = $angularCacheFactory('sessionStorageCache', { storageMode: 'sessionStorage' });

        localStorageCache.put('item1', 'value1');
        sessionStorageCache.put('item1', 'value1');
        localStorageCache.put('item2', 'value2');
        sessionStorageCache.put('item2', 'value2');

        if (localStorage) {
            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1')).value).toEqual('value1');
            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2')).value).toEqual('value2');
            expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('["item1","item2"]');
        }
        if (sessionStorage) {
            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1')).value).toEqual('value1');
            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2')).value).toEqual('value2');
            expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('["item1","item2"]');
        }

        localStorageCache.destroy();
        sessionStorageCache.destroy();

        if (localStorage) {
            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1'))).toEqual(null);
            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2'))).toEqual(null);
            expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual(null);
        }
        if (sessionStorage) {
            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1'))).toEqual(null);
            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2'))).toEqual(null);
            expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual(null);
        }
    });
});