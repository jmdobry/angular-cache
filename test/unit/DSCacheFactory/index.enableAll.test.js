describe('DSCacheFactory.enableAll()', function () {
	it('should enable all caches in DSCacheFactory.', function (done) {
		var cacheKeys = ['DSCacheFactory.enableAll.cache', 'DSCacheFactory.enableAll.cache1', 'DSCacheFactory.enableAll.cache2'];

		DSCacheFactory(cacheKeys[0], { disabled: true });
		DSCacheFactory(cacheKeys[1]);
		DSCacheFactory(cacheKeys[2], { disabled: true });

		assert.equal(DSCacheFactory.get(cacheKeys[0]).info().disabled, true);
		assert.equal(DSCacheFactory.get(cacheKeys[1]).info().disabled, false);
		assert.equal(DSCacheFactory.get(cacheKeys[2]).info().disabled, true);

		DSCacheFactory.enableAll();

		assert.equal(DSCacheFactory.get(cacheKeys[0]).info().disabled, false);
		assert.equal(DSCacheFactory.get(cacheKeys[1]).info().disabled, false);
		assert.equal(DSCacheFactory.get(cacheKeys[2]).info().disabled, false);

		done();
	});
});
