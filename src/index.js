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
		.provider('DSBinaryHeap', require('./DSBinaryHeap'));

	/**
	 * @doc overview
	 * @id angular-cache
	 * @name angular-cache
	 * @description
	 * Angular-cache is installable via:
	 *
	 * ```text
	 * bower install angular-cache
	 * ```
	 *
	 * or by downloading angular-cache.x.x.x.js from the [Releases](https://github.com/jmdobry/angular-cache/releases)
	 * section of the angular-cache GitHub project.
	 *
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
	 * Angular-cache is a dependency of [angular-data](/documentation/api/api/angular-data) and must be loaded first.
	 */
	angular.module('angular-data.DSCacheFactory', ['ng', 'angular-data.DSBinaryHeap'])
		.provider('DSCacheFactory', require('./DSCacheFactory'));

})(window, window.angular);
