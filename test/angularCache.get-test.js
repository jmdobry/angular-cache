//describe('AngularCache.get(key)', function () {
//    it('should return the correct value for the specified key', function () {
//        var cache = $angularCacheFactory('cache');
//        var value1 = 'value1',
//            value2 = 2,
//            value3 = {
//                value3: 'stuff'
//            };
//        cache.put('item1', value1);
//        cache.put('item2', value2);
//        cache.put('item3', value3);
//        expect(cache.get('item1')).toEqual(value1);
//        expect(cache.get('item2')).toEqual(value2);
//        expect(cache.get('item3')).toEqual(value3);
//    });
//    it('should return undefined if the key isn\'t in the cache', function () {
//        var cache = $angularCacheFactory('cache');
//        expect(cache.get('item')).toEqual(undefined);
//    });
//    it('should execute globally configured \'onExpire\' callback if the item is expired in passive mode and global \'onExpire\' callback is configured', function () {
//        var cache = $angularCacheFactory('cache', {
//            maxAge: 10,
//            onExpire: function (key, value, done) {
//                done(key, value, 'executed global callback');
//            }
//        });
//        cache.put('item', 'value');
//        waits(100);
//        runs(function () {
//            cache.get('item', function (key, value, test) {
//                expect(key).toEqual('item');
//                expect(value).toEqual('value');
//                expect(test).toEqual('executed global callback');
//            });
//        });
//    });
//    it('should execute globally configured \'onExpire\' callback when an item is aggressively deleted and global \'onExpire\' callback is configured', function () {
//        var onExpire = jasmine.createSpy();
//        var cache = $angularCacheFactory('cache', {
//            maxAge: 10,
//            deleteOnExpire: 'aggressive',
//            onExpire: onExpire
//        });
//        cache.put('item', 'value');
//        waits(100);
//        runs(function () {
//            $timeout.flush();
//            expect(onExpire).toHaveBeenCalled();
//            expect(onExpire).toHaveBeenCalledWith('item', 'value');
//        });
//    });
//    it('should execute local \'onExpire\' callback if the item is expired in passive mode and global \'onExpire\' callback is NOT configured', function () {
//        var cache = $angularCacheFactory('cache', {
//            maxAge: 10
//        });
//        cache.put('item', 'value');
//        waits(100);
//        runs(function () {
//            cache.get('item', function (key, value) {
//                expect(key).toEqual('item');
//                expect(value).toEqual('value');
//            });
//        });
//    });
//});