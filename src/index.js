import angular from 'angular'
import { BinaryHeap, CacheFactory, defaults, utils } from 'cachefactory'

utils.equals = angular.equals
utils.isObject = angular.isObject
utils.fromJson = angular.fromJson

function BinaryHeapProvider () {
  this.$get = function () { return BinaryHeap }
}

function CacheFactoryProvider () {
  this.defaults = defaults
  this.defaults.storagePrefix = 'angular-cache.caches.'

  this.$get = [
    '$q', function ($q) {
      utils.Promise = $q
      return new CacheFactory()
    }
  ]
}

angular.module('angular-cache', [])
       .provider('BinaryHeap', BinaryHeapProvider)
       .provider('CacheFactory', CacheFactoryProvider)

export default 'angular-cache'
