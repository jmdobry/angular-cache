describe('CacheFactory#createCache', function () {
  it('should work with ngResource.', function () {
    const cache = cacheFactory.createCache(testId)
    cache.put('test', 'value')
    assert.equal(cache.get('test'), 'value')
    const copyCache = angular.copy(cache)
    assert.equal(copyCache.get('test'), 'value')
    $httpBackend.expectGET('/api/card').respond(200, {
      username: 'test'
    })
    const CreditCard = $resource(
      '/api/card',
      null,
      { charge: { method: 'GET', cache: cache } }
    )
    const card = new CreditCard()
    card.$charge()
    $httpBackend.flush()
    card.$charge().then()
  })
})
