describe('AngularCache.removeAll()', function () {
    it('should remove all items in the cache.', function () {
        var cache = $angularCacheFactory('cache');
        var value1 = 'value1',
            value2 = 2,
            value3 = {
                value3: 'stuff'
            };
        cache.put('item1', value1);
        cache.put('item2', value2);
        cache.put('item3', value3);
        cache.removeAll();
        expect(cache.get('item1')).toEqual(undefined);
        expect(cache.get('item2')).toEqual(undefined);
        expect(cache.get('item3')).toEqual(undefined);
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

        localStorageCache.removeAll();
        sessionStorageCache.removeAll();

        if (localStorage) {
            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item1'))).toEqual(null);
            expect(angular.fromJson(localStorage.getItem('angular-cache.caches.localStorageCache.data.item2'))).toEqual(null);
            expect(localStorage.getItem('angular-cache.caches.localStorageCache.keys')).toEqual('[]');
        }
        if (sessionStorage) {
            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item1'))).toEqual(null);
            expect(angular.fromJson(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.data.item2'))).toEqual(null);
            expect(sessionStorage.getItem('angular-cache.caches.sessionStorageCache.keys')).toEqual('[]');
        }
    });
});