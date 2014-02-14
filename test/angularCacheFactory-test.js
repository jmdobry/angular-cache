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
        expect(cache.info().readOnGet).toEqual(CACHE_DEFAULTS.readOnGet);
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
            },
            readOnGet: false
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
        expect(cache.info().readOnGet).toEqual(options.readOnGet);
        cache.destroy();
        expect($angularCacheFactory.get('cache')).not.toBeDefined();
    });
    it('should throw an exception if "capacity" is not a number or is less than zero.', function () {
        try {
            $angularCacheFactory('capacityCache99', { capacity: Math.floor((Math.random() * 100000) + 1) * -1 });
            fail();
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('capacity: must be greater than zero!');
        for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
            try {
                $angularCacheFactory('capacityCache' + i, { capacity: TYPES_EXCEPT_NUMBER[i] });
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
            $angularCacheFactory('maxAgeCache99', { maxAge: maxAge });
            fail();
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('maxAge: must be greater than zero!');
        for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
            try {
                $angularCacheFactory('maxAgeCache' + i, { maxAge: TYPES_EXCEPT_NUMBER[i] });
                if (TYPES_EXCEPT_NUMBER[i] !== null) {
                    fail(TYPES_EXCEPT_NUMBER[i]);
                }
            } catch (err) {
                expect(err.message).toEqual('maxAge: must be a number!');
                continue;
            }
            if (TYPES_EXCEPT_NUMBER[i] !== null) {
                fail(TYPES_EXCEPT_NUMBER[i]);
            }
        }
    });
    it('should validate cacheFlushInterval.', function () {
        var cacheFlushInterval = Math.floor((Math.random() * 100000) + 1) * -1;
        try {
            $angularCacheFactory('cacheFlushIntervalCache99', { cacheFlushInterval: cacheFlushInterval });
            fail();
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('cacheFlushInterval: must be greater than zero!');
        for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
            try {
                $angularCacheFactory('cacheFlushIntervalCache' + i, { cacheFlushInterval: TYPES_EXCEPT_NUMBER[i] });
                if (TYPES_EXCEPT_NUMBER[i] !== null) {
                    fail();
                }
            } catch (err) {
                expect(err.message).toEqual('cacheFlushInterval: must be a number!');
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
            $angularCacheFactory('recycleFreqCache99', { recycleFreq: recycleFreq });
            fail();
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('recycleFreq: must be greater than zero!');
        for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
            try {
                $angularCacheFactory('recycleFreqCache' + i, { recycleFreq: TYPES_EXCEPT_NUMBER[i] });
                if (TYPES_EXCEPT_NUMBER[i] !== null) {
                    fail();
                }
            } catch (err) {
                expect(err.message).toEqual('recycleFreq: must be a number!');
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
            $angularCacheFactory('onExpireCache99', { onExpire: onExpire });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('onExpire: must be a function!');
        for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
            try {
                $angularCacheFactory('onExpireCache' + i, { onExpire: TYPES_EXCEPT_FUNCTION[i] });
                if (TYPES_EXCEPT_FUNCTION[i] !== null) {
                    fail();
                }
            } catch (err) {
                expect(err.message).toEqual('onExpire: must be a function!');
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
            $angularCacheFactory('cache', { deleteOnExpire: deleteOnExpire });
            fail('should not reach this!');
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('deleteOnExpire: accepted values are "none", "passive" or "aggressive"!');
        for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
            try {
                $angularCacheFactory('deleteOnExpireCache' + i, { deleteOnExpire: TYPES_EXCEPT_STRING[i] });
                fail(TYPES_EXCEPT_STRING[i]);
            } catch (err) {
                expect(err.message).toEqual('deleteOnExpire: must be a string!');
                continue;
            }
            fail(TYPES_EXCEPT_STRING[i]);
        }
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
        for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
            try {
                $angularCacheFactory('storageModeCache' + i, { storageMode: TYPES_EXCEPT_STRING[i] });
                fail(TYPES_EXCEPT_STRING[i]);
            } catch (err) {
                expect(err.message).toEqual('storageMode: must be a string!');
                continue;
            }
            fail(TYPES_EXCEPT_STRING[i]);
        }
    });
    it('should validate storageImpl.', function () {
        var storageImpl = 'fail';
        try {
            $angularCacheFactory('cache', { storageMode: 'localStorage', storageImpl: storageImpl });
            expect('should not reach this!').toEqual(false);
        } catch (err) {
            var msg = err.message;
        }
        expect(msg).toEqual('storageImpl: must be an object!');
        for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
            try {
                $angularCacheFactory('storageImplCache' + i, { storageMode: 'localStorage', storageImpl: TYPES_EXCEPT_OBJECT[i] });
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
            $angularCacheFactory('storageImplCache-noSetItem', {
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
            $angularCacheFactory('storageImplCache-noGetItem', {
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
            $angularCacheFactory('storageImplCache-noRemoveItem', {
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
            $angularCacheFactory('storageImplCache-stringGetItem', {
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
            $angularCacheFactory('storageImplCache-stringSetItem', {
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
            $angularCacheFactory('storageImplCache-stringRemoveItem', {
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
        for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
            try {
                $angularCacheFactory(TYPES_EXCEPT_STRING[i]);
                fail(TYPES_EXCEPT_STRING[i]);
            } catch (err) {
                expect(err.message.length).not.toEqual(0);
                continue;
            }
            fail(TYPES_EXCEPT_STRING[i]);
        }
    });
});