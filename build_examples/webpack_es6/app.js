import angular from 'angular';
import angularCacheModuleName from 'angular-cache';

let app = angular.module('app', [
  angularCacheModuleName
]).run($rootScope => {
  $rootScope.test = 'It works, imported ' + angularCacheModuleName;
});
