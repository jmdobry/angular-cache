/* global before, inject */
/* eslint-disable no-unused-vars */
var fail = function (msg) {
  assert.equal('should not reach this!: ' + msg, 'failure')
}
var TYPES_EXCEPT_STRING = [
  123, 123.123, {}, [], true, false, function () {
  }
]
var TYPES_EXCEPT_STRING_OR_ARRAY = [
  123, 123.123, null, undefined, {}, true, false, function () {
  }
]
var TYPES_EXCEPT_STRING_OR_NUMBER = [
  null, undefined, {}, [], true, false, function () {
  }
]
var TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER = [
  null, undefined, {}, true, false, function () {
  }
]
var TYPES_EXCEPT_NUMBER = [
  'string', {}, [], true, false, function () {
  }
]
var TYPES_EXCEPT_OBJECT = [
  'string', 123, 123.123, null, undefined, true, false, function () {
  }
]
var TYPES_EXCEPT_BOOLEAN = [
  'string', 123, 123.123, null, undefined, {}, [], function () {
  }
]
var TYPES_EXCEPT_FUNCTION = ['string', 123, 123.123, null, undefined, {}, [], true, false]
var CACHE_DEFAULTS = {
  capacity: Number.MAX_VALUE,
  maxAge: Number.MAX_VALUE,
  deleteOnExpire: 'none',
  onExpire: null,
  cacheFlushInterval: null,
  recycleFreq: 1000,
  storageMode: 'memory',
  storageImpl: null,
  enabled: true,
  storagePrefix: 'ac.'
}

assert.objectsEqual = function (a, b, msg) {
  assert.equal(JSON.parse(JSON.stringify(a)), JSON.parse(JSON.stringify(b)), msg)
}

var app, TestCacheFactoryProvider, TestCacheFactory, $q, $rootScope, $httpProvider, $http, $httpBackend, $resource, BinaryHeap

app = angular.module('app', ['ngResource'])

before(function () {
  localStorage.clear()
})

beforeEach(module('app'))

beforeEach(module('angular-cache', function (_CacheFactoryProvider_, _$httpProvider_) {
  $httpProvider = _$httpProvider_
  $httpProvider.useLegacyPromiseExtensions && $httpProvider.useLegacyPromiseExtensions(false) // note: to suuport promises in angular >1.4.4 <1.6.x
  TestCacheFactoryProvider = _CacheFactoryProvider_
}))

beforeEach(inject(function (_$resource_) {
  $resource = _$resource_
}))

beforeEach(inject(function (_CacheFactory_, _BinaryHeap_, _$q_, _$rootScope_, _$http_, _$httpBackend_) {
  TestCacheFactory = _CacheFactory_
  angular.extend(TestCacheFactoryProvider.defaults, CACHE_DEFAULTS)
  TestCacheFactory.destroyAll()
  $q = _$q_
  $rootScope = _$rootScope_
  BinaryHeap = _BinaryHeap_
  $rootScope.$safeApply = function () {
    var $scope
    var fn
    var force = false
    if (arguments.length === 1) {
      var arg = arguments[0]
      if (typeof arg === 'function') {
        fn = arg
      } else {
        $scope = arg
      }
    } else {
      $scope = arguments[0]
      fn = arguments[1]
      if (arguments.length === 3) {
        force = !!arguments[2]
      }
    }
    $scope = $scope || this
    fn = fn || function () { }
    if (force || !$scope.$$phase) {
      if ($scope.$apply) {
        $scope.$apply(fn)
      } else {
        $scope.apply(fn)
      }
    } else {
      fn()
    }
  }
  $http = _$http_
  $httpBackend = _$httpBackend_
}))

afterEach(function () {
  $httpBackend.verifyNoOutstandingRequest()
  $httpBackend.verifyNoOutstandingExpectation()
})

