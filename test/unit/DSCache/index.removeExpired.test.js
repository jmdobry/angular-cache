describe('DSCache.removeExpired()', function () {
  it('should remove all expired items when deleteOnExpire is "none".', function (done) {
    var cache = TestDSCacheFactory('cache', {
      deleteOnExpire: 'none',
      maxAge: 10,
      recycleFreq: 20
    });
    var value1 = 'value1',
      value2 = 2,
      value3 = {
        value3: 'stuff'
      };
    cache.put('item1', value1);
    cache.put('item2', value2);
    cache.put('item3', value3);
    setTimeout(function () {
      var expired = cache.removeExpired();
      assert.deepEqual(expired, {
        item1: value1,
        item2: value2,
        item3: value3
      });
      assert.equal(cache.info().size, 0);
      cache.put('item3', value3);
      assert.equal(cache.info().size, 1);
      done();
    }, 100);
  });
//	it('should remove all expired items when deleteOnExpire is "passive".', function (done) {
//		var cache = TestDSCacheFactory('cache', {
//			deleteOnExpire: 'passive',
//			maxAge: 10,
//			recycleFreq: 20
//		});
//		var value1 = 'value1',
//			value2 = 2,
//			value3 = {
//				value3: 'stuff'
//			};
//		cache.put('item1', value1);
//		cache.put('item2', value2);
//		cache.put('item3', value3);
//		setTimeout(function () {
//			var expired = cache.removeExpired();
//			assert.deepEqual(expired, {
//				item1: value1,
//				item2: value2,
//				item3: value3
//			});
//			assert.equal(cache.info().size, 0);
//			cache.put('item3', value3);
//			assert.equal(cache.info().size, 1);
//			done();
//		}, 100);
//	});
//	it('should remove all expired items when deleteOnExpire is "aggressive".', function (done) {
//		var cache = TestDSCacheFactory('cache', {
//			deleteOnExpire: 'aggressive',
//			maxAge: 10,
//			recycleFreq: 20
//		});
//		var value1 = 'value1',
//			value2 = 2,
//			value3 = {
//				value3: 'stuff'
//			};
//		cache.put('item1', value1);
//		cache.put('item2', value2);
//		cache.put('item3', value3);
//		setTimeout(function () {
//			var expired = cache.removeExpired();
//			assert.deepEqual(expired, {});
//			assert.equal(cache.info().size, 0);
//			cache.put('item3', value3);
//			assert.equal(cache.info().size, 1);
//			done();
//		}, 100);
//	});
});
