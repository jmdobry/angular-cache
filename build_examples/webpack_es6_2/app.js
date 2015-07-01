import 'angular';
import 'angular-cache';

let app = angular.module('app', [
  'angular-cache'
]).run(($rootScope, CacheFactory) => {
  $rootScope.test = 'It works, imported ' + (CacheFactory ? 'angular-cache' : 'undefined');
});
