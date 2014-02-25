describe('DSCacheFactory.destroyAll()', function () {
	it('should call "destroy()" on all caches currently owned by the factory.', function (done) {
		var cacheKeys = ['DSCacheFactory.destroyAll.cache', 'DSCacheFactory.destroyAll.cache1', 'DSCacheFactory.destroyAll.cache2'],
			caches = [];

		caches.push(DSCacheFactory(cacheKeys[0]));
		caches.push(DSCacheFactory(cacheKeys[1]));
		caches.push(DSCacheFactory(cacheKeys[2]));

		sinon.spy(caches[0], 'destroy');
		sinon.spy(caches[1], 'destroy');
		sinon.spy(caches[2], 'destroy');
		DSCacheFactory.destroyAll();

		assert.equal(caches[0].destroy.callCount, 1);
		assert.equal(caches[1].destroy.callCount, 1);
		assert.equal(caches[2].destroy.callCount, 1);

		done();
	});
	it('should result in all caches being removed from DSCacheFactory.', function (done) {
		var cacheKeys = ['DSCacheFactory.destroyAll.cache', 'DSCacheFactory.destroyAll.cache1', 'DSCacheFactory.destroyAll.cache2'],
			caches = [];

		caches.push(DSCacheFactory(cacheKeys[0]));
		caches.push(DSCacheFactory(cacheKeys[1]));
		caches.push(DSCacheFactory(cacheKeys[2]));

		DSCacheFactory.destroyAll();

		assert.isUndefined(DSCacheFactory.get(cacheKeys[0]));
		assert.isUndefined(DSCacheFactory.get(cacheKeys[1]));
		assert.isUndefined(DSCacheFactory.get(cacheKeys[2]));

		done();
	});
});
