describe('$angularCacheFactory(cacheId, options)', function () {
    it('should be able to create a default cache.', function () {
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
        cache.destroy();
    });
    it('should be able to create a cache with options.', function () {
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
            onExpire: function () {
            }
        };
        var cache = $angularCacheFactory('cache', options);
        expect(cache).toBeDefined();
        expect(cache.info().id).toEqual('cache');
        expect(cache.info().capacity).toEqual(options.capacity);
        expect(cache.info().maxAge).toEqual(options.maxAge);
        expect(cache.info().cacheFlushInterval).toEqual(options.cacheFlushInterval);
        expect(cache.info().deleteOnExpire).toEqual(options.deleteOnExpire);
        expect(cache.info().storageMode).toEqual(options.storageMode);
        expect(cache.info().localStorageImpl).not.toBeDefined(); // We don't expose this to the user
        expect(cache.info().onExpire).toEqual(options.onExpire);
        cache.destroy();
        expect($angularCacheFactory.get('cache')).not.toBeDefined();
    });
    it('should throw an exception if "capacity" is not a number or is less than zero.', function () {
        try {
            $angularCacheFactory('cache', { capacity: Math.floor((Math.random() * 100000) + 1) * -1 });
            fail();
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('capacity: must be greater than zero!');
        for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
            try {
                $angularCacheFactory('cache', { capacity: TYPES_EXCEPT_NUMBER[i] });
                fail();
            } catch (err) {
                expect(err.message).toEqual('capacity: must be a number!');
                continue;
            }
            fail();
        }
    });
    it('should validate maxAge.', function () {
        var maxAge = Math.floor((Math.random() * 100000) + 1) * -1;
        try {
            $angularCacheFactory('cache', { maxAge: maxAge });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('maxAge: must be greater than zero!');
        maxAge = 'asdfasd';
        try {
            $angularCacheFactory('cache', { maxAge: maxAge });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('maxAge: must be a number!');
    });
    it('should validate cacheFlushInterval.', function () {
        var cacheFlushInterval = Math.floor((Math.random() * 100000) + 1) * -1;
        try {
            $angularCacheFactory('cache', { cacheFlushInterval: cacheFlushInterval });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('cacheFlushInterval: must be greater than zero!');
        cacheFlushInterval = 'asdfasd';
        try {
            $angularCacheFactory('cache', { cacheFlushInterval: cacheFlushInterval });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('cacheFlushInterval: must be a number!');
    });
    it('should validate recycleFreq.', function () {
        var recycleFreq = Math.floor((Math.random() * 100000) + 1) * -1;
        try {
            $angularCacheFactory('cache', { recycleFreq: recycleFreq });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('recycleFreq: must be greater than zero!');
        recycleFreq = 'asdfasd';
        try {
            $angularCacheFactory('cache', { recycleFreq: recycleFreq });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('recycleFreq: must be a number!');
    });
    it('should validate onExpire.', function () {
        var onExpire = 234;
        try {
            $angularCacheFactory('cache', { onExpire: onExpire });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('onExpire: must be a function!');
        onExpire = {};
        try {
            $angularCacheFactory('cache', { onExpire: onExpire });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('onExpire: must be a function!');
        onExpire = 'asdfasd';
        try {
            $angularCacheFactory('cache', { onExpire: onExpire });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('onExpire: must be a function!');
    });
    it('should validate deleteOnExpire.', function () {
        var deleteOnExpire = 'fail';
        try {
            $angularCacheFactory('cache', { deleteOnExpire: deleteOnExpire });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
        deleteOnExpire = 234;
        try {
            $angularCacheFactory('cache', { deleteOnExpire: deleteOnExpire });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('deleteOnExpire: must be a string!');
    });
    it('should validate storageMode.', function () {
        var storageMode = 'fail';
        try {
            $angularCacheFactory('cache', { storageMode: storageMode });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('storageMode: accepted values are "none", "localStorage" or "sessionStorage"!');
        storageMode = 234;
        try {
            $angularCacheFactory('cache', { storageMode: storageMode });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('storageMode: must be a string!');
    });
    it('should validate storageImpl.', function () {
        var storageImpl = 'fail';
        try {
            $angularCacheFactory('cache', { storageImpl: storageImpl });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('[local|session]storageImpl: must be an object!');
        storageImpl = 234;
        try {
            $angularCacheFactory('cache', { storageImpl: storageImpl });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual('[local|session]storageImpl: must be an object!');
    });

    it('should prevent a cache from being duplicated.', function () {
        try {
            $angularCacheFactory('cache');
            $angularCacheFactory('cache');
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('cacheId cache taken!');
    });
    it('should require cacheId to be a string.', function () {
        var shouldBeAStringMsg = 'cacheId must be a string!';
        try {
            $angularCacheFactory(3);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual(shouldBeAStringMsg);
        try {
            $angularCacheFactory({obj: 'obj'});
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual(shouldBeAStringMsg);
        try {
            $angularCacheFactory(['obj']);
        } catch (err) {
            msg = err.message;
        }
        expect(msg).toEqual(shouldBeAStringMsg);
    });
});