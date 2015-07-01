var angular = require('angular');

angular.module('app', [
  // this is what you would do in a real app
  // require('angular-cache')

  // for the example to work
  require('../../dist/angular-cache.js')
]).run(function ($rootScope, CacheFactory) {
  $rootScope.test = 'It works! Using ' + (CacheFactory ? 'angular-cache' : 'undefined');
});
