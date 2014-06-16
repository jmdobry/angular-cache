describe('$angularCacheFactory.disableAll()', function () {
  it('should disable all caches in $angularCacheFactory.', function () {
    var cacheKeys = ['cache', 'cache1', 'cache2'];

    $angularCacheFactory(cacheKeys[0]);
    $angularCacheFactory(cacheKeys[1], { disabled: true });
    $angularCacheFactory(cacheKeys[2]);

    expect($angularCacheFactory.get(cacheKeys[0]).info().disabled).toEqual(false);
    expect($angularCacheFactory.get(cacheKeys[1]).info().disabled).toEqual(true);
    expect($angularCacheFactory.get(cacheKeys[2]).info().disabled).toEqual(false);

    $angularCacheFactory.disableAll();

    expect($angularCacheFactory.get(cacheKeys[0]).info().disabled).toEqual(true);
    expect($angularCacheFactory.get(cacheKeys[1]).info().disabled).toEqual(true);
    expect($angularCacheFactory.get(cacheKeys[2]).info().disabled).toEqual(true);
  });
});
