/**
 * angular-cache
 * @version 4.6.0 - Homepage <https://github.com/jmdobry/angular-cache>
 * @copyright (c) 2013-2016 angular-cache project authors
 * @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 * @overview angular-cache is a very useful replacement for Angular's $cacheFactory.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('angular')) :
	typeof define === 'function' && define.amd ? define('angular-cache', ['angular'], factory) :
	(global.angularCacheModuleName = factory(global.angular));
}(this, (function (angular) { 'use strict';

angular = 'default' in angular ? angular['default'] : angular;

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/**
 * CacheFactory
 * @version 3.0.0 - Homepage <https://github.com/jmdobry/CacheFactory>
 * @copyright (c) 2015-2017 CacheFactory project authors
 * @license MIT <https://github.com/jmdobry/CacheFactory/blob/master/LICENSE>
 * @overview CacheFactory is a very simple and useful cache for the browser.
 */
var _typeof = typeof Symbol === "function" && _typeof$1(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof$1(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof$1(obj);
};

var classCallCheck$$1 = function classCallCheck$$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/**
 * @private
 * @param {array} heap The heap.
 * @param {function} weightFunc The weight function.
 * @param {number} n The index of the element to bubble up.
 */var bubbleUp = function bubbleUp(heap, weightFunc, n) {
  var element = heap[n];var weight = weightFunc(element); // When at 0, an element can not go up any further.
  while (n > 0) {
    // Compute the parent element's index, and fetch it.
    var parentN = Math.floor((n + 1) / 2) - 1;var parent = heap[parentN]; // If the parent has a lesser weight, things are in order and we
    // are done.
    if (weight >= weightFunc(parent)) {
      break;
    } else {
      heap[parentN] = element;heap[n] = parent;n = parentN;
    }
  }
}; /**
   * @private
   * @param {array} heap The heap.
   * @param {function} weightFunc The weight function.
   * @param {number} n The index of the element to sink down.
   */var bubbleDown = function bubbleDown(heap, weightFunc, n) {
  var length = heap.length;var node = heap[n];var nodeWeight = weightFunc(node);while (true) {
    var child2N = (n + 1) * 2;var child1N = child2N - 1;var swap = null;if (child1N < length) {
      var child1 = heap[child1N];var child1Weight = weightFunc(child1); // If the score is less than our node's, we need to swap.
      if (child1Weight < nodeWeight) {
        swap = child1N;
      }
    } // Do the same checks for the other child.
    if (child2N < length) {
      var child2 = heap[child2N];var child2Weight = weightFunc(child2);if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
        swap = child2N;
      }
    }if (swap === null) {
      break;
    } else {
      heap[n] = heap[swap];heap[swap] = node;n = swap;
    }
  }
}; /**
   * @class BinaryHeap
   * @example
   * import { BinaryHeap } from 'cachefactory';
   *
   * const queue = new BinaryHeap();
   * queue.push(2);
   * queue.push(77);
   * queue.push(8);
   * queue.push(33);
   * queue.push(5);
   * queue.pop(); // 2
   * queue.pop(); // 5
   * queue.pop(); // 8
   * queue.pop(); // 33
   * queue.pop(); // 77
   *
   * const userQueue = new BinaryHeap(
   *   (user) => user.age,
   *   (userOne, userTwo) => userOne.id === userTwo.id
   * );
   * queue.push({ id: 1, age: 34 });
   * queue.push({ id: 2, age: 29 });
   * queue.push({ id: 3, age: 25 });
   * queue.push({ id: 3, age: 28 });
   * queue.push({ id: 3, age: 27 });
   * queue.push({ id: 4, age: 42 });
   * queue.push({ id: 5, age: 19 });
   * queue.pop(); // { id: 5, age: 19 }
   * queue.pop(); // { id: 3, age: 27 }
   * queue.pop(); // { id: 2, age: 29 }
   * queue.pop(); // { id: 1, age: 34 }
   * queue.pop(); // { id: 4, age: 42 }
   *
   * @param {function} [weightFunc] See {@link BinaryHeap#weightFunc}.
   * @param {function} [compareFunc] See {@link BinaryHeap#compareFunc}.
   */var BinaryHeap = function () {
  function BinaryHeap(weightFunc, compareFunc) {
    classCallCheck$$1(this, BinaryHeap);if (!weightFunc) {
      weightFunc = function weightFunc(x) {
        return x;
      };
    }if (!compareFunc) {
      compareFunc = function compareFunc(x, y) {
        return x === y;
      };
    }if (typeof weightFunc !== 'function') {
      throw new Error('BinaryHeap([weightFunc][, compareFunc]): "weightFunc" must be a function!');
    }if (typeof compareFunc !== 'function') {
      throw new Error('BinaryHeap([weightFunc][, compareFunc]): "compareFunc" must be a function!');
    } /**
      * The heap's configured weight function.
      *
      * Default:
      * ```js
      * function (x) {
      *   return x;
      * }
      * ```
      *
      * @name BinaryHeap#weightFunc
      * @type {function}
      */this.weightFunc = weightFunc; /**
                                      * The heap's configured compare function.
                                      *
                                      * Default:
                                      * ```js
                                      * function (x, y) {
                                      *   return x === y;
                                      * }
                                      * ```
                                      *
                                      * @name BinaryHeap#compareFunc
                                      * @type {function}
                                      */this.compareFunc = compareFunc; /**
                                                                        * The heap's data.
                                                                        *
                                                                        * @name BinaryHeap#heap
                                                                        * @type {Array<*>}
                                                                        */this.heap = [];
  } /**
    * Push an item into the queue.
    *
    * @method BinaryHeap#push
    * @param {*} node
    */createClass$$1(BinaryHeap, [{ key: 'push', value: function push(node) {
      this.heap.push(node);bubbleUp(this.heap, this.weightFunc, this.heap.length - 1);
    } /**
      * Look at the item at the front of the queue.
      *
      * @method BinaryHeap#peek
      * @returns {*}
      */ }, { key: 'peek', value: function peek() {
      return this.heap[0];
    } /**
      * Pop an item off the front of the queue.
      *
      * @method BinaryHeap#pop
      * @returns {*}
      */ }, { key: 'pop', value: function pop() {
      var front = this.heap[0];var end = this.heap.pop();if (this.heap.length > 0) {
        this.heap[0] = end;bubbleDown(this.heap, this.weightFunc, 0);
      }return front;
    } /**
      * Remove the given item from the queue.
      *
      * @method BinaryHeap#remove
      * @param {*} node
      */ }, { key: 'remove', value: function remove(node) {
      var length = this.heap.length;for (var i = 0; i < length; i++) {
        if (this.compareFunc(this.heap[i], node)) {
          var removed = this.heap[i];var end = this.heap.pop();if (i !== length - 1) {
            this.heap[i] = end;bubbleUp(this.heap, this.weightFunc, i);bubbleDown(this.heap, this.weightFunc, i);
          }return removed;
        }
      }return null;
    } /**
      * Clear the heap.
      *
      * @method BinaryHeap#removeAll
      */ }, { key: 'removeAll', value: function removeAll() {
      this.heap = [];
    } /**
      * Return the length of the queue.
      *
      * @method BinaryHeap#size
      * @returns {number}
      */ }, { key: 'size', value: function size() {
      return this.heap.length;
    } }]);return BinaryHeap;
}();

var defaults$1 = { capacity: Number.MAX_VALUE, cacheFlushInterval: null, deleteOnExpire: 'none', enabled: true, onExpire: null, maxAge: Number.MAX_VALUE, recycleFreq: 1000, storageMode: 'memory', storageImpl: null, storagePrefix: 'cachefactory.caches.', storeOnReject: false, storeOnResolve: false };

var _Promise = null;try {
  _Promise = window.Promise;
} catch (e) {} /**
               * Utility methods used by CacheFactory.
               *
               * @example
               * import { utils } from 'cachefactory'
               * console.log(utils.isString('foo')) // true
               *
               * @namespace utils
               * @type {object}
               */var utils = { /**
                               * Returns whether the two values are strictly equal.
                               *
                               * @example
                               * import { utils } from 'cachefactory'
                               *
                               * console.log(utils.equals(4, 4) // true
                               * console.log(utils.equals(4, '4') // false
                               *
                               * @method utils.equals
                               * @param {*} a The first value.
                               * @param {*} a The second value.
                               * @returns {booleal} Whether the two values are strictly equal.
                               */equals: function equals(a, b) {
    return a === b;
  }, /**
     * Proxy for `JSON.parse`.
     *
     * @example
     * import { utils } from 'cachefactory'
     *
     * const a = utils.fromJson('{"name":"John"}')
     * console.log(a) // { name: 'John' }
     *
     * @method utils.fromJson
     * @param {string} json JSON to parse.
     * @returns {object} The parsed object.
     * @see utils.toJson
     */fromJson: function fromJson(value) {
    return JSON.parse(value);
  }, /**
     * Returns whether the provided value is a function.
     *
     * @example
     * import { utils } from 'cachefactory'
     * const a = function (){ console.log('foo bar')}
     * const b = { foo: "bar" }
     * console.log(utils.isFunction(a)) // true
     * console.log(utils.isFunction(b)) // false
     *
     * @method utils.isFunction
     * @param {*} value The value to test.
     * @returns {boolean} Whether the provided value is a function.
     */isFunction: function isFunction(value) {
    return typeof value === 'function';
  }, /**
     * Returns whether the provided value is a number.
     *
     * @example
     * import { utils } from 'js-data'
     * const a = 1
     * const b = -1.25
     * const c = '1'
     * console.log(utils.isNumber(a)) // true
     * console.log(utils.isNumber(b)) // true
     * console.log(utils.isNumber(c)) // false
     *
     * @method utils.isNumber
     * @param {*} value The value to test.
     * @returns {boolean} Whether the provided value is a number.
     */isNumber: function isNumber(value) {
    return typeof value === 'number';
  }, /**
     * Returns whether the provided value is an object.
     *
     * @example
     * import { utils } from 'cachefactory'
     * const a = { foo: "bar" }
     * const b = 'foo bar'
     * console.log(utils.isObject(a)) // true
     * console.log(utils.isObject(b)) // false
     *
     * @method utils.isObject
     * @param {*} value The value to test.
     * @returns {boolean} Whether the provided value is an object.
     */isObject: function isObject(value) {
    return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
  }, isPromise: function isPromise(value) {
    return value && utils.isFunction(value.then);
  }, /**
     * Returns whether the provided value is a string.
     *
     * @example
     * import { utils } from 'cachefactory'
     * console.log(utils.isString('')) // true
     * console.log(utils.isString('my string')) // true
     * console.log(utils.isString(100)) // false
     * console.log(utils.isString([1,2,4])) // false
     *
     * @method utils.isString
     * @param {*} value The value to test.
     * @returns {boolean} Whether the provided value is a string.
     */isString: function isString(value) {
    return typeof value === 'string';
  }, /**
     * Proxy for `JSON.stringify`.
     *
     * @example
     * import { utils } from 'cachefactory'
     *
     * const a = { name: 'John' }
     * console.log(utils.toJson(a)) // '{"name":"John"}'
     *
     * @method utils.toJson
     * @param {*} value Value to serialize to JSON.
     * @returns {string} JSON string.
     * @see utils.fromJson
     */toJson: function toJson(value) {
    return JSON.stringify(value);
  }, Promise: _Promise };

var assignMsg = 'Cannot assign to read only property'; /**
                                                       * Provide a custom storage medium, e.g. a polyfill for `localStorage`. Default: `null`.
                                                       *
                                                       * Must implement:
                                                       *
                                                       * - `setItem` - Same API as `localStorage.setItem(key, value)`
                                                       * - `getItem` - Same API as `localStorage.getItem(key)`
                                                       * - `removeItem` - Same API as `localStorage.removeItem(key)`
                                                       *
                                                       * @name Cache~StorageImpl
                                                       * @type {object}
                                                       * @property {function} setItem Implementation of `setItem(key, value)`.
                                                       * @property {function} getItem Implementation of `getItem(key)`.
                                                       * @property {function} removeItem Implementation of `removeItem(key)`.
                                                       */ /**
                                                          * Instances of this class represent a "cache"—a synchronous key-value store.
                                                          * Each instance holds the settings for the cache, and provides methods for
                                                          * manipulating the cache and its data.
                                                          *
                                                          * Generally you don't creates instances of `Cache` directly, but instead create
                                                          * instances of `Cache` via {@link CacheFactory#createCache}.
                                                          *
                                                          * @example
                                                          * import CacheFactory from 'cachefactory';
                                                          *
                                                          * const cacheFactory = new CacheFactory();
                                                          * const options = {...};
                                                          * const cache = cacheFactory.createCache('my-cache', options);
                                                          *
                                                          * cache.put('foo', 'bar');
                                                          * console.log(cache.get('foo')); // "bar"
                                                          *
                                                          * @class Cache
                                                          * @param {string} id A unique identifier for the cache.
                                                          * @param {object} [options] Configuration options.
                                                          * @param {number} [options.cacheFlushInterval=null] See {@link Cache#cacheFlushInterval}.
                                                          * @param {number} [options.capacity=Number.MAX_VALUE] See {@link Cache#capacity}.
                                                          * @param {string} [options.deleteOnExpire="none"] See {@link Cache#deleteOnExpire}.
                                                          * @param {boolean} [options.enabled=true] See {@link Cache#enabled}.
                                                          * @param {number} [options.maxAge=Number.MAX_VALUE] See {@link Cache#maxAge}.
                                                          * @param {function} [options.onExpire=null] See {@link Cache#onExpire}.
                                                          * @param {number} [options.recycleFreq=1000] See {@link Cache#recycleFreq}.
                                                          * @param {Cache~StorageImpl} [options.storageImpl=null] See {@link Cache~StorageImpl}.
                                                          * @param {string} [options.storageMode="memory"] See {@link Cache#storageMode}.
                                                          * @param {string} [options.storagePrefix="cachefactory.caches."] See {@link Cache#storagePrefix}.
                                                          * @param {boolean} [options.storeOnReject=false] See {@link Cache#storeOnReject}.
                                                          * @param {boolean} [options.storeOnResolve=false] See {@link Cache#storeOnResolve}.
                                                          */var Cache = function () {
  function Cache(id) {
    var _this = this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};classCallCheck$$1(this, Cache);if (!utils.isString(id)) {
      throw new TypeError('"id" must be a string!');
    }Object.defineProperties(this, { // Writable
      $$cacheFlushInterval: { writable: true, value: undefined }, $$cacheFlushIntervalId: { writable: true, value: undefined }, $$capacity: { writable: true, value: undefined }, $$data: { writable: true, value: {} }, $$deleteOnExpire: { writable: true, value: undefined }, $$enabled: { writable: true, value: undefined }, $$expiresHeap: { writable: true, value: new BinaryHeap(function (x) {
          return x.accessed;
        }, utils.equals) }, $$initializing: { writable: true, value: true }, $$lruHeap: { writable: true, value: new BinaryHeap(function (x) {
          return x.accessed;
        }, utils.equals) }, $$maxAge: { writable: true, value: undefined }, $$onExpire: { writable: true, value: undefined }, $$prefix: { writable: true, value: '' }, $$promises: { writable: true, value: {} }, $$recycleFreq: { writable: true, value: undefined }, $$recycleFreqId: { writable: true, value: undefined }, $$storage: { writable: true, value: undefined }, $$storageMode: { writable: true, value: undefined }, $$storagePrefix: { writable: true, value: undefined }, $$storeOnReject: { writable: true, value: undefined }, $$storeOnResolve: { writable: true, value: undefined }, // Read-only
      $$parent: { value: options.parent }, /**
                                           * The interval (in milliseconds) on which the cache should remove all of
                                           * its items. Setting this to `null` disables the interval. The default is
                                           * `null`.
                                           *
                                           * @example <caption>Create a cache the clears itself every 15 minutes</caption>
                                           * import CacheFactory from 'cachefactory';
                                           *
                                           * const cacheFactory = new CacheFactory();
                                           * const cache = cacheFactory.createCache('my-cache', {
                                           *   cacheFlushInterval: 15 * 60 * 1000
                                           * });
                                           *
                                           * @name Cache#cacheFlushInterval
                                           * @default null
                                           * @public
                                           * @readonly
                                           * @type {number|null}
                                           */cacheFlushInterval: { enumerable: true, get: function get$$1() {
          return _this.$$cacheFlushInterval;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'cacheFlushInterval\'');
        } }, /**
             * The maximum number of items that can be stored in the cache. When the
             * capacity is exceeded the least recently accessed item will be removed.
             * The default is `Number.MAX_VALUE`.
             *
             * @example <caption>Create a cache with a capacity of 100</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   capacity: 100
             * });
             *
             * @name Cache#capacity
             * @default Number.MAX_VALUE
             * @public
             * @readonly
             * @type {number}
             */capacity: { enumerable: true, get: function get$$1() {
          return _this.$$capacity;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'capacity\'');
        } }, /**
             * Determines the behavior of a cache when an item expires. The default is
             * `"none"`.
             *
             * Possible values:
             *
             * - `"none"` - Cache will do nothing when an item expires.
             * - `"passive"` - Cache will do nothing when an item expires. Expired
             * items will remain in the cache until requested, at which point they are
             * removed, and `undefined` is returned.
             * - `"aggressive"` - Cache will remove expired items as soon as they are
             * discovered.
             *
             * @example <caption>Create a cache that deletes items as soon as they expire</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   deleteOnExpire: 'aggressive'
             * });
             *
             * @example <caption>Create a cache that doesn't delete expired items until they're accessed</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   deleteOnExpire: 'passive'
             * });
             *
             * @name Cache#deleteOnExpire
             * @default "none"
             * @public
             * @readonly
             * @type {string}
             */deleteOnExpire: { enumerable: true, get: function get$$1() {
          return _this.$$deleteOnExpire;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'deleteOnExpire\'');
        } }, /**
             * Marks whether the cache is enabled or not. For a disabled cache,
             * {@link Cache#put} is a no-op. The default is `true`.
             *
             * @example <caption>Create a cache that starts out disabled</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   enabled: false
             * });
             *
             * // The cache is disabled, this is a no-op
             * cache.put('foo', 'bar');
             * console.log(cache.get('foo')); // undefined
             *
             * @name Cache#enabled
             * @default true
             * @public
             * @readonly
             * @type {boolean}
             */enabled: { enumerable: true, get: function get$$1() {
          return _this.$$enabled;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'enabled\'');
        } }, /**
             * Then unique identifier given to this cache when it was created.
             *
             * @name Cache#id
             * @public
             * @readonly
             * @type {string}
             */id: { enumerable: true, value: id }, /**
                                                    * Represents how long an item can be in the cache before expires. The
                                                    * cache's behavior toward expired items is determined by
                                                    * {@link Cache#deleteOnExpire}. The default value for `maxAge` is
                                                    * `Number.MAX_VALUE`.
                                                    *
                                                    * @example <caption>Create a cache where items expire after 15 minutes</caption>
                                                    * import CacheFactory from 'cachefactory';
                                                    *
                                                    * const cacheFactory = new CacheFactory();
                                                    * const cache = cacheFactory.createCache('my-cache', {
                                                    *   // Items expire after 15 minutes
                                                    *   maxAge: 15 * 60 * 1000
                                                    * });
                                                    * const cache2 = cacheFactory.createCache('my-cache2', {
                                                    *   // Items expire after 15 minutes
                                                    *   maxAge: 15 * 60 * 1000,
                                                    *   // Expired items will only be deleted once they are accessed
                                                    *   deleteOnExpire: 'passive'
                                                    * });
                                                    * const cache3 = cacheFactory.createCache('my-cache3', {
                                                    *   // Items expire after 15 minutes
                                                    *   maxAge: 15 * 60 * 1000,
                                                    *   // Items will be deleted from the cache as soon as they expire
                                                    *   deleteOnExpire: 'aggressive'
                                                    * });
                                                    *
                                                    * @name Cache#maxAge
                                                    * @default Number.MAX_VALUE
                                                    * @public
                                                    * @readonly
                                                    * @type {number}
                                                    */maxAge: { enumerable: true, get: function get$$1() {
          return _this.$$maxAge;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'maxAge\'');
        } }, /**
             * The `onExpire` callback.
             *
             * @callback Cache~onExpireCallback
             * @param {string} key The key of the expired item.
             * @param {*} value The value of the expired item.
             * @param {function} [done] If in `"passive"` mode and you pass an
             * `onExpire` callback to {@link Cache#get}, then the `onExpire` callback
             * you passed to {@link Cache#get} will be passed to your global
             * `onExpire` callback.
             */ /**
                * A callback to be executed when expired items are removed from the
                * cache when the cache is in `"passive"` or `"aggressive"` mode. The
                * default is `null`. See {@link Cache~onExpireCallback} for the signature
                * of the `onExpire` callback.
                *
                * @example <caption>Create a cache where items expire after 15 minutes</caption>
                * import CacheFactory from 'cachefactory';
                *
                * const cacheFactory = new CacheFactory();
                * const cache = cacheFactory.createCache('my-cache', {
                *   // Items expire after 15 minutes
                *   maxAge: 15 * 60 * 1000,
                *   // Expired items will only be deleted once they are accessed
                *   deleteOnExpire: 'passive',
                *   // Try to rehydrate cached items as they expire
                *   onExpire: function (key, value, done) {
                *     // Do something with key and value
                *
                *     // Will received "done" callback if in "passive" mode and passing
                *     // an onExpire option to Cache#get.
                *     if (done) {
                *       done(); // You can pass whatever you want to done
                *     }
                *   }
                * });
                *
                * @name Cache#onExpire
                * @default null
                * @public
                * @readonly
                * @see Cache~onExpireCallback
                * @type {function}
                */onExpire: { enumerable: true, get: function get$$1() {
          return _this.$$onExpire;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'onExpire\'');
        } }, /**
             * The frequency (in milliseconds) with which the cache should check for
             * expired items. The default is `1000`. The value of this interval only
             * matters if {@link Cache#deleteOnExpire} is set to `"aggressive"`.
             *
             * @example <caption>Create a cache where items expire after 15 minutes checking every 10 seconds</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   // Items expire after 15 minutes
             *   maxAge: 15 * 60 * 1000,
             *   // Items will be deleted from the cache as soon as they expire
             *   deleteOnExpire: 'aggressive',
             *   // Check for expired items every 10 seconds
             *   recycleFreq: 10 * 1000
             * });
             *
             * @name Cache#recycleFreq
             * @default 1000
             * @public
             * @readonly
             * @type {number|null}
             */recycleFreq: { enumerable: true, get: function get$$1() {
          return _this.$$recycleFreq;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'recycleFreq\'');
        } }, /**
             * Determines the storage medium used by the cache. The default is
             * `"memory"`.
             *
             * Possible values:
             *
             * - `"memory"`
             * - `"localStorage"`
             * - `"sessionStorage"`
             *
             * @example <caption>Create a cache that stores its data in localStorage</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   storageMode: 'localStorage'
             * });
             *
             * @example <caption>Provide a custom storage implementation</caption>
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   storageMode: 'localStorage',
             *   storageImpl: {
             *     setItem: function (key, value) {
             *       console.log('setItem', key, value);
             *       localStorage.setItem(key, value);
             *     },
             *     getItem: function (key) {
             *       console.log('getItem', key);
             *       localStorage.getItem(key);
             *     },
             *     removeItem: function (key) {
             *       console.log('removeItem', key);
             *       localStorage.removeItem(key);
             *     }
             *   }
             * });
             *
             * @name Cache#storageMode
             * @default "memory"
             * @public
             * @readonly
             * @type {string}
             */storageMode: { enumerable: true, get: function get$$1() {
          return _this.$$storageMode;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'storageMode\'');
        } }, /**
             * The prefix used to namespace the keys for items stored in
             * `localStorage` or `sessionStorage`. The default is
             * `"cachefactory.caches."` which is conservatively long in order any
             * possible conflict with other data in storage. Set to a shorter value
             * to save storage space.
             *
             * @example
             * import CacheFactory from 'cachefactory';
             *
             * const cacheFactory = new CacheFactory();
             * const cache = cacheFactory.createCache('my-cache', {
             *   storageMode: 'localStorage',
             *   // Completely remove the prefix to save the most space
             *   storagePrefix: ''
             * });
             * cache.put('foo', 'bar');
             * console.log(localStorage.get('my-cache.data.foo')); // "bar"
             *
             * @name Cache#storagePrefix
             * @default "cachefactory.caches."
             * @public
             * @readonly
             * @type {string}
             */storagePrefix: { enumerable: true, get: function get$$1() {
          return _this.$$storagePrefix;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'storagePrefix\'');
        } }, /**
             * If set to `true`, when a promise is inserted into the cache and is then
             * rejected, then the rejection value will overwrite the promise in the
             * cache. The default is `false`.
             *
             * @name Cache#storeOnReject
             * @default false
             * @public
             * @readonly
             * @type {boolean}
             */storeOnReject: { enumerable: true, get: function get$$1() {
          return _this.$$storeOnReject;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'storeOnReject\'');
        } }, /**
             * If set to `true`, when a promise is inserted into the cache and is then
             * resolved, then the resolution value will overwrite the promise in the
             * cache. The default is `false`.
             *
             * @name Cache#storeOnResolve
             * @default false
             * @public
             * @readonly
             * @type {boolean}
             */storeOnResolve: { enumerable: true, get: function get$$1() {
          return _this.$$storeOnResolve;
        }, set: function set$$1() {
          throw new Error(assignMsg + ' \'storeOnResolve\'');
        } } });this.setOptions(options, true);this.$$initializing = false;
  } /**
    * Destroys this cache and all its data and renders it unusable.
    *
    * @example
    * cache.destroy();
    *
    * @method Cache#destroy
    */createClass$$1(Cache, [{ key: 'destroy', value: function destroy() {
      clearInterval(this.$$cacheFlushIntervalId);clearInterval(this.$$recycleFreqId);this.removeAll();if (this.$$storage) {
        this.$$storage().removeItem(this.$$prefix + '.keys');this.$$storage().removeItem(this.$$prefix);
      }this.$$storage = null;this.$$data = null;this.$$lruHeap = null;this.$$expiresHeap = null;this.$$prefix = null;if (this.$$parent) {
        this.$$parent.caches[this.id] = undefined;
      }
    } /**
      * Disables this cache. For a disabled cache, {@link Cache#put} is a no-op.
      *
      * @example
      * cache.disable();
      *
      * @method Cache#disable
      */ }, { key: 'disable', value: function disable() {
      this.$$enabled = false;
    } /**
      * Enables this cache. For a disabled cache, {@link Cache#put} is a no-op.
      *
      * @example
      * cache.enable();
      *
      * @method Cache#enable
      */ }, { key: 'enable', value: function enable() {
      this.$$enabled = true;
    } /**
      * Retrieve an item from the cache, it it exists.
      *
      * @example <caption>Retrieve an item from the cache</caption>
      * cache.put('foo', 'bar');
      * cache.get('foo'); // "bar"
      *
      * @example <caption>Retrieve a possibly expired item while in passive mode</caption>
      * import CacheFactory from 'cachefactory';
      *
      * const cacheFactory = new CacheFactory();
      * const cache = cacheFactory.createCache('my-cache', {
      *   deleteOnExpire: 'passive',
      *   maxAge: 15 * 60 * 1000
      * });
      * cache.get('foo', {
      *   // Called if "foo" is expired
      *   onExpire: function (key, value) {
      *     // Do something with key and value
      *   }
      * });
      *
      * @example <caption>Retrieve a possibly expired item while in passive mode with global onExpire callback</caption>
      * import CacheFactory from 'cachefactory';
      *
      * const cacheFactory = new CacheFactory();
      * const cache = cacheFactory.createCache('my-cache', {
      *   deleteOnExpire: 'passive',
      *   maxAge: 15 * 60 * 1000
      *   onExpire: function (key, value, done) {
      *     console.log('Expired item:', key);
      *     if (done) {
      *       done('foo', key, value);
      *     }
      *   }
      * });
      * cache.get('foo', {
      *   // Called if "foo" is expired
      *   onExpire: function (msg, key, value) {
      *     console.log(msg); // "foo"
      *     // Do something with key and value
      *   }
      * });
      *
      * @method Cache#get
      * @param {string|string[]} key The key of the item to retrieve.
      * @param {object} [options] Configuration options.
      * @param {function} [options.onExpire] TODO
      * @returns {*} The value for the specified `key`, if any.
      */ }, { key: 'get', value: function get$$1(key) {
      var _this2 = this;var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};if (Array.isArray(key)) {
        var keys = key;var values = [];keys.forEach(function (key) {
          var value = _this2.get(key, options);if (value !== null && value !== undefined) {
            values.push(value);
          }
        });return values;
      } else {
        if (utils.isNumber(key)) {
          key = '' + key;
        }if (!this.enabled) {
          return;
        }
      }if (!utils.isString(key)) {
        throw new TypeError('"key" must be a string!');
      } else if (!options || !utils.isObject(options)) {
        throw new TypeError('"options" must be an object!');
      } else if (options.onExpire && !utils.isFunction(options.onExpire)) {
        throw new TypeError('"options.onExpire" must be a function!');
      }var item = void 0;if (this.$$storage) {
        if (this.$$promises[key]) {
          return this.$$promises[key];
        }var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);if (itemJson) {
          item = utils.fromJson(itemJson);
        }
      } else if (utils.isObject(this.$$data)) {
        item = this.$$data[key];
      }if (!item) {
        return;
      }var value = item.value;var now = new Date().getTime();if (this.$$storage) {
        this.$$lruHeap.remove({ key: key, accessed: item.accessed });item.accessed = now;this.$$lruHeap.push({ key: key, accessed: now });
      } else {
        this.$$lruHeap.remove(item);item.accessed = now;this.$$lruHeap.push(item);
      }if (this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
        this.remove(key);if (this.$$onExpire) {
          this.$$onExpire(key, item.value, options.onExpire);
        } else if (options.onExpire) {
          options.onExpire.call(this, key, item.value);
        }value = undefined;
      } else if (this.$$storage) {
        this.$$storage().setItem(this.$$prefix + '.data.' + key, utils.toJson(item));
      }return value;
    } /**
      * Retrieve information about the whole cache or about a particular item in
      * the cache.
      *
      * @example <caption>Retrieve info about the cache</caption>
      * const info = cache.info();
      * info.id; // "my-cache"
      * info.capacity; // 100
      * info.maxAge; // 600000
      * info.deleteOnExpire; // "aggressive"
      * info.cacheFlushInterval; // null
      * info.recycleFreq; // 10000
      * info.storageMode; // "localStorage"
      * info.enabled; // false
      * info.size; // 1234
      *
      * @example <caption>Retrieve info about an item in the cache</caption>
      * const info = cache.info('foo');
      * info.created; // 1234567890
      * info.accessed; // 1234567990
      * info.expires; // 1234569999
      * info.isExpired; // false
      *
      * @method Cache#info
      * @param {string} [key] If specified, retrieve info for a particular item in
      * the cache.
      * @returns {*} The information object.
      */ }, { key: 'info', value: function info(key) {
      if (key) {
        var item = void 0;if (this.$$storage) {
          var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);if (itemJson) {
            item = utils.fromJson(itemJson);
          }
        } else if (utils.isObject(this.$$data)) {
          item = this.$$data[key];
        }if (item) {
          return { created: item.created, accessed: item.accessed, expires: item.expires, isExpired: new Date().getTime() - item.created > (item.maxAge || this.$$maxAge) };
        }
      } else {
        return { id: this.id, capacity: this.capacity, maxAge: this.maxAge, deleteOnExpire: this.deleteOnExpire, onExpire: this.onExpire, cacheFlushInterval: this.cacheFlushInterval, recycleFreq: this.recycleFreq, storageMode: this.storageMode, storageImpl: this.$$storage ? this.$$storage() : undefined, enabled: this.enabled, size: this.$$lruHeap && this.$$lruHeap.size() || 0 };
      }
    } /**
      * Retrieve a list of the keys of items currently in the cache.
      *
      * @example
      * const keys = cache.keys();
      *
      * @method Cache#keys
      * @returns {string[]} The keys of the items in the cache
      */ }, { key: 'keys', value: function keys() {
      var _this3 = this;if (this.$$storage) {
        var keysJson = this.$$storage().getItem(this.$$prefix + '.keys');if (keysJson) {
          return utils.fromJson(keysJson);
        } else {
          return [];
        }
      } else {
        return Object.keys(this.$$data).filter(function (key) {
          return _this3.$$data[key];
        });
      }
    } /**
      * Retrieve an object of the keys of items currently in the cache.
      *
      * @example
      * const keySet = cache.keySet();
      *
      * @method Cache#keySet
      * @returns {object} The keys of the items in the cache.
      */ }, { key: 'keySet', value: function keySet() {
      var set$$1 = {};this.keys().forEach(function (key) {
        set$$1[key] = key;
      });return set$$1;
    } /**
      * Insert an item into the cache.
      *
      * @example
      * const inserted = cache.put('foo', 'bar');
      *
      * @method Cache#put
      * @param {string} key The key under which to insert the item.
      * @param {*} value The value to insert.
      * @param {object} [options] Configuration options.
      * @param {boolean} [options.storeOnReject] See {@link Cache#storeOnReject}.
      * @param {boolean} [options.storeOnResolve] See {@link Cache#storeOnResolve}.
      * @returns {*} The inserted value.
      */ }, { key: 'put', value: function put(key, value) {
      var _this4 = this;var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var storeOnResolve = options.storeOnResolve !== undefined ? !!options.storeOnResolve : this.$$storeOnResolve;var storeOnReject = options.storeOnReject !== undefined ? !!options.storeOnReject : this.$$storeOnReject;var getHandler = function getHandler(shouldStore, isError) {
        return function (v) {
          if (shouldStore) {
            _this4.$$promises[key] = undefined;if (utils.isObject(v) && 'status' in v && 'data' in v) {
              _this4.put(key, [v.status, v.data, v.headers(), v.statusText]);
            } else {
              _this4.put(key, v);
            }
          }if (isError) {
            if (utils.Promise) {
              return utils.Promise.reject(v);
            } else {
              throw v;
            }
          } else {
            return v;
          }
        };
      };if (!this.$$enabled || !utils.isObject(this.$$data) || value === null || value === undefined) {
        return;
      }if (utils.isNumber(key)) {
        key = '' + key;
      }if (!utils.isString(key)) {
        throw new TypeError('"key" must be a string!');
      }var now = new Date().getTime();var item = { key: key, value: utils.isPromise(value) ? value.then(getHandler(storeOnResolve, false), getHandler(storeOnReject, true)) : value, created: options.created === undefined ? now : options.created, accessed: options.accessed === undefined ? now : options.accessed };if (utils.isNumber(options.maxAge)) {
        item.maxAge = options.maxAge;
      }if (options.expires === undefined) {
        item.expires = item.created + (item.maxAge || this.$$maxAge);
      } else {
        item.expires = options.expires;
      }if (this.$$storage) {
        if (utils.isPromise(item.value)) {
          this.$$promises[key] = item.value;return this.$$promises[key];
        }var keysJson = this.$$storage().getItem(this.$$prefix + '.keys');var keys = keysJson ? utils.fromJson(keysJson) : [];var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key); // Remove existing
        if (itemJson) {
          this.remove(key);
        } // Add to expires heap
        this.$$expiresHeap.push({ key: key, expires: item.expires }); // Add to lru heap
        this.$$lruHeap.push({ key: key, accessed: item.accessed }); // Set item
        this.$$storage().setItem(this.$$prefix + '.data.' + key, utils.toJson(item));var exists = false;keys.forEach(function (_key) {
          if (_key === key) {
            exists = true;return false;
          }
        });if (!exists) {
          keys.push(key);
        }this.$$storage().setItem(this.$$prefix + '.keys', utils.toJson(keys));
      } else {
        // Remove existing
        if (this.$$data[key]) {
          this.remove(key);
        } // Add to expires heap
        this.$$expiresHeap.push(item); // Add to lru heap
        this.$$lruHeap.push(item); // Set item
        this.$$data[key] = item;this.$$promises[key] = undefined;
      } // Handle exceeded capacity
      if (this.$$lruHeap.size() > this.$$capacity) {
        this.remove(this.$$lruHeap.peek().key);
      }return value;
    } /**
      * Remove an item from the cache.
      *
      * @example
      * const removed = cache.remove('foo');
      *
      * @method Cache#remove
      * @param {string} key The key of the item to remove.
      * @returns {*} The value of the removed item, if any.
      */ }, { key: 'remove', value: function remove(key) {
      if (utils.isNumber(key)) {
        key = '' + key;
      }this.$$promises[key] = undefined;if (this.$$storage) {
        var itemJson = this.$$storage().getItem(this.$$prefix + '.data.' + key);if (itemJson) {
          var item = utils.fromJson(itemJson);this.$$lruHeap.remove({ key: key, accessed: item.accessed });this.$$expiresHeap.remove({ key: key, expires: item.expires });this.$$storage().removeItem(this.$$prefix + '.data.' + key);var keysJson = this.$$storage().getItem(this.$$prefix + '.keys');var keys = keysJson ? utils.fromJson(keysJson) : [];var index = keys.indexOf(key);if (index >= 0) {
            keys.splice(index, 1);
          }this.$$storage().setItem(this.$$prefix + '.keys', utils.toJson(keys));return item.value;
        }
      } else if (utils.isObject(this.$$data)) {
        var value = this.$$data[key] ? this.$$data[key].value : undefined;this.$$lruHeap.remove(this.$$data[key]);this.$$expiresHeap.remove(this.$$data[key]);this.$$data[key] = undefined;return value;
      }
    } /**
      * Remove all items from the cache.
      *
      * @example
      * cache.removeAll();
      *
      * @method Cache#removeAll
      */ }, { key: 'removeAll', value: function removeAll() {
      var _this5 = this;var storage = this.$$storage;var keys = this.keys();this.$$lruHeap.removeAll();this.$$expiresHeap.removeAll();if (storage) {
        storage().setItem(this.$$prefix + '.keys', utils.toJson([]));keys.forEach(function (key) {
          storage().removeItem(_this5.$$prefix + '.data.' + key);
        });
      } else if (utils.isObject(this.$$data)) {
        this.$$data = {};
      }this.$$promises = {};
    } /**
      * Remove expired items from the cache, if any.
      *
      * @example
      * const expiredItems = cache.removeExpired();
      *
      * @method Cache#removeExpired
      * @returns {object} The expired items, if any.
      */ }, { key: 'removeExpired', value: function removeExpired() {
      var _this6 = this;var now = new Date().getTime();var expired = {};var expiredItem = void 0;while ((expiredItem = this.$$expiresHeap.peek()) && expiredItem.expires <= now) {
        expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;this.$$expiresHeap.pop();
      }Object.keys(expired).forEach(function (key) {
        _this6.remove(key);
      });if (this.$$onExpire) {
        Object.keys(expired).forEach(function (key) {
          _this6.$$onExpire(key, expired[key]);
        });
      }return expired;
    } /**
      * Update the {@link Cache#cacheFlushInterval} for the cache. Pass in `null`
      * to disable the interval.
      *
      * @example
      * cache.setCacheFlushInterval(60 * 60 * 1000);
      *
      * @method Cache#setCacheFlushInterval
      * @param {number|null} cacheFlushInterval The new {@link Cache#cacheFlushInterval}.
      */ }, { key: 'setCacheFlushInterval', value: function setCacheFlushInterval(cacheFlushInterval) {
      var _this7 = this;if (cacheFlushInterval === null) {
        this.$$cacheFlushInterval = null;
      } else if (!utils.isNumber(cacheFlushInterval)) {
        throw new TypeError('"cacheFlushInterval" must be a number!');
      } else if (cacheFlushInterval <= 0) {
        throw new Error('"cacheFlushInterval" must be greater than zero!');
      }this.$$cacheFlushInterval = cacheFlushInterval;clearInterval(this.$$cacheFlushIntervalId);this.$$cacheFlushIntervalId = undefined;if (this.$$cacheFlushInterval) {
        this.$$cacheFlushIntervalId = setInterval(function () {
          return _this7.removeAll();
        }, this.$$cacheFlushInterval);
      }
    } /**
      * Update the {@link Cache#capacity} for the cache. Pass in `null` to reset
      * to `Number.MAX_VALUE`.
      *
      * @example
      * cache.setCapacity(1000);
      *
      * @method Cache#setCapacity
      * @param {number|null} capacity The new {@link Cache#capacity}.
      */ }, { key: 'setCapacity', value: function setCapacity(capacity) {
      if (capacity === null) {
        this.$$capacity = Number.MAX_VALUE;
      } else if (!utils.isNumber(capacity)) {
        throw new TypeError('"capacity" must be a number!');
      } else if (capacity <= 0) {
        throw new Error('"capacity" must be greater than zero!');
      } else {
        this.$$capacity = capacity;
      }var removed = {};while (this.$$lruHeap.size() > this.$$capacity) {
        removed[this.$$lruHeap.peek().key] = this.remove(this.$$lruHeap.peek().key);
      }return removed;
    } /**
      * Update the {@link Cache#deleteOnExpire} for the cache. Pass in `null` to
      * reset to `"none"`.
      *
      * @example
      * cache.setDeleteOnExpire('passive');
      *
      * @method Cache#setDeleteOnExpire
      * @param {string|null} deleteOnExpire The new {@link Cache#deleteOnExpire}.
      */ }, { key: 'setDeleteOnExpire', value: function setDeleteOnExpire(deleteOnExpire, setRecycleFreq) {
      if (deleteOnExpire === null) {
        deleteOnExpire = 'none';
      } else if (!utils.isString(deleteOnExpire)) {
        throw new TypeError('"deleteOnExpire" must be a string!');
      } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
        throw new Error('"deleteOnExpire" must be "none", "passive" or "aggressive"!');
      }this.$$deleteOnExpire = deleteOnExpire;if (setRecycleFreq !== false) {
        this.setRecycleFreq(this.$$recycleFreq);
      }
    } /**
      * Update the {@link Cache#maxAge} for the cache. Pass in `null` to reset to
      * to `Number.MAX_VALUE`.
      *
      * @example
      * cache.setMaxAge(60 * 60 * 1000);
      *
      * @method Cache#setMaxAge
      * @param {number|null} maxAge The new {@link Cache#maxAge}.
      */ }, { key: 'setMaxAge', value: function setMaxAge(maxAge) {
      var _this8 = this;if (maxAge === null) {
        this.$$maxAge = Number.MAX_VALUE;
      } else if (!utils.isNumber(maxAge)) {
        throw new TypeError('"maxAge" must be a number!');
      } else if (maxAge <= 0) {
        throw new Error('"maxAge" must be greater than zero!');
      } else {
        this.$$maxAge = maxAge;
      }var keys = this.keys();this.$$expiresHeap.removeAll();if (this.$$storage) {
        keys.forEach(function (key) {
          var itemJson = _this8.$$storage().getItem(_this8.$$prefix + '.data.' + key);if (itemJson) {
            var item = utils.fromJson(itemJson);if (_this8.$$maxAge === Number.MAX_VALUE) {
              item.expires = Number.MAX_VALUE;
            } else {
              item.expires = item.created + (item.maxAge || _this8.$$maxAge);
            }_this8.$$expiresHeap.push({ key: key, expires: item.expires });
          }
        });
      } else {
        keys.forEach(function (key) {
          var item = _this8.$$data[key];if (item) {
            if (_this8.$$maxAge === Number.MAX_VALUE) {
              item.expires = Number.MAX_VALUE;
            } else {
              item.expires = item.created + (item.maxAge || _this8.$$maxAge);
            }_this8.$$expiresHeap.push(item);
          }
        });
      }if (this.$$deleteOnExpire === 'aggressive') {
        return this.removeExpired();
      } else {
        return {};
      }
    } /**
      * Update the {@link Cache#onExpire} for the cache. Pass in `null` to unset
      * the global `onExpire` callback of the cache.
      *
      * @example
      * cache.setOnExpire(function (key, value, done) {
      *   // Do something
      * });
      *
      * @method Cache#setOnExpire
      * @param {function|null} onExpire The new {@link Cache#onExpire}.
      */ }, { key: 'setOnExpire', value: function setOnExpire(onExpire) {
      if (onExpire === null) {
        this.$$onExpire = null;
      } else if (!utils.isFunction(onExpire)) {
        throw new TypeError('"onExpire" must be a function!');
      } else {
        this.$$onExpire = onExpire;
      }
    } /**
      * Update multiple cache options at a time.
      *
      * @example
      * cache.setOptions({
      *   maxAge: 60 * 60 * 1000,
      *   deleteOnExpire: 'aggressive'
      * });
      *
      * @example <caption>Set two options, and reset the rest to the configured defaults</caption>
      * cache.setOptions({
      *   maxAge: 60 * 60 * 1000,
      *   deleteOnExpire: 'aggressive'
      * }, true);
      *
      * @method Cache#setOptions
      * @param {object} options The options to set.
      * @param {boolean} [strict] Reset options not passed to `options` to the
      * configured defaults.
      */ }, { key: 'setOptions', value: function setOptions() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;if (!utils.isObject(options)) {
        throw new TypeError('"options" must be an object!');
      }if (options.storagePrefix !== undefined) {
        this.$$storagePrefix = options.storagePrefix;
      } else if (strict) {
        this.$$storagePrefix = defaults$1.storagePrefix;
      }this.$$prefix = this.$$storagePrefix + this.id;if (options.enabled !== undefined) {
        this.$$enabled = !!options.enabled;
      } else if (strict) {
        this.$$enabled = defaults$1.enabled;
      }if (options.deleteOnExpire !== undefined) {
        this.setDeleteOnExpire(options.deleteOnExpire, false);
      } else if (strict) {
        this.setDeleteOnExpire(defaults$1.deleteOnExpire, false);
      }if (options.recycleFreq !== undefined) {
        this.setRecycleFreq(options.recycleFreq);
      } else if (strict) {
        this.setRecycleFreq(defaults$1.recycleFreq);
      }if (options.maxAge !== undefined) {
        this.setMaxAge(options.maxAge);
      } else if (strict) {
        this.setMaxAge(defaults$1.maxAge);
      }if (options.storeOnResolve !== undefined) {
        this.$$storeOnResolve = !!options.storeOnResolve;
      } else if (strict) {
        this.$$storeOnResolve = defaults$1.storeOnResolve;
      }if (options.storeOnReject !== undefined) {
        this.$$storeOnReject = !!options.storeOnReject;
      } else if (strict) {
        this.$$storeOnReject = defaults$1.storeOnReject;
      }if (options.capacity !== undefined) {
        this.setCapacity(options.capacity);
      } else if (strict) {
        this.setCapacity(defaults$1.capacity);
      }if (options.cacheFlushInterval !== undefined) {
        this.setCacheFlushInterval(options.cacheFlushInterval);
      } else if (strict) {
        this.setCacheFlushInterval(defaults$1.cacheFlushInterval);
      }if (options.onExpire !== undefined) {
        this.setOnExpire(options.onExpire);
      } else if (strict) {
        this.setOnExpire(defaults$1.onExpire);
      }if (options.storageMode !== undefined || options.storageImpl !== undefined) {
        this.setStorageMode(options.storageMode || defaults$1.storageMode, options.storageImpl || defaults$1.storageImpl);
      } else if (strict) {
        this.setStorageMode(defaults$1.storageMode, defaults$1.storageImpl);
      }
    } /**
      * Update the {@link Cache#recycleFreq} for the cache. Pass in `null` to
      * disable the interval.
      *
      * @example
      * cache.setRecycleFreq(10000);
      *
      * @method Cache#setRecycleFreq
      * @param {number|null} recycleFreq The new {@link Cache#recycleFreq}.
      */ }, { key: 'setRecycleFreq', value: function setRecycleFreq(recycleFreq) {
      var _this9 = this;if (recycleFreq === null) {
        this.$$recycleFreq = null;
      } else if (!utils.isNumber(recycleFreq)) {
        throw new TypeError('"recycleFreq" must be a number!');
      } else if (recycleFreq <= 0) {
        throw new Error('"recycleFreq" must be greater than zero!');
      } else {
        this.$$recycleFreq = recycleFreq;
      }clearInterval(this.$$recycleFreqId);if (this.$$deleteOnExpire === 'aggressive' && this.$$recycleFreq) {
        this.$$recycleFreqId = setInterval(function () {
          return _this9.removeExpired();
        }, this.$$recycleFreq);
      } else {
        this.$$recycleFreqId = undefined;
      }
    } /**
      * Update the {@link Cache#storageMode} for the cache.
      *
      * @method Cache#setStorageMode
      * @param {string} storageMode The new {@link Cache#storageMode}.
      * @param {object} storageImpl The new {@link Cache~StorageImpl}.
      */ }, { key: 'setStorageMode', value: function setStorageMode(storageMode, storageImpl) {
      var _this10 = this;if (!utils.isString(storageMode)) {
        throw new TypeError('"storageMode" must be a string!');
      } else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
        throw new Error('"storageMode" must be "memory", "localStorage", or "sessionStorage"!');
      }var prevStorage = this.$$storage;var prevData = this.$$data;var shouldReInsert = false;var items = {};var load = function load(prevStorage, prevData) {
        var keys = _this10.keys();var prevDataIsObject = utils.isObject(prevData);keys.forEach(function (key) {
          if (prevStorage) {
            var itemJson = prevStorage().getItem(_this10.$$prefix + '.data.' + key);if (itemJson) {
              items[key] = utils.fromJson(itemJson);
            }
          } else if (prevDataIsObject) {
            items[key] = prevData[key];
          }_this10.remove(key);shouldReInsert || (shouldReInsert = true);
        });
      };if (!this.$$initializing) {
        load(prevStorage, prevData);
      }this.$$storageMode = storageMode;if (storageImpl) {
        if (!utils.isObject(storageImpl)) {
          throw new TypeError('"storageImpl" must be an object!');
        } else if (typeof storageImpl.setItem !== 'function') {
          throw new Error('"storageImpl" must implement "setItem(key, value)"!');
        } else if (typeof storageImpl.getItem !== 'function') {
          throw new Error('"storageImpl" must implement "getItem(key)"!');
        } else if (typeof storageImpl.removeItem !== 'function') {
          throw new Error('"storageImpl" must implement "removeItem(key)"!');
        }this.$$storage = function () {
          return storageImpl;
        };
      } else if (this.$$storageMode === 'localStorage') {
        try {
          localStorage.setItem('cachefactory', 'cachefactory');localStorage.removeItem('cachefactory');this.$$storage = function () {
            return localStorage;
          };
        } catch (e) {
          this.$$storage = null;this.$$storageMode = 'memory';
        }
      } else if (this.$$storageMode === 'sessionStorage') {
        try {
          sessionStorage.setItem('cachefactory', 'cachefactory');sessionStorage.removeItem('cachefactory');this.$$storage = function () {
            return sessionStorage;
          };
        } catch (e) {
          this.$$storage = null;this.$$storageMode = 'memory';
        }
      } else {
        this.$$storage = null;this.$$storageMode = 'memory';
      }if (this.$$initializing) {
        load(this.$$storage, this.$$data);
      }if (shouldReInsert) {
        Object.keys(items).forEach(function (key) {
          var item = items[key];_this10.put(key, item.value, { created: item.created, accessed: item.accessed, expires: item.expires });
        });
      }
    } /**
      * Reset an item's age in the cache, or if `key` is unspecified, touch all
      * items in the cache.
      *
      * @example
      * cache.touch('foo');
      *
      * @method Cache#touch
      * @param {string} [key] The key of the item to touch.
      * @param {object} [options] Options to pass to {@link Cache#put} if
      * necessary.
      */ }, { key: 'touch', value: function touch(key, options) {
      var _this11 = this;if (key) {
        var val = this.get(key, { onExpire: function onExpire(k, v) {
            return _this11.put(k, v);
          } });if (val) {
          this.put(key, val, options);
        }
      } else {
        var keys = this.keys();for (var i = 0; i < keys.length; i++) {
          this.touch(keys[i], options);
        }
      }
    } /**
      * Retrieve the values of all items in the cache.
      *
      * @example
      * const values = cache.values();
      *
      * @method Cache#values
      * @returns {array} The values of the items in the cache.
      */ }, { key: 'values', value: function values() {
      var _this12 = this;return this.keys().map(function (key) {
        return _this12.get(key);
      });
    } }]);return Cache;
}();

var CacheFactory = function () {
  function CacheFactory() {
    classCallCheck$$1(this, CacheFactory);Object.defineProperty(this, 'caches', { writable: true, value: {} });
  } /**
    * Calls {@link Cache#removeAll} on each {@link Cache} in this
    * {@link CacheFactory}.
    *
    * @example
    * cacheFactory.clearAll();
    *
    * @method CacheFactory#clearAll
    */createClass$$1(CacheFactory, [{ key: 'clearAll', value: function clearAll() {
      var _this = this;this.keys().forEach(function (cacheId) {
        _this.get(cacheId).removeAll();
      });
    } /**
      * Create a new {@link Cache}. If a cache with the same `id` had been created
      * in a previous browser session, then it will attempt to load any data that
      * had been saved previously.
      *
      * @example
      * import CacheFactory from 'cachefactory';
      *
      * const cacheFactory = new CacheFactory();
      * const options = {...};
      * const cache = cacheFactory.createCache('my-cache', options);
      *
      * cache.put('foo', 'bar');
      * console.log(cache.get('foo')); // "bar"
      *
      * @method CacheFactory#createCache
      * @param {string} id A unique identifier for the new {@link Cache}.
      * @param {object} [options] Configuration options. See {@link Cache}.
      * @returns {Cache} The new {@link Cache} instance.
      */ }, { key: 'createCache', value: function createCache(id) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};if (this.caches[id]) {
        throw new Error('cache "' + id + '" already exists!');
      }options.parent = this;this.caches[id] = new CacheFactory.Cache(id, options);return this.caches[id];
    } /**
      * Calls {@link Cache#destroy} on the {@link Cache} in this
      * {@link CacheFactory} that has the specified `id`.
      *
      * @example
      * cacheFactory.destroy('my-cache');
      *
      * @method CacheFactory#destroy
      * @param {string} id TODO
      */ }, { key: 'destroy', value: function destroy(id) {
      this.get(id).destroy();this.caches[id] = undefined;
    } /**
      * Calls {@link Cache#destroy} on each {@link Cache} in this
      * {@link CacheFactory}.
      *
      * @example
      * cacheFactory.destroyAll();
      *
      * @method CacheFactory#destroyAll
      */ }, { key: 'destroyAll', value: function destroyAll() {
      var _this2 = this;this.keys().forEach(function (id) {
        _this2.get(id).destroy();
      });this.caches = {};
    } /**
      * Calls {@link Cache#disable} on each {@link Cache} in this
      * {@link CacheFactory}.
      *
      * @example
      * cacheFactory.disableAll();
      *
      * @method CacheFactory#disableAll
      */ }, { key: 'disableAll', value: function disableAll() {
      var _this3 = this;this.keys().forEach(function (cacheId) {
        _this3.get(cacheId).disable();
      });
    } /**
      * Calls {@link Cache#enable} on each {@link Cache} in this
      * {@link CacheFactory}.
      *
      * @example
      * cacheFactory.enableAll();
      *
      * @method CacheFactory#enableAll
      */ }, { key: 'enableAll', value: function enableAll() {
      var _this4 = this;this.keys().forEach(function (cacheId) {
        _this4.get(cacheId).enable();
      });
    } /**
      * Returns whether the {@link Cache} with the specified `id` exists in this
      * {@link CacheFactory}.
      *
      * @example
      * const exists = cacheFactory.exists('my-cache');
      *
      * @method CacheFactory#exists
      * @returns {boolean} Whether the {@link Cache} with the specified `id` exists
      * in this {@link CacheFactory}.
      */ }, { key: 'exists', value: function exists(id) {
      return !!this.caches[id];
    } /**
      * Returns a reference to the {@link Cache} in this {@link CacheFactory} that
      * has the specified `id`.
      *
      * @example
      * const cache = cacheFactory.get('my-cache');
      *
      * @method CacheFactory#get
      * @param {string} id The `id` of the {@link Cache} to retrieve.
      * @returns {Cache} The {@link Cache} instance.
      * @throws {ReferenceError} Throws a `ReferenceError` if the {@link Cache}
      * does not exist.
      */ }, { key: 'get', value: function get$$1(id) {
      var cache = this.caches[id];if (!cache) {
        throw new ReferenceError('Cache "' + id + '" does not exist!');
      }return cache;
    } /**
      * Returns information on this {@link CacheFactory} and its {@link Cache}
      * instance.
      *
      * @example
      * const info = cacheFactory.info();
      * info.size; // 3
      * info.caches['my-cache']; // { size: 1234, ... }
      * info.caches['my-cache2']; // { size: 51, ... }
      * info.caches['my-cache3']; // { size: 43, ... }
      *
      * @method CacheFactory#info
      * @returns {object} The detailed information.
      */ }, { key: 'info', value: function info() {
      var _this5 = this;var keys = this.keys();var info = { size: keys.length, caches: {} };keys.forEach(function (cacheId) {
        info.caches[cacheId] = _this5.get(cacheId).info();
      });Object.keys(defaults$1).forEach(function (key, value) {
        info[key] = defaults$1[key];
      });return info;
    } /**
      * Returns an array of identifiers of the {@link Cache} instances in this
      * {@link CacheFactory}.
      *
      * @example
      * const keys = cacheFactory.keys();
      *
      * @method CacheFactory#keys
      * @returns {string[]} The {@link Cache} identifiers.
      */ }, { key: 'keys', value: function keys() {
      var _this6 = this;return Object.keys(this.caches).filter(function (key) {
        return _this6.caches[key];
      });
    } /**
      * Returns an object of key-value pairs representing the identifiers of the
      * {@link Cache} instances in this {@link CacheFactory}.
      *
      * @example
      * const keySet = cacheFactory.keySet();
      *
      * @method CacheFactory#keySet
      * @returns {object} The {@link Cache} identifiers.
      */ }, { key: 'keySet', value: function keySet() {
      var set$$1 = {};this.keys().forEach(function (key) {
        set$$1[key] = key;
      });return set$$1;
    } /**
      * Calls {@link Cache#removeExpired} on each {@link Cache} in this
      * {@link CacheFactory} and returns the removed items, if any.
      *
      * @example
      * const expired = cacheFactory.removeExpiredFromAll();
      *
      * @method CacheFactory#removeExpiredFromAll
      * @returns {object} The removed items, if any.
      */ }, { key: 'removeExpiredFromAll', value: function removeExpiredFromAll() {
      var _this7 = this;var expired = {};this.keys().forEach(function (id) {
        expired[id] = _this7.get(id).removeExpired();
      });return expired;
    } /**
      * Calls {@link Cache#touch} on each {@link Cache} in this
      * {@link CacheFactory}.
      *
      * @example
      * cacheFactory.touchAll();
      *
      * @method CacheFactory#touchAll
      */ }, { key: 'touchAll', value: function touchAll() {
      var _this8 = this;this.keys().forEach(function (cacheId) {
        _this8.get(cacheId).touch();
      });
    } }]);return CacheFactory;
}();

CacheFactory.Cache = Cache;

utils.equals = angular.equals;
utils.isObject = angular.isObject;
utils.fromJson = angular.fromJson;

function BinaryHeapProvider() {
  this.$get = function () {
    return BinaryHeap;
  };
}

function CacheFactoryProvider() {
  this.defaults = defaults$1;
  this.defaults.storagePrefix = 'angular-cache.caches.';

  this.$get = ['$q', function ($q) {
    utils.Promise = $q;
    return new CacheFactory();
  }];
}

angular.module('angular-cache', []).provider('BinaryHeap', BinaryHeapProvider).provider('CacheFactory', CacheFactoryProvider);

var index = 'angular-cache';

return index;

})));
//# sourceMappingURL=angular-cache.js.map
