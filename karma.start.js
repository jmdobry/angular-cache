var fail = function (msg) {
    assert.equal('should not reach this!: ' + msg, 'failure');
  },
  TYPES_EXCEPT_STRING = [123, 123.123, null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_ARRAY = [123, 123.123, null, undefined, {}, true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_NUMBER = [null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER = [null, undefined, {}, true, false, function () {
  }],
  TYPES_EXCEPT_NUMBER = ['string', null, undefined, {}, [], true, false, function () {
  }],
  TYPES_EXCEPT_OBJECT = ['string', 123, 123.123, null, undefined, true, false, function () {
  }],
  TYPES_EXCEPT_BOOLEAN = ['string', 123, 123.123, null, undefined, {}, [], function () {
  }],
  TYPES_EXCEPT_FUNCTION = ['string', 123, 123.123, null, undefined, {}, [], true, false],
  CACHE_DEFAULTS = {
    capacity: Number.MAX_VALUE,
    maxAge: Number.MAX_VALUE,
    deleteOnExpire: 'none',
    onExpire: null,
    cacheFlushInterval: null,
    recycleFreq: 1000,
    storageMode: 'memory',
    storageImpl: null,
    disabled: false,
    storagePrefix: 'ac.'
  };

var TestDSCacheFactoryProvider, TestDSCacheFactory, TestDSBinaryHeap, $q, $rootScope, $http, $httpBackend;

beforeEach(module('angular-data.DSCacheFactory', function (_DSCacheFactoryProvider_) {
  TestDSCacheFactoryProvider = _DSCacheFactoryProvider_;
}));
beforeEach(inject(function (_DSCacheFactory_, _DSBinaryHeap_, _$q_, _$rootScope_, _$http_, _$httpBackend_) {
  TestDSCacheFactory = _DSCacheFactory_;
  TestDSBinaryHeap = _DSBinaryHeap_;
  $q = _$q_;
  $rootScope = _$rootScope_;
  $rootScope.$safeApply = function () {
    var $scope, fn, force = false;
    if (arguments.length === 1) {
      var arg = arguments[0];
      if (typeof arg === 'function') {
        fn = arg;
      } else {
        $scope = arg;
      }
    } else {
      $scope = arguments[0];
      fn = arguments[1];
      if (arguments.length === 3) {
        force = !!arguments[2];
      }
    }
    $scope = $scope || this;
    fn = fn || function () {
    };
    if (force || !$scope.$$phase) {
      if ($scope.$apply) {
        $scope.$apply(fn);
      } else {
        $scope.apply(fn);
      }
    } else {
      fn();
    }
  };
  $http = _$http_;
  $httpBackend = _$httpBackend_;
}));
afterEach(function () {
  TestDSCacheFactory.destroyAll();
});
