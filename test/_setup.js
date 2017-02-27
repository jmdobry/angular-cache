import { assert } from 'chai'
import sinon from 'sinon'

window.pp = function pp (obj) {
  console.log(JSON.stringify(obj, null, 2))
}

assert.objectsEqual = function (a, b, msg) {
  assert.deepEqual(
    JSON.parse(JSON.stringify(a)),
    JSON.parse(JSON.stringify(b)),
    msg || 'Expected objects or arrays to be equal'
  )
}

assert.objectsNotEqual = function (a, b, msg) {
  assert.notDeepEqual(
    JSON.parse(JSON.stringify(a)),
    JSON.parse(JSON.stringify(b)),
    msg || 'Expected objects or arrays to be equal'
  )
}

export {
  assert,
  sinon
}

var i = 0

window.app = angular.module('app', ['ngResource', 'angular-cache'])

beforeEach(angular.mock.module('app'))

beforeEach(angular.mock.inject(function (_$resource_) {
  window.$resource = _$resource_
}))

beforeEach(angular.mock.inject(function (_CacheFactory_, _BinaryHeap_, _$q_, _$rootScope_, _$http_, _$httpBackend_) {
  i++
  window.testId = 'my-cache-' + i
  window.cacheFactory = _CacheFactory_
  window.cacheFactory.destroyAll()
  window.$q = _$q_
  window.$rootScope = _$rootScope_
  window.BinaryHeap = _BinaryHeap_
  window.$rootScope.$safeApply = function () {
    var $scope, fn, force = false
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
    fn = fn || function () {
      }
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
  window.$http = _$http_
  window.$httpBackend = _$httpBackend_
}))

afterEach(function () {
  window.$httpBackend.verifyNoOutstandingRequest()
  window.$httpBackend.verifyNoOutstandingExpectation()
})
