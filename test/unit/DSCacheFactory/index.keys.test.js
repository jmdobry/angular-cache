describe('DSCacheFactory.keys()', function () {
	it('should return the array of keys of all caches in DSCacheFactory.', function (done) {
		var cacheKeys = ['cache', 'cache1', 'cache2'];

		DSCacheFactory(cacheKeys[0]);
		DSCacheFactory(cacheKeys[1]);
		DSCacheFactory(cacheKeys[2]);

		var keys = DSCacheFactory.keys();
		assert.equal(keys.length, 3);
		assert.equal(keys[0], cacheKeys[0]);
		assert.equal(keys[1], cacheKeys[1]);
		assert.equal(keys[2], cacheKeys[2]);

		DSCacheFactory.get(cacheKeys[0]).destroy();
		keys = DSCacheFactory.keys();
		assert.equal(keys.length, 2);
		assert.notEqual(keys.indexOf(cacheKeys[1]), -1);
		assert.notEqual(keys.indexOf(cacheKeys[2]), -1);

		DSCacheFactory.get(cacheKeys[1]).destroy();
		keys = DSCacheFactory.keys();
		assert.equal(keys.length, 1);
		assert.notEqual(keys.indexOf(cacheKeys[2]), -1);

		DSCacheFactory.get(cacheKeys[2]).destroy();

		keys = DSCacheFactory.keys();

		assert.equal(keys.length, 0);

		done();
	});
});
