/* global TestCacheFactory */
describe('CacheFactory.keySet()', function () {
  it('should return the set of keys of all caches in CacheFactory.', function (done) {
    var cacheKeys = ['CacheFactory.keySet.cache', 'CacheFactory.keySet.cache1', 'CacheFactory.keySet.cache2']

    TestCacheFactory.createCache(cacheKeys[0])
    TestCacheFactory.createCache(cacheKeys[1])
    TestCacheFactory.createCache(cacheKeys[2])

    var keySet = TestCacheFactory.keySet()

    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), true)
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), true)
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), true)

    assert.equal(keySet[cacheKeys[0]], cacheKeys[0])
    assert.equal(keySet[cacheKeys[1]], cacheKeys[1])
    assert.equal(keySet[cacheKeys[2]], cacheKeys[2])

    TestCacheFactory.get(cacheKeys[0]).destroy()
    keySet = TestCacheFactory.keySet()
    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), false)
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), true)
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), true)
    assert.isUndefined(keySet[cacheKeys[0]])
    assert.equal(keySet[cacheKeys[1]], cacheKeys[1])
    assert.equal(keySet[cacheKeys[2]], cacheKeys[2])

    TestCacheFactory.get(cacheKeys[1]).destroy()
    keySet = TestCacheFactory.keySet()
    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), false)
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), false)
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), true)
    assert.isUndefined(keySet[cacheKeys[0]])
    assert.isUndefined(keySet[cacheKeys[1]])
    assert.equal(keySet[cacheKeys[2]], cacheKeys[2])

    TestCacheFactory.get(cacheKeys[2]).destroy()

    keySet = TestCacheFactory.keySet()

    assert.equal(keySet.hasOwnProperty(cacheKeys[0]), false)
    assert.equal(keySet.hasOwnProperty(cacheKeys[1]), false)
    assert.equal(keySet.hasOwnProperty(cacheKeys[2]), false)
    assert.isUndefined(keySet[cacheKeys[0]])
    assert.isUndefined(keySet[cacheKeys[1]])
    assert.isUndefined(keySet[cacheKeys[2]])

    done()
  })
})
