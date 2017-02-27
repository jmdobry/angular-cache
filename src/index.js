import angular from 'angular'
import {
  BinaryHeap,
  CacheFactory,
  defaults,
  utils
} from '../node_modules/cachefactory/dist/cachefactory.es2015.js'

utils.equals = angular.equals
utils.isObject = angular.isObject
utils.fromJson = angular.fromJson

function BinaryHeapProvider () {
  this.$get = function () { return BinaryHeap }
}

function CacheFactoryProvider () {
  this.defaults = defaults
  this.defaults.storagePrefix = 'angular-cache.caches.'

  this.$get = ['$q', function ($q) {
    utils.Promise = $q
    var cacheFactory = new CacheFactory()
    Object.defineProperty(cacheFactory, 'defaults', {
      value: defaults
    })
    return cacheFactory
  }]
}

angular.module('angular-cache', [])
  .provider('BinaryHeap', BinaryHeapProvider)
  .provider('CacheFactory', CacheFactoryProvider)

export default 'angular-cache'
