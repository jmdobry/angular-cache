describe('ngAdvancedCache', function () {

    var $advancedCacheFactory;
    beforeEach(module('ngAdvancedCache'));
    beforeEach(inject(function ($injector) {
        $advancedCacheFactory = $injector.get('$advancedCacheFactory');
    }));

    describe('$advancedCacheFactory', function () {
        describe('$advancedCacheFactory()', function () {
            it('should be able to create a default cache', function () {
                var cache = $advancedCacheFactory('cache');
                expect(cache).toBeDefined();
                expect(cache.info().id).toEqual('cache');
                expect(cache.info().capacity).toEqual(Number.MAX_VALUE);
                expect(cache.info().maxAge).not.toBeDefined();
                expect(cache.info().cacheFlushInterval).not.toBeDefined();
                cache.destroy();
            });
            it('should be able to create a cache with options', function () {
                var options = {
                    capacity: Math.floor((Math.random()*100000)+1),
                    maxAge: Math.floor((Math.random()*100000)+1),
                    cacheFlushInterval: Math.floor((Math.random()*100000)+1)
                };
                var cache = $advancedCacheFactory('cache', options);
                expect(cache).toBeDefined();
                expect(cache.info().id).toEqual('cache');
                expect(cache.info().capacity).toEqual(options.capacity);
                expect(cache.info().maxAge).toEqual(options.maxAge);
                expect(cache.info().cacheFlushInterval).toEqual(options.cacheFlushInterval);
                cache.destroy();
                expect($advancedCacheFactory.get('cache')).not.toBeDefined();
            });
            it('should validate capacity', function () {
                var capacity = Math.floor((Math.random()*100000)+1) * -1;
                try {
                    $advancedCacheFactory('cache', { capacity: capacity });
                } catch (err) {
                    var msg = err.message;
                }
                expect(msg).toEqual('capacity must be greater than zero!;');
                capacity = 'asdfasd';
                try {
                    $advancedCacheFactory('cache', { capacity: capacity });
                } catch (err) {
                    msg = err.message;
                }
                expect(msg).toEqual('capacity must be a number!;');
            });
            it('should validate maxAge', function () {
                var maxAge = Math.floor((Math.random()*100000)+1) * -1;
                try {
                    $advancedCacheFactory('cache', { maxAge: maxAge });
                } catch (err) {
                    var msg = err.message;
                }
                expect(msg).toEqual('maxAge must be greater than zero!;');
                maxAge = 'asdfasd';
                try {
                    $advancedCacheFactory('cache', { maxAge: maxAge });
                } catch (err) {
                    msg = err.message;
                }
                expect(msg).toEqual('maxAge must be a number!;');
            });
            it('should validate cacheFlushInterval', function () {
                var cacheFlushInterval = Math.floor((Math.random()*100000)+1) * -1;
                try {
                    $advancedCacheFactory('cache', { cacheFlushInterval: cacheFlushInterval });
                } catch (err) {
                    var msg = err.message;
                }
                expect(msg).toEqual('cacheFlushInterval must be greater than zero!;');
                cacheFlushInterval = 'asdfasd';
                try {
                    $advancedCacheFactory('cache', { cacheFlushInterval: cacheFlushInterval });
                } catch (err) {
                    msg = err.message;
                }
                expect(msg).toEqual('cacheFlushInterval must be a number!;');
            });
            it('should prevent a cache from being duplicated', function () {
                try {
                    $advancedCacheFactory('cache');
                    $advancedCacheFactory('cache');
                } catch (err) {
                    var msg = err.message;
                }
                expect(msg).toEqual('cacheId cache taken!');
            });
            it('should require cacheId to be a string', function () {
                var shouldBeAStringMsg = 'cacheId must be a string!';
                try {
                    $advancedCacheFactory(3);
                } catch (err) {
                    var msg = err.message;
                }
                expect(msg).toEqual(shouldBeAStringMsg);
                try {
                    $advancedCacheFactory({obj: 'obj'});
                } catch (err) {
                    msg = err.message;
                }
                expect(msg).toEqual(shouldBeAStringMsg);
                try {
                    $advancedCacheFactory(['obj']);
                } catch (err) {
                    msg = err.message;
                }
                expect(msg).toEqual(shouldBeAStringMsg);
            });
        });
        describe('$advancedCacheFactory.get(cachedId)', function () {
            it('should return the correct cache with the specified cacheId', function () {
                var cache = $advancedCacheFactory('cache');
                expect($advancedCacheFactory.get('cache')).toEqual(cache);
                cache.destroy();
            });
            it('should return \"undefined\" if the cache doesn\'t exist', function () {
                expect($advancedCacheFactory.get('someNonExistentCache')).toEqual(undefined);
            });
        });
        describe('$advancedCacheFactory.info()', function () {
            it('should return the correct info for each cache produced by the factory', function () {
                var options = {
                    capacity: Math.floor((Math.random()*100000)+1),
                    maxAge: Math.floor((Math.random()*100000)+1),
                    cacheFlushInterval: Math.floor((Math.random()*100000)+1)
                };

                var cache = $advancedCacheFactory('cache');
                var cache2 = $advancedCacheFactory('cache2', {
                        maxAge: options.maxAge
                    });
                var cache3 = $advancedCacheFactory('cache3', {
                    capacity: options.capacity,
                    cacheFlushInterval: options.cacheFlushInterval
                });
                var info = $advancedCacheFactory.info();
                expect(info['cache'].id).toEqual('cache');
                expect(info['cache'].capacity).toEqual(Number.MAX_VALUE);
                expect(info['cache'].size).toEqual(0);

                expect(info['cache2'].id).toEqual('cache2');
                expect(info['cache2'].capacity).toEqual(Number.MAX_VALUE);
                expect(info['cache2'].size).toEqual(0);

                expect(info['cache3'].id).toEqual('cache3');
                expect(info['cache3'].cacheFlushInterval).toEqual(options.cacheFlushInterval);
                expect(info['cache3'].capacity).toEqual(options.capacity);
                expect(info['cache3'].size).toEqual(0);
                expect(info['cache3'].cacheFlushIntervalId).toBeDefined();
                cache.destroy();
                cache2.destroy();
                cache3.destroy();
            });
            it('should return \"undefined\" if the cache doesn\'t exist', function () {
                expect($advancedCacheFactory.get('someNonExistentCache')).toEqual(undefined);
            });
        });
    });

    describe('AdvancedCache', function () {
        // @TODO: Write unit tests for the AdvancedCache class
    });
});