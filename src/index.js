(function (window, angular, undefined) {
	'use strict';

	angular.$$minErr = angular.$$minErr || function (module) {
		return function () {
			var code = arguments[0],
				prefix = '[' + (module ? module + ':' : '') + code + '] ',
				template = arguments[1];

			return new Error(prefix + template);
		};
	};

	angular.module('angular-data.DSBinaryHeap', [])
		.provider('DSBinaryHeap', require('./DSBinaryHeap').DSBinaryHeapProvider);

	/**
	 * @doc overview
	 * @id angular-cache
	 * @name Overview
	 * @description
	 * __Version:__ <%= pkg.version %>
	 *
	 * ## Install
	 *
	 * #### Bower
	 * ```text
	 * bower install angular-cache
	 * ```
	 *
	 * Load `dist/angular-cache.js` or `dist/angular-cache.min.js` onto your web page after Angular.js.
	 *
	 * #### Npm
	 * ```text
	 * npm install angular-cache
	 * ```
	 *
	 * Load `dist/angular-cache.js` or `dist/angular-cache.min.js` onto your web page after Angular.js. Angular-cache is
	 * also consumable by Browserify and you should be able to `require('angular-cache')`. The `main` file is `src/index.js`.
	 *
	 * #### Manual download
	 * Download angular-cache.<%= pkg.version %>.js from the [Releases](https://github.com/jmdobry/angular-cache/releases)
	 * section of the angular-cache GitHub project.
	 *
	 * ## Load into Angular
	 * Your Angular app must depend on the module `"angular-data.DSCacheFactory"` in order to use angular-cache. Loading
	 * angular-cache into your app allows you to inject the following:
	 *
	 * - `DSCacheFactory`
	 * - `DSBinaryHeap`
	 *
	 * [DSCacheFactory](/documentation/api/api/DSCacheFactory) is a factory function that produces instances of
	 * [DSCache](/documentation/api/api/DSCache), which is API compatible with caches produced by Angular's
	 * [$cacheFactory](http://docs.angularjs.org/api/ng/service/$cacheFactory).
	 *
	 * [DSBinaryHeap](/documentation/api/api/DSBinaryHeap) is a priority queue implemented as a Binary Heap.
	 *
	 * Angular-cache is a dependency of [angular-data](/documentation/api/api/angular-data) and must be loaded before
	 * angular-data if you are using angular-data.
	 */
	angular.module('angular-data.DSCacheFactory', ['ng', 'angular-data.DSBinaryHeap'])
		.provider('DSCacheFactory', require('./DSCacheFactory'));

})(window, window.angular);
