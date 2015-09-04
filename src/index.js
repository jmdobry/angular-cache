let angular = require('angular');
let CacheFactory = require('cachefactory');

CacheFactory.utils.equals = angular.equals;
CacheFactory.utils.isObject = angular.isObject;
CacheFactory.utils.fromJson = angular.fromJson;

class BinaryHeapProvider {
  constructor() {
    this.$get = () => CacheFactory.BinaryHeap;
  }
}

class CacheFactoryProvider {
  constructor() {
    this.defaults = CacheFactory.defaults;

    this.$get = ['$q', $q => {
      CacheFactory.utils.Promise = $q;
      return CacheFactory;
    }];
  }
}

angular.module('angular-cache', [])
  .provider('BinaryHeap', BinaryHeapProvider)
  .provider('CacheFactory', CacheFactoryProvider);

module.exports = 'angular-cache';
module.exports.name = 'angular-cache';
