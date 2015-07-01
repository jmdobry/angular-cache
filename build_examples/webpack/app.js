var angular = require('angular');
var angularCacheModuleName = require('angular-cache');

var app = angular.module('app', [
  angularCacheModuleName
]).run(function ($rootScope) {
  $rootScope.test = 'It works, imported ' + angularCacheModuleName;
});
