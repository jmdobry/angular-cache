describe('DSCacheFactory.disableAll()', function () {
	it('should disable all caches in DSCacheFactory.', function (done) {
		var cacheKeys = ['DSCacheFactory.disableAll.cache', 'DSCacheFactory.disableAll.cache1', 'DSCacheFactory.disableAll.cache2'];

		DSCacheFactory(cacheKeys[0]);
		DSCacheFactory(cacheKeys[1], { disabled: true });
		DSCacheFactory(cacheKeys[2]);

		assert.equal(DSCacheFactory.get(cacheKeys[0]).info().disabled, false);
		assert.equal(DSCacheFactory.get(cacheKeys[1]).info().disabled, true);
		assert.equal(DSCacheFactory.get(cacheKeys[2]).info().disabled, false);

		DSCacheFactory.disableAll();

		assert.equal(DSCacheFactory.get(cacheKeys[0]).info().disabled, true);
		assert.equal(DSCacheFactory.get(cacheKeys[1]).info().disabled, true);
		assert.equal(DSCacheFactory.get(cacheKeys[2]).info().disabled, true);

		done();
	});
});
