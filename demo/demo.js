var app = angular.module('app', ['angular-cache']);

app.controller('DemoCtrl', function ($log, $scope, DemoService, $angularCacheFactory) {
    'use strict';

    function _getHtml(json) {
        return hljs.highlight('json', JSON.stringify(json, null, 2)).value;
    }

    /**
     * Get the latest info for each cache.
     * @private
     */
    function _updateInfo() {
        if (!$scope.editingDefaultCache) {
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
            for (i = 0; i < DemoService.caches.length; i++) {
                var onExpire = DemoService.caches[i].info().onExpire;
                if (onExpire) {
                    $scope.onExpires[i] = hljs.highlight('javascript', onExpire.toString()).value.replace(/    /g, ' ');
                }
            }
        }
    }

    /**
     * Retrieve the value of selectedKey from all caches.
     * @private
     */
    function _get() {
        for (var i = 0; i < DemoService.caches.length; i++) {
            if (i === 2) {
                $scope.selectedValues[i] = DemoService.caches[i].get($scope.selectedKey, function (key, value) {
                    $log.log('I am called via "done()" in the passive mode "onExpire" callback.')
                }) || "undefined";
            } else {
                $scope.selectedValues[i] = DemoService.caches[i].get($scope.selectedKey) || "undefined";
            }
        }
    }

    /**
     * Add an item to each cache.
     * @private
     */
    function _add() {
        var newCount = $scope.count++,
            newValue = Math.floor((Math.random() * 100000) + 1);
        DemoService.add(newCount.toString(), newValue);
        _updateInfo();
    }

    function _reset() {
        $scope.count = 1;
        $scope.defaultCacheOptions = {
            capacity: Number.MAX_VALUE,
            maxAge: null,
            cacheFlushInterval: null,
            storageMode: null
        };
        DemoService.reset();
    }

    function _editDefaultCache() {
        $scope.editingDefaultCache = true;
    }

    function _saveDefaultCache() {
        DemoService.caches[0].setOptions({
            capacity: parseFloat($scope.defaultCacheOptions.capacity),
            maxAge: parseInt($scope.defaultCacheOptions.maxAge, 10),
            cacheFlushInterval: parseInt($scope.defaultCacheOptions.cacheFlushInterval, 10),
            aggressiveDelete: !!($scope.defaultCacheOptions.aggressiveDelete == 'true'),
            storageMode: $scope.defaultCacheOptions.storageMode
        }, true);
        $scope.editingDefaultCache = false;
    }

    function _cancelDefaultCache() {
        $scope.editingDefaultCache = false;
    }

    /**
     * Setup the $scope
     * @private
     */
    function _init() {
        // Setup $scope data
        $scope.count = 1;
        $scope.infos = [];
        $scope.keySets = [];
        $scope.keys = [];
        $scope.onExpires = [];
        $scope.editingDefaultCache = false;
        $scope.defaultCacheOptions = {
            capacity: Number.MAX_VALUE,
            maxAge: null,
            cacheFlushInterval: null,
            storageMode: null
        };
        $scope.selectedKey = "0";
        $scope.selectedValues = new Array(DemoService.caches.length + 1).join('0').split('');

        // Setup $scope methods
        $scope.add = _add;
        $scope.get = _get;
        $scope.reset = _reset;
        $scope.editDefaultCache = _editDefaultCache;
        $scope.saveDefaultCache = _saveDefaultCache;
        $scope.cancelDefaultCache = _cancelDefaultCache;

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

app.service('DemoService', function ($log, $angularCacheFactory) {
    'use strict';
    return {
        caches: [
            $angularCacheFactory('defaultCache'),
            $angularCacheFactory('capacityCache', {
                capacity: 10,
                storageMode: 'localStorage'
            }),
            $angularCacheFactory('maxAgeCache', {
                maxAge: 7000,
                onExpire: function (key, value, done) {
                    $log.log(key + ' expired');
                    $log.log('Passive mode onExpire callback executed.');
                    done(key, value);
                }
            }),
            $angularCacheFactory('aggressiveDeleteCache', {
                maxAge: 4000,
                aggressiveDelete: true,
                onExpire: function (key, value) {
                    $log.log(key + ' expired');
                    $log.log('Aggressive mode onExpire callback executed.');
                }
            }),
            $angularCacheFactory('flushingCache', {
                cacheFlushInterval: 15000,
                storageMode: 'sessionStorage'
            })
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
            this.caches[0].setOptions({}, true);
        }
    };
});

app.filter('milliseconds', function () {
    return function (key) {
        return key ? key + ' ms' : null;
    };
});