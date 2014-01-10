describe('$angularCacheFactory.enableAll()', function () {
	it('should enable all caches in $angularCacheFactory.', function () {
		var cacheKeys = ['cache', 'cache1', 'cache2'];

		$angularCacheFactory(cacheKeys[0], { disabled: true });
		$angularCacheFactory(cacheKeys[1]);
		$angularCacheFactory(cacheKeys[2], { disabled: true });

		expect($angularCacheFactory.get(cacheKeys[0]).info().disabled).toEqual(true);
		expect($angularCacheFactory.get(cacheKeys[1]).info().disabled).toEqual(false);
		expect($angularCacheFactory.get(cacheKeys[2]).info().disabled).toEqual(true);

		$angularCacheFactory.enableAll();

		expect($angularCacheFactory.get(cacheKeys[0]).info().disabled).toEqual(false);
		expect($angularCacheFactory.get(cacheKeys[1]).info().disabled).toEqual(false);
		expect($angularCacheFactory.get(cacheKeys[2]).info().disabled).toEqual(false);
	});
});
