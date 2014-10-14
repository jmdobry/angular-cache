var fail = function (msg) {
    expect('should not reach this!: ' + msg).toEqual('failure');
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
    maxAge: null,
    deleteOnExpire: 'none',
    onExpire: null,
    cacheFlushInterval: null,
    recycleFreq: 1000,
    storageMode: 'none',
    storageImpl: null,
    verifyIntegrity: true,
    disabled: false,
    storePromises: false
  };

var $angularCacheFactoryProvider, $angularCacheFactory, BinaryHeap, $q, $rootScope, $httpBackend, $http;
beforeEach(module('jmdobry.angular-cache', function (_$angularCacheFactoryProvider_) {
  $angularCacheFactoryProvider = _$angularCacheFactoryProvider_;
}));
beforeEach(inject(function (_$angularCacheFactory_, _BinaryHeap_, _$q_, _$rootScope_, _$httpBackend_, _$http_) {
  $angularCacheFactory = _$angularCacheFactory_;
  BinaryHeap = _BinaryHeap_;
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
  $httpBackend = _$httpBackend_;
  $http = _$http_;
}));
afterEach(function () {
  $angularCacheFactory.removeAll();
});
