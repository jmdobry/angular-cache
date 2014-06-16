describe('$angularCacheFactory.clearAll()', function () {
  it('should call "removeAll()" on all caches in $angularCacheFactory.', function () {
    var cacheKeys = ['cache', 'cache1', 'cache2'],
      caches = [];

    caches.push($angularCacheFactory(cacheKeys[0]));
    caches[0].put('item', 'value');
    caches[0].put('item2', 'value2');
    caches.push($angularCacheFactory(cacheKeys[1]));
    caches[1].put('item', 'value');
    caches[1].put('item2', 'value2');
    caches.push($angularCacheFactory(cacheKeys[2]));
    caches[2].put('item', 'value');
    caches[2].put('item2', 'value2');

    spyOn(caches[0], 'removeAll');
    spyOn(caches[1], 'removeAll');
    spyOn(caches[2], 'removeAll');

    $angularCacheFactory.clearAll();

    expect(caches[0].removeAll.callCount).toEqual(1);
    expect(caches[1].removeAll.callCount).toEqual(1);
    expect(caches[2].removeAll.callCount).toEqual(1);
  });
  it('should result in each cache being cleared.', function () {
    var cacheKeys = ['cache', 'cache1', 'cache2'],
      caches = [];

    caches.push($angularCacheFactory(cacheKeys[0]));
    caches[0].put('item', 'value');
    caches[0].put('item2', 'value2');
    caches.push($angularCacheFactory(cacheKeys[1]));
    caches[1].put('item', 'value');
    caches[1].put('item2', 'value2');
    caches.push($angularCacheFactory(cacheKeys[2]));
    caches[2].put('item', 'value');
    caches[2].put('item2', 'value2');

    $angularCacheFactory.clearAll();

    expect(caches[0].get('item')).not.toBeDefined();
    expect(caches[1].get('item')).not.toBeDefined();
    expect(caches[2].get('item')).not.toBeDefined();
    expect(caches[0].get('item2')).not.toBeDefined();
    expect(caches[1].get('item2')).not.toBeDefined();
    expect(caches[2].get('item2')).not.toBeDefined();
    expect(caches[0].info().size).toEqual(0);
    expect(caches[1].info().size).toEqual(0);
    expect(caches[2].info().size).toEqual(0);
  });
});
