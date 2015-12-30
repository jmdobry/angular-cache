const angular = require('angular')
const CacheFactory = require('cachefactory')

CacheFactory.utils.equals = angular.equals
CacheFactory.utils.isObject = angular.isObject
CacheFactory.utils.fromJson = angular.fromJson

function BinaryHeapProvider () {
  this.$get = function () { return CacheFactory.BinaryHeap }
}

function CacheFactoryProvider () {
  this.defaults = CacheFactory.defaults
  this.defaults.storagePrefix = 'angular-cache.caches.'

  this.$get = ['$q', function ($q) {
    CacheFactory.utils.Promise = $q
    return CacheFactory
  }]
}

angular.module('angular-cache', [])
  .provider('BinaryHeap', BinaryHeapProvider)
  .provider('CacheFactory', CacheFactoryProvider)

module.exports = 'angular-cache'
try {
  module.exports.name = 'angular-cache'
} catch (err) {

}

