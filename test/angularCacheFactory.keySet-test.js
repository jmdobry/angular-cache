describe('$angularCacheFactory.keySet()', function () {
  it('should return the set of keys of all caches in $angularCacheFactory.', function () {
    var cacheKeys = ['cache', 'cache1', 'cache2'];

    $angularCacheFactory(cacheKeys[0]);
    $angularCacheFactory(cacheKeys[1]);
    $angularCacheFactory(cacheKeys[2]);

    var keySet = $angularCacheFactory.keySet();

    expect(keySet.hasOwnProperty(cacheKeys[0])).toEqual(true);
    expect(keySet.hasOwnProperty(cacheKeys[1])).toEqual(true);
    expect(keySet.hasOwnProperty(cacheKeys[2])).toEqual(true);

    expect(keySet[cacheKeys[0]]).toEqual(cacheKeys[0]);
    expect(keySet[cacheKeys[1]]).toEqual(cacheKeys[1]);
    expect(keySet[cacheKeys[2]]).toEqual(cacheKeys[2]);

    $angularCacheFactory.get(cacheKeys[0]).destroy();
    keySet = $angularCacheFactory.keySet();
    expect(keySet.hasOwnProperty(cacheKeys[0])).toEqual(false);
    expect(keySet.hasOwnProperty(cacheKeys[1])).toEqual(true);
    expect(keySet.hasOwnProperty(cacheKeys[2])).toEqual(true);
    expect(keySet[cacheKeys[0]]).not.toBeDefined();
    expect(keySet[cacheKeys[1]]).toEqual(cacheKeys[1]);
    expect(keySet[cacheKeys[2]]).toEqual(cacheKeys[2]);

    $angularCacheFactory.get(cacheKeys[1]).destroy();
    keySet = $angularCacheFactory.keySet();
    expect(keySet.hasOwnProperty(cacheKeys[0])).toEqual(false);
    expect(keySet.hasOwnProperty(cacheKeys[1])).toEqual(false);
    expect(keySet.hasOwnProperty(cacheKeys[2])).toEqual(true);
    expect(keySet[cacheKeys[0]]).not.toBeDefined();
    expect(keySet[cacheKeys[1]]).not.toBeDefined();
    expect(keySet[cacheKeys[2]]).toEqual(cacheKeys[2]);

    $angularCacheFactory.get(cacheKeys[2]).destroy();

    keySet = $angularCacheFactory.keySet();

    expect(keySet.hasOwnProperty(cacheKeys[0])).toEqual(false);
    expect(keySet.hasOwnProperty(cacheKeys[1])).toEqual(false);
    expect(keySet.hasOwnProperty(cacheKeys[2])).toEqual(false);
    expect(keySet[cacheKeys[0]]).not.toBeDefined();
    expect(keySet[cacheKeys[1]]).not.toBeDefined();
    expect(keySet[cacheKeys[2]]).not.toBeDefined();
  });
});
