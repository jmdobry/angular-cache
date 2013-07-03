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
        for (var i = 0; i < DemoService.caches.length; i++) {
            $scope.infos[i] = DemoService.caches[i].info();
        }
        for (i = 0; i < DemoService.caches.length; i++) {
            $scope.keySets[i] = _getHtml(DemoService.caches[i].keySet());
        }
        for (i = 0; i < DemoService.caches.length; i++) {
            $scope.keys[i] = _getHtml(DemoService.caches[i].keys());
        }
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
        DemoService.reset();
    }

    function _setOptions() {
        console.info('_setOptions');
        DemoService.caches[0].setOptions({
            capacity: 10
        });
    }

    /**
     * Setup the $scope
     * @private
     */
    function _init() {
        $scope.count = 1;
        $scope.infos = [];
        $scope.keySets = [];
        $scope.keys = [];
        $scope.add = _add;
        $scope.reset = _reset;
        $scope.setOptions = _setOptions;
        $scope.default = {

        };
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
        caches: [
            $angularCacheFactory('defaultCache'),
            $angularCacheFactory('capacityCache', { capacity: 10 }),
            $angularCacheFactory('maxAgeCache', { maxAge: 4000 }),
            $angularCacheFactory('flushingCache', { cacheFlushInterval: 4000 })
        ],
        add: function (key, value) {
            for (var i = 0; i < this.caches.length; i++) {
                this.caches[i].put(key, value);
            }
        },
        reset: function () {
            for (var i = 0; i < this.caches.length; i++) {
                this.caches[i].removeAll();
            }
        }
    };
});

app.filter('milliseconds', function () {
    return function (key) {
        return key ? key + ' ms' : null;
    };
});