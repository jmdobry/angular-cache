define('app', [
  'angular',
  'angular-cache'
], function (angular, angularCacheModuleName) {
  return angular.module('app', ['angular-cache'])
    .run(function ($rootScope) {
      $rootScope.test = 'It works! Using ' + angularCacheModuleName;
    });
});
