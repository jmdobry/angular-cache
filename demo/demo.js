'use strict';
var app = angular.module('app', ['angular-cache']);

app.controller('DemoCtrl', function ($scope, DemoService, $angularCacheFactory) {

    function _getHtml(json) {
        return hljs.highlight('json', JSON.stringify(json, null, 2)).value;
    }

    /**
     * Get the latest info for each cache.
     * @private
     */
    function _updateInfo() {
        $scope.angularCacheFactoryInfo = _getHtml($angularCacheFactory.info());
        $scope.angularCacheFactoryKeySet = _getHtml($angularCacheFactory.keySet());
        $scope.defaultCacheInfo = DemoService.defaultCache.info();
        $scope.capacityCacheInfo = DemoService.capacityCache.info();
        $scope.maxAgeCacheInfo = DemoService.maxAgeCache.info();
        $scope.flushingCacheInfo = DemoService.flushingCache.info();
        $scope.defaultCacheKeySet = _getHtml(DemoService.defaultCache.keySet());
        $scope.capacityCacheKeySet = _getHtml(DemoService.capacityCache.keySet());
        $scope.maxAgeCacheKeySet = _getHtml(DemoService.maxAgeCache.keySet());
        $scope.flushingCacheKeySet = _getHtml(DemoService.flushingCache.keySet());
        $scope.defaultCacheKeys = _getHtml(DemoService.defaultCache.keys());
        $scope.capacityCacheKeys = _getHtml(DemoService.capacityCache.keys());
        $scope.maxAgeCacheKeys = _getHtml(DemoService.maxAgeCache.keys());
        $scope.flushingCacheKeys = _getHtml(DemoService.flushingCache.keys());

    }

    /**
     * Add an item to each cache.
     * @private
     */
    function _add() {
        var newCount = $scope.count++;
        DemoService.add(newCount.toString(), newCount);
        _updateInfo();
    }

    function _reset() {
        $scope.count = 1;
        DemoService.reset();
    }

    /**
     * Setup the $scope
     * @private
     */
    function _init() {
        $scope.count = 1;
        $scope.add = _add;
        $scope.reset = _reset;
        _updateInfo();
        $scope.intervalId = setInterval(function () {
            $scope.$apply(function () {
                _updateInfo();
            });
        }, 333);
    }

    // Kick things off
    _init();
});

app.service('DemoService', function ($angularCacheFactory) {
    return {
        defaultCache: $angularCacheFactory('defaultCache'),
        capacityCache: $angularCacheFactory('capacityCache', { capacity: 10 }),
        maxAgeCache: $angularCacheFactory('maxAgeCache', { maxAge: 4000 }),
        flushingCache: $angularCacheFactory('flushingCache', { cacheFlushInterval: 4000 }),
        add: function (key, value) {
            this.defaultCache.put(key, value);
            this.capacityCache.put(key, value);
            this.maxAgeCache.put(key, value);
            this.flushingCache.put(key, value);
        },
        reset: function () {
            this.defaultCache.removeAll();
            this.capacityCache.removeAll();
            this.maxAgeCache.removeAll();
            this.flushingCache.removeAll();
        }
    };
});

app.filter('milliseconds', function () {
    return function (key) {
        return key ? key + ' ms' : null;
    };
});