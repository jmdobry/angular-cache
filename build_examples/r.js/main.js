require.config({
  paths: {
    angular: '../../bower_components/angular/angular',
    'angular-cache': '../../dist/angular-cache',
  },
  shim: {
    'angular': {
      exports: 'angular'
    }
  }
});

require([
    'angular',
    'app'
  ], function (angular, app) {
    angular.element(document.getElementsByTagName('html')[0]).ready(function () {
      // bootstrap the app manually
      angular.bootstrap(document, ['app']);
    });
  }
);
