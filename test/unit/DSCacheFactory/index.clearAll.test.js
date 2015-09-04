describe('CacheFactory.clearAll()', function () {
  it('should call "removeAll()" on all caches.', function () {
    var cacheKeys = ['CacheFactory.clearAll.cache', 'CacheFactory.clearAll.cache1', 'CacheFactory.clearAll.cache2'],
      caches = [];

    caches.push(TestCacheFactory(cacheKeys[0]));
    caches[0].put('item', 'value');
    caches[0].put('item2', 'value2');
    caches.push(TestCacheFactory(cacheKeys[1]));
    caches[1].put('item', 'value');
    caches[1].put('item2', 'value2');
    caches.push(TestCacheFactory(cacheKeys[2]));
    caches[2].put('item', 'value');
    caches[2].put('item2', 'value2');

    sinon.spy(caches[0], 'removeAll');
    sinon.spy(caches[1], 'removeAll');
    sinon.spy(caches[2], 'removeAll');

    TestCacheFactory.clearAll();

    assert.equal(caches[0].removeAll.callCount, 1);
    assert.equal(caches[1].removeAll.callCount, 1);
    assert.equal(caches[2].removeAll.callCount, 1);
  });
  it('should result in each cache being cleared.', function () {
    var cacheKeys = ['CacheFactory.clearAll.cache', 'CacheFactory.clearAll.cache1', 'CacheFactory.clearAll.cache2'],
      caches = [];

    caches.push(TestCacheFactory(cacheKeys[0]));
    caches[0].put('item', 'value');
    caches[0].put('item2', 'value2');
    caches.push(TestCacheFactory(cacheKeys[1]));
    caches[1].put('item', 'value');
    caches[1].put('item2', 'value2');
    caches.push(TestCacheFactory(cacheKeys[2]));
    caches[2].put('item', 'value');
    caches[2].put('item2', 'value2');

    assert.isDefined(caches[0].get('item'));
    assert.isDefined(caches[1].get('item'));
    assert.isDefined(caches[2].get('item'));
    assert.isDefined(caches[0].get('item2'));
    assert.isDefined(caches[1].get('item2'));
    assert.isDefined(caches[2].get('item2'));

    TestCacheFactory.clearAll();

    assert.isUndefined(caches[0].get('item'));
    assert.isUndefined(caches[1].get('item'));
    assert.isUndefined(caches[2].get('item'));
    assert.isUndefined(caches[0].get('item2'));
    assert.isUndefined(caches[1].get('item2'));
    assert.isUndefined(caches[2].get('item2'));
    assert.equal(caches[0].info().size, 0);
    assert.equal(caches[1].info().size, 0);
    assert.equal(caches[2].info().size, 0);
  });
});
