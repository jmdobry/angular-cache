/**
 * @author Jason Dobry <jason.dobry@gmail.com>
 * @file angular-cache.js
 * @version 3.0.0-beta.1 - Homepage <https://github.com/jmdobry/angular-cache>
 * @copyright (c) 2013 Jason Dobry <http://www.pseudobry.com>
 * @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 *
 * @overview angular-cache is a very useful replacement for Angular's $cacheFactory.
 */
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @desc Provider for the DSBinaryHeap.
 */
function DSBinaryHeapProvider() {
	this.$get = function () {
		/**
		 * @method bubbleUp
		 * @param {array} heap The heap.
		 * @param {function} weightFunc The weight function.
		 * @param {number} n The index of the element to bubble up.
		 */
		function bubbleUp(heap, weightFunc, n) {
			var element = heap[n],
				weight = weightFunc(element);
			// When at 0, an element can not go up any further.
			while (n > 0) {
				// Compute the parent element's index, and fetch it.
				var parentN = Math.floor((n + 1) / 2) - 1,
					parent = heap[parentN];
				// If the parent has a lesser weight, things are in order and we
				// are done.
				if (weight >= weightFunc(parent)) {
					break;
				} else {
					heap[parentN] = element;
					heap[n] = parent;
					n = parentN;
				}
			}
		}

		/**
		 * @method bubbleDown
		 * @param {array} heap The heap.
		 * @param {function} weightFunc The weight function.
		 * @param {number} n The index of the element to sink down.
		 */
		function bubbleDown(heap, weightFunc, n) {
			var length = heap.length,
				node = heap[n],
				nodeWeight = weightFunc(node);

			while (true) {
				var child2N = (n + 1) * 2,
					child1N = child2N - 1;
				var swap = null;
				if (child1N < length) {
					var child1 = heap[child1N],
						child1Weight = weightFunc(child1);
					// If the score is less than our node's, we need to swap.
					if (child1Weight < nodeWeight) {
						swap = child1N;
					}
				}
				// Do the same checks for the other child.
				if (child2N < length) {
					var child2 = heap[child2N],
						child2Weight = weightFunc(child2);
					if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
						swap = child2N;
					}
				}

				if (swap === null) {
					break;
				} else {
					heap[n] = heap[swap];
					heap[swap] = node;
					n = swap;
				}
			}
		}

		/**
		 * @class DSBinaryHeap
		 * @desc DSBinaryHeap implementation of a priority queue.
		 * @param {function} weightFunc Function that returns the value that should be used for node value comparison.
		 * @example
		 * angular.module('app').controller(function (DSBinaryHeap) {
             *      var bHeap = new DSBinaryHeap(function (x) {
             *          return x.value;
             *      });
             * );
             */
		function DSBinaryHeap(weightFunc) {
			if (weightFunc && !angular.isFunction(weightFunc)) {
				throw new Error('DSBinaryHeap(weightFunc): weightFunc: must be a function!');
			}
			weightFunc = weightFunc || function (x) {
				return x;
			};
			this.weightFunc = weightFunc;
			this.heap = [];
		}

		/**
		 * @method DSBinaryHeap.push
		 * @desc Push an element into the binary heap.
		 * @param {*} node The element to push into the binary heap.
		 */
		DSBinaryHeap.prototype.push = function (node) {
			this.heap.push(node);
			bubbleUp(this.heap, this.weightFunc, this.heap.length - 1);
		};

		/**
		 * @method DSBinaryHeap.peek
		 * @desc Return, but do not remove, the minimum element in the binary heap.
		 * @returns {*}
		 */
		DSBinaryHeap.prototype.peek = function () {
			return this.heap[0];
		};

		/**
		 * @method DSBinaryHeap.pop
		 * @desc Remove and return the minimum element in the binary heap.
		 * @returns {*}
		 */
		DSBinaryHeap.prototype.pop = function () {
			var front = this.heap[0],
				end = this.heap.pop();
			if (this.heap.length > 0) {
				this.heap[0] = end;
				bubbleDown(this.heap, this.weightFunc, 0);
			}
			return front;
		};

		/**
		 * @method DSBinaryHeap.remove
		 * @desc Remove the first node in the priority queue that satisfies angular.equals comparison with
		 * the given node.
		 * @param {*} node The node to remove.
		 * @returns {*} The removed node.
		 */
		DSBinaryHeap.prototype.remove = function (node) {
			var length = this.heap.length;
			for (var i = 0; i < length; i++) {
				if (angular.equals(this.heap[i], node)) {
					var removed = this.heap[i],
						end = this.heap.pop();
					if (i !== length - 1) {
						this.heap[i] = end;
						bubbleUp(this.heap, this.weightFunc, i);
						bubbleDown(this.heap, this.weightFunc, i);
					}
					return removed;
				}
			}
			return null;
		};

		/**
		 * @method DSBinaryHeap.removeAll
		 * @desc Remove all nodes from this DSBinaryHeap.
		 */
		DSBinaryHeap.prototype.removeAll = function () {
			this.heap = [];
		};

		/**
		 * @method DSBinaryHeap.size
		 * @desc Return the size of the priority queue.
		 * @returns {number} The size of the priority queue.
		 */
		DSBinaryHeap.prototype.size = function () {
			return this.heap.length;
		};

		return DSBinaryHeap;
	};
}

module.exports = DSBinaryHeapProvider;

},{}],2:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:destroy
 * @name destroy
 * @description
 * Destroy this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#destroy()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 */
module.exports = function destroy() {
	clearInterval(this.$$cacheFlushIntervalId);
	clearInterval(this.$$recycleFreqId);
	this.removeAll();
	if (this.$$storage) {
		this.$$storage.removeItem(this.$$prefix + '.keys');
		this.$$storage.removeItem(this.$$prefix);
	}
	this.$$storage = null;
	this.$$data = null;
	this.$$lruHeap = null;
	this.$$expiresHeap = null;
	this.$$prefix = null;
};

},{}],3:[function(require,module,exports){
var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:get
 * @name get
 * @description
 * Retrieve the item with the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#get(key)
 * ```
 *
 * ## Examples:
 * ```js
 * ```
 *
 * @param {string} key The key of the item to retrieve.
 * @param {object=} options Optional configuration. Properties:
 * - `{function=}` - `onExpire` - Callback to be used if in passive `deleteOnExpire` mode and the requested item has
 * expired.
 * @returns {*} The item with the given key.
 */
module.exports = function get(key, options) {
	var _this = this;

	if (angular.isArray(key)) {
		var keys = key,
			values = [];

		angular.forEach(keys, function (key) {
			var value = _this.get(key, options);
			if (value !== null && value !== undefined) {
				values.push(value);
			}
		});

		return values;
	} else {
		key = utils.stringifyNumber(key);

		if (this.$$disabled) {
			return;
		}
	}

	options = options || {};
	if (!angular.isString(key)) {
		throw angular.$$minErr('ng')('areq', 'Expected key to be a string! Found: {0}.', typeof key);
	} else if (options && !angular.isObject(options)) {
		throw angular.$$minErr('ng')('areq', 'Expected options to be an object! Found: {0}.', typeof options);
	} else if (options.onExpire && !angular.isFunction(options.onExpire)) {
		throw angular.$$minErr('ng')('areq', 'Expected options.onExpire to be a function! Found: {0}.', typeof options.onExpire);
	}

	var item;

	if (this.$$storage) {
		var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

		if (itemJson) {
			item = angular.fromJson(itemJson);
		} else {
			return;
		}
	} else {
		if (!(key in this.$$data)) {
			return;
		}

		item = this.$$data[key];
	}

	var value = item.value,
		now = new Date().getTime();

	if (this.$$storage) {
		this.$$lruHeap.remove({
			key: key,
			accessed: item.accessed
		});
		item.accessed = now;
		this.$$lruHeap.push({
			key: key,
			accessed: now
		});
	} else {
		this.$$lruHeap.remove(item);
		item.accessed = now;
		this.$$lruHeap.push(item);
	}

	if (this.$$deleteOnExpire === 'passive' && 'expires' in item && item.expires < now) {
		this.remove(key);

		if (this.$$onExpire) {
			this.$$onExpire(key, item.value, options.onExpire);
		} else if (options.onExpire) {
			options.onExpire(key, item.value);
		}
		value = undefined;
	} else if (this.$$storage) {
		this.$$storage.setItem(this.$$prefix + '.data.' + key, angular.toJson(item));
	}

	return value;
};

},{"../utils":22}],4:[function(require,module,exports){
var defaults = require('../defaults');

/*!
 * Configure the cache to use webStorage.
 */
function _setStorageMode(storageMode, storageImpl) {
	var $window = angular.injector(['ng']).get('$window');

	if (!angular.isString(storageMode)) {
		throw angular.$$minErr('ng')('areq', 'Expected storageMode to be a string! Found: {0}.', typeof storageMode);
	} else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
		throw angular.$$minErr('ng')('areq', 'Expected storageMode to be "memory", "localStorage" or "sessionStorage"! Found: {0}.', storageMode);
	}

	this.$$storageMode = storageMode;

	if (storageImpl) {
		if (!angular.isObject(storageImpl)) {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to be an object! Found: {0}.', typeof storageImpl);
		} else if (!('setItem' in storageImpl) || typeof storageImpl.setItem !== 'function') {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to implement "setItem(key, value)"! Found: {0}.', typeof storageImpl.setItem);
		} else if (!('getItem' in storageImpl) || typeof storageImpl.getItem !== 'function') {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to implement "getItem(key)"! Found: {0}.', typeof storageImpl.getItem);
		} else if (!('removeItem' in storageImpl) || typeof storageImpl.removeItem !== 'function') {
			throw angular.$$minErr('ng')('areq', 'Expected storageImpl to implement "removeItem(key)"! Found: {0}.', typeof storageImpl.removeItem);
		}
		this.$$storage = storageImpl;
	} else if (this.$$storageMode === 'localStorage') {
		this.$$storage = $window.localStorage;
	} else if (this.$$storageMode === 'sessionStorage') {
		this.$$storage = $window.sessionStorage;
	}
}

/**
 * @doc method
 * @id DSCache.methods:setOptions
 * @name setOptions
 * @description
 * Configure this cache with the given options. With this method you can configure all of this cache's settings at once.
 *
 * ## Signature:
 * ```js
 * DSCache#setOptions(cacheOptions[, strict])
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @param {object} cacheOptions New configuration options for the cache.
 * @param {boolean=} strict If true then any existing configuration will be reset to the defaults before
 * applying the new options, otherwise only the options specified in the options hash will be altered.
 */
function _setOptions(cacheOptions, strict) {
	cacheOptions = cacheOptions || {};
	strict = !!strict;
	if (!angular.isObject(cacheOptions)) {
		throw angular.$$minErr('ng')('areq', 'Expected cacheOptions to be an object! Found: {0}.', typeof cacheOptions);
	}

	if ('disabled' in cacheOptions) {
		this.$$disabled = !!cacheOptions.disabled;
	} else if (strict) {
		delete this.$$disabled;
	}

	if ('capacity' in cacheOptions) {
		this.setCapacity(cacheOptions.capacity);
	} else if (strict) {
		this.setCapacity(null);
	}

	if ('deleteOnExpire' in cacheOptions) {
		this.setDeleteOnExpire(cacheOptions.deleteOnExpire);
	} else if (strict) {
		this.setDeleteOnExpire(null);
	}

	if ('maxAge' in cacheOptions) {
		this.setMaxAge(cacheOptions.maxAge);
	} else if (strict) {
		this.setMaxAge(null);
	}

	if ('recycleFreq' in cacheOptions) {
		this.setRecycleFreq(cacheOptions.recycleFreq);
	} else if (strict) {
		this.setRecycleFreq(null);
	}

	if ('cacheFlushInterval' in cacheOptions) {
		this.setCacheFlushInterval(cacheOptions.cacheFlushInterval);
	} else if (strict) {
		this.setCacheFlushInterval(null);
	}

	if ('onExpire' in cacheOptions) {
		this.setOnExpire(cacheOptions.onExpire);
	} else if (strict) {
		this.setOnExpire(null);
	}
}

/*!
 * @doc function
 * @id DSCache
 * @name DSCache
 * @description
 * Instantiated via <code>$angularCacheFactory(cacheId[, options])</code>
 * @param {string} cacheId The id of the new cache.
 * @param {object=} options Configuration options.
 */
function DSCache(cacheId, options) {

	this.$$data = {};
	this.$$id = cacheId;
	this.$$storage = null;

	this.$$expiresHeap = new DSBinaryHeap(function (x) {
		return x.expires;
	});

	this.$$lruHeap = new DSBinaryHeap(function (x) {
		return x.accessed;
	});

	options = options || {};

	if ('storageMode' in options) {
		_setStorageMode.apply(this, [options.storageMode, options.storageImpl]);
	}
	if ('storagePrefix' in options) {
		this.$$storagePrefix = options.storagePrefix;
	}

	this.$$prefix = this.$$storagePrefix + cacheId;

	// Initialize this cache with the default and given options
	_setOptions.apply(this, [options, true]);
}

for (var key in defaults.defaults) {
	DSCache.prototype['$$' + key] = defaults.defaults[key];
}

DSCache.prototype.setOptions = _setOptions;
DSCache.prototype.setCapacity = require('./setCapacity');
DSCache.prototype.setDeleteOnExpire = require('./setDeleteOnExpire');
DSCache.prototype.setMaxAge = require('./setMaxAge');
DSCache.prototype.setRecycleFreq = require('./setRecycleFreq');
DSCache.prototype.setCacheFlushInterval = require('./setCacheFlushInterval');
DSCache.prototype.setOnExpire = require('./setOnExpire');
DSCache.prototype.put = require('./put');
DSCache.prototype.get = require('./get');
DSCache.prototype.remove = require('./remove');
DSCache.prototype.removeAll = require('./removeAll');
DSCache.prototype.removeExpired = require('./removeExpired');
DSCache.prototype.destroy = require('./destroy');
DSCache.prototype.info = require('./info');
DSCache.prototype.keySet = require('./keySet');
DSCache.prototype.keys = require('./keys');

/**
 * @doc method
 * @id DSCache.methods:disable
 * @name disable
 * @description
 * Disable this cache. Disabling a cache does not remove any data, it just turns DSCache#get and DSCache#put into noops.
 *
 * ## Signature:
 * ```js
 * DSCache#disable()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 */
DSCache.prototype.disable = function () {
	this.$$disabled = true;
};

/**
 * @doc method
 * @id DSCache.methods:enable
 * @name enable
 * @description
 * Enable this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#enable()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 */
DSCache.prototype.enable = function () {
	delete this.$$disabled;
};

module.exports = DSCache;

},{"../defaults":"Gv0+ce","./destroy":2,"./get":3,"./info":5,"./keySet":6,"./keys":7,"./put":8,"./remove":9,"./removeAll":10,"./removeExpired":11,"./setCacheFlushInterval":12,"./setCapacity":13,"./setDeleteOnExpire":14,"./setMaxAge":15,"./setOnExpire":16,"./setRecycleFreq":17}],5:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:info
 * @name info
 * @description
 * Return the status of this cache, or if `key` is provided return the status of the item with that key.
 *
 * ## Signature:
 * ```js
 * DSCache#info([key])
 * ```
 *
 * ## Examples:
 * ```js
 * ```
 *
 * @param {string=} key The key of the item whose status is to be retrieved.
 * @returns {object} The status of this cache or the item for the given key.
 */
module.exports = function info(key) {
	if (key) {
		if (key in this.$$data) {
			var item = this.$$data[key];

			return {
				created: item.created,
				accessed: item.accessed,
				expires: item.expires,
				isExpired: (new Date().getTime() - item.created) > this.$$maxAge
			};
		} else {
			return undefined;
		}
	} else {
		return {
			id: this.$$id,
			capacity: this.$$capacity,
			maxAge: this.$$maxAge,
			deleteOnExpire: this.$$deleteOnExpire,
			onExpire: this.$$onExpire,
			cacheFlushInterval: this.$$cacheFlushInterval,
			recycleFreq: this.$$recycleFreq,
			storageMode: this.$$storageMode,
			storageImpl: this.$$storageImpl,
			disabled: this.$$disabled,
			size: this.$$lruHeap && this.$$lruHeap.size() || 0
		};
	}
};

},{}],6:[function(require,module,exports){
var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:keySet
 * @name keySet
 * @description
 * Return an object of the keys in this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#keySet()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @returns {object} An object of the keys in this cache.
 */
module.exports = function keySet() {
	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys'),
			kSet = {};

		if (keysJson) {
			var keys = angular.fromJson(keysJson);

			for (var i = 0; i < keys.length; i++) {
				kSet[keys[i]] = keys[i];
			}
		}
		return kSet;
	} else {
		return utils.keySet(this.$$data);
	}
};

},{"../utils":22}],7:[function(require,module,exports){
var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:keys
 * @name keys
 * @description
 * Return an array of the keys in this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#keys()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @returns {Array} An array of the keys in this cache.
 */
module.exports = function keys() {
	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

		if (keysJson) {
			return angular.fromJson(keysJson);
		} else {
			return [];
		}
	} else {
		return utils.keys(this.$$data);
	}
};

},{"../utils":22}],8:[function(require,module,exports){
var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:put
 * @name put
 * @description
 * Insert a value into the cache under the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#put(key, value)
 * ```
 *
 * ## Examples:
 * ```js
 * ```
 *
 * ## Throws:
 * - `Error` - `key` must be a string.
 *
 * @param {string} key The key under which to store the given value.
 * @param {*} value The value to store.
 * @returns {*} The newly stored item.
 */
module.exports = function put(key, value) {
	if (this.$$disabled || value === null || value === undefined) {
		return;
	}

	key = utils.stringifyNumber(key);

	if (!angular.isString(key)) {
		throw angular.$$minErr('ng')('areq', 'Expected key to be a string! Found: {0}.', typeof key);
	}

	var now = new Date().getTime(),
		item = {
			key: key,
			value: value,
			created: now,
			accessed: now,
		};

	item.expires = item.created + this.$$maxAge;

	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys'),
			keys = keysJson ? angular.fromJson(keysJson) : [],
			itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

		// Remove existing
		if (itemJson) {
			this.remove(key);
		}
		// Add to expires heap
		this.$$expiresHeap.push({
			key: key,
			expires: item.expires
		});
		// Add to lru heap
		this.$$lruHeap.push({
			key: key,
			accessed: item.accessed
		});
		// Set item
		this.$$storage.setItem(this.$$prefix + '.data.' + key, angular.toJson(item));
		keys.push(key);
		this.$$storage.setItem(this.$$prefix + '.keys', angular.toJson(keys));
	} else {
		// Remove existing
		if (this.$$data[key]) {
			this.remove(key);
		}
		// Add to expires heap
		this.$$expiresHeap.push(item);
		// Add to lru heap
		this.$$lruHeap.push(item);
		// Set item
		this.$$data[key] = item;
	}

	// Handle exceeded capacity
	if (this.$$lruHeap.size() > this.$$capacity) {
		this.remove(this.$$lruHeap.peek().key);
	}

	return value;
};

},{"../utils":22}],9:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:remove
 * @name remove
 * @description
 * Remove the item with the given key.
 *
 * ## Signature:
 * ```js
 * DSCache#remove(key)
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @param {string} key The key of the item to remove.
 * @returns {*} The removed item if an item was removed.
 */
module.exports = function remove(key) {
	if (this.$$storage) {
		var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

		if (itemJson) {
			var item = angular.fromJson(itemJson);
			this.$$lruHeap.remove({
				key: key,
				accessed: item.accessed
			});
			this.$$expiresHeap.remove({
				key: key,
				expires: item.expires
			});
			this.$$storage.removeItem(this.$$prefix + '.data.' + key);
			var keysJson = this.$$storage.getItem(this.$$prefix + '.keys'),
				keys = keysJson ? angular.fromJson(keysJson) : [],
				index = keys.indexOf(key);

			if (index >= 0) {
				keys.splice(index, 1);
			}
			this.$$storage.setItem(this.$$prefix + '.keys', angular.toJson(keys));
			return item.value;
		}
	} else {
		var value = this.$$data[key] ? this.$$data[key].value : undefined;
		this.$$lruHeap.remove(this.$$data[key]);
		this.$$expiresHeap.remove(this.$$data[key]);
		this.$$data[key] = null;
		delete this.$$data[key];
		return value;
	}
};

},{}],10:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:removeAll
 * @name removeAll
 * @description
 * Remove all items from this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#removeAll()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 */
module.exports = function removeAll() {
	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

		if (keysJson) {
			var keys = angular.fromJson(keysJson);

			for (var i = 0; i < keys.length; i++) {
				this.remove(keys[i]);
			}
		}
		this.$$storage.setItem(this.$$prefix + '.keys', angular.toJson([]));
	} else {
		this.$$lruHeap.removeAll();
		this.$$expiresHeap.removeAll();
		for (var key in this.$$data) {
			this.$$data[key] = null;
		}
		this.$$data = {};
	}
};

},{}],11:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:removeExpired
 * @name removeExpired
 * @description
 * Remove and return all expired items from the cache.
 *
 * ## Signature:
 * ```js
 * DSCache#removeExpired()
 * ```
 *
 * ## Example:
 * ```js
 * ```
 *
 * @returns {object} The removed items, if any.
 */
module.exports = function removeExpired() {
	var now = new Date().getTime(),
		expired = {},
		key,
		expiredItem;

	while ((expiredItem = this.$$expiresHeap.peek()) && expiredItem.expires < now) {
		expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;
		this.$$expiresHeap.pop();
	}

	if (this.$$storage) {
		for (key in expired) {
			var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);
			if (itemJson) {
				expired[key] = angular.fromJson(itemJson).value;
				this.remove(key);
			}
		}
	} else {
		for (key in expired) {
			this.remove(key);
		}
	}

	if (this.$$onExpire) {
		for (key in expired) {
			this.$$onExpire(key, expired[key]);
		}
	}

	return expired;
};

},{}],12:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:setCacheFlushInterval
 * @name setCacheFlushInterval
 * @description
 * Set the `cacheFlushInterval` setting for this cache. If set, this setting will cause this cache to periodically
 * clear itself.
 *
 * ## Signature:
 * ```js
 * DSCache#setCacheFlushInterval(cacheFlushInterval)
 * ```
 *
 * ## Example:
 * ```js
 *  var cache = DSCacheFactory('cache');
 *
 *  cache.put('1', 'apple');
 *  cache.put('2', 'banana');
 *
 *  cache.info().size; // 2
 *  cache.setCacheFlushInterval(60000);
 *
 *  setTimeout(function () {
 *      cache.info().size; // 0
 *  }, 90000);
 * ```
 *
 * ## Throws:
 * - `Error` - `cacheFlushInterval` must be `null` or a number greater than zero.
 *
 * @param {number|null} cacheFlushInterval The new cacheFlushInterval for this cache in milliseconds. If
 * `cacheFlushInterval` is `null` then `cacheFlushInterval` for this cache will be reset to the default (`null`).
 */
module.exports = function setCacheFlushInterval(cacheFlushInterval) {
	if (cacheFlushInterval === null) {
		delete this.$$cacheFlushInterval;
	} else if (!angular.isNumber(cacheFlushInterval)) {
		throw angular.$$minErr('ng')('areq', 'Expected cacheFlushInterval to be a number! Found: {0}.', typeof cacheFlushInterval);
	} else if (cacheFlushInterval < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected cacheFlushInterval to be greater than zero! Found: {0}.', cacheFlushInterval);
	} else if (cacheFlushInterval !== this.$$cacheFlushInterval) {
		this.$$cacheFlushInterval = cacheFlushInterval;
		clearInterval(this.$$cacheFlushIntervalId);
		(function (_this) {
			_this.$$cacheFlushIntervalId = setInterval(function () {
				_this.removeAll();
			}, _this.$$cacheFlushInterval);
		})(this);
	}
};

},{}],13:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:setCapacity
 * @name setCapacity
 * @description
 * Set the capacity for this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#setCapacity(capacity)
 * ```
 *
 * ## Example:
 * ```js
 * var smallCache = DSCacheFactory('smallCache', { capacity: 2 });
 *
 * smallCache.info().size; // 0
 *
 * smallCache.put('1', 'apple');
 * smallCache.put('2', 'banana');
 *
 * smallCache.info().size; // 2
 *
 * // Least-recently used items are removed
 * // when the cache's new capacity exceeds
 * // its size
 * smallCache.setCapacity(1);
 *
 * smallCache.get('1'); // undefined
 * smallCache.info().size; // 1
 * ```
 *
 * ## Throws:
 * - `Error` - `capacity` must be `null` or a number greater than zero.
 *
 * @param {number|null} capacity The new capacity for this cache. If `capacity` is `null` then the capacity for this cache
 * will be reset to the default (`Number.MAX_VALUE`).
 * @returns {object} Key-value pairs of any items removed because this cache's size exceeds the new capacity.
 */
module.exports = function setCapacity(capacity) {
	if (capacity === null) {
		delete this.$$capacity;
	} else if (!angular.isNumber(capacity)) {
		throw angular.$$minErr('ng')('areq', 'Expected capacity to be a number! Found: {0}.', typeof capacity);
	} else if (capacity < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected capacity to be greater than zero! Found: {0}.', capacity);
	} else {
		this.$$capacity = capacity;
	}
	var removed = {};
	while (this.$$lruHeap.size() > this.$$capacity) {
		removed[this.$$lruHeap.peek().key] = this.remove(this.$$lruHeap.peek().key);
	}
	return removed;
};

},{}],14:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:setDeleteOnExpire
 * @name setDeleteOnExpire
 * @description
 * Set the behavior for this cache for when items expire. This setting determines what this cache will do when one of
 * its items expires.
 *
 * ## Possible Values:
 * - `"none"` - Do nothing when items expire.
 * - `"passive"` - Do nothing when items expire, but if an expired item is requested, remove it from the cache and return `undefined`.
 * - `"aggressive"` - Scan for expired items on the interval specified by the `recycleFreq` setting for this cache (defaults
 * to `1000ms`) and actively remove any expired items.
 *
 * ## Signature:
 * ```js
 * DSCache#setDeleteOnExpire(deleteOnExpire)
 * ```
 *
 * ## Example:
 * ```js
 * var cache = DSCacheFactory('cache');
 *
 * cache.put('1', 'apple');
 *
 * // Wait a few seconds
 *
 * cache.get('1'); // "apple"
 *
 * cache.setDeleteOnExpire('aggressive');
 *
 * // Wait a few seconds
 *
 * cache.get('1'); // undefined
 * ```
 *
 * ## Throws:
 * - `Error` - `deleteOnExpire` must be `null`, `"none"`, `"passive"` or `"aggressive"`.
 *
 * @param {string|null} deleteOnExpire The new deleteOnExpire for this cache. If `deleteOnExpire` is `null` then
 * `deleteOnExpire` for this cache will be reset to the default (`"none"`).
 */
module.exports = function setDeleteOnExpire(deleteOnExpire) {
	if (deleteOnExpire === null) {
		delete this.$$deleteOnExpire;
	} else if (!angular.isString(deleteOnExpire)) {
		throw angular.$$minErr('ng')('areq', 'Expected deleteOnExpire to be a string! Found: {0}.', typeof deleteOnExpire);
	} else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
		throw angular.$$minErr('ng')('areq', 'Expected deleteOnExpire to be "none", "passive" or "aggressive"! Found: {0}.', deleteOnExpire);
	} else {
		this.$$deleteOnExpire = deleteOnExpire;
	}
	this.setRecycleFreq(this.$$recycleFreq);
};

},{}],15:[function(require,module,exports){
var utils = require('../utils');

/**
 * @doc method
 * @id DSCache.methods:setMaxAge
 * @name setMaxAge
 * @description
 * Set the `maxAge` setting for this cache. This setting specifies how long items can be in the cache before they expire.
 *
 * ## Signature:
 * ```js
 * DSCache#setMaxAge(maxAge)
 * ```
 *
 * ## Example:
 * ```js
 *  var cache = DSCacheFactory('cache', { deleteOnExpire: 'aggressive' });
 *
 *  // This won't expire for a long time
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *      // 'apple' will be removed because it
 *      // has already been in the cache longer
 *      // than the new maxAge
 *      var removed = cache.setMaxAge(1000);
 *
 *      removed; // {
 *               //     '1': 'apple'
 *               // }
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `maxAge must be `null` or a number greater than zero.
 *
 * @param {number} maxAge The new maxAge for this cache in milliseconds. If `maxAge` is `null` then `maxAge` for this
 * cache will be reset to the default (`Number.MAX_VALUE`);
 * @returns {object} Key-value pairs of any items aggressively removed because they are expired according to the new
 * `maxAge`. Items are only removed if the `deleteOnExpire` setting for this cache is set to `"aggressive"`.
 */
module.exports = function setMaxAge(maxAge) {
	if (maxAge === null) {
		delete this.$$maxAge;
	} else if (!angular.isNumber(maxAge)) {
		throw angular.$$minErr('ng')('areq', 'Expected maxAge to be a number! Found: {0}.', typeof maxAge);
	} else if (maxAge < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected maxAge to be greater than zero! Found: {0}.', maxAge);
	} else {
		this.$$maxAge = maxAge;
	}
	var i, keys, key;

	this.$$expiresHeap.removeAll();

	if (this.$$storage) {
		var keysJson = this.$$storage.getItem(this.$$prefix + '.keys');

		keys = keysJson ? angular.fromJson(keysJson) : [];

		for (i = 0; i < keys.length; i++) {
			key = keys[i];
			var itemJson = this.$$storage.getItem(this.$$prefix + '.data.' + key);

			if (itemJson) {
				var item = angular.fromJson(itemJson);
				if (this.$$maxAge === Number.MAX_VALUE) {
					item.expires = Number.MAX_VALUE;
				} else {
					item.expires = item.created + this.$$maxAge;
				}
				this.$$expiresHeap.push({
					key: key,
					expires: item.expires
				});
			}
		}
	} else {
		keys = utils.keys(this.$$data);

		for (i = 0; i < keys.length; i++) {
			key = keys[i];
			if (this.$$maxAge === Number.MAX_VALUE) {
				this.$$data[key].expires = Number.MAX_VALUE;
			} else {
				this.$$data[key].expires = this.$$data[key].created + this.$$maxAge;
			}
			this.$$expiresHeap.push(this.$$data[key]);
		}
	}
	if (this.$$deleteOnExpire === 'aggressive') {
		return this.removeExpired();
	} else {
		return {};
	}
};

},{"../utils":22}],16:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:setOnExpire
 * @name setOnExpire
 * @description
 * Set the global `onExpire` callback for this cache.
 *
 * ## Signature:
 * ```js
 * DSCache#setOnExpire(onExpire)
 * ```
 *
 * ## Examples:
 * ```js
 *  var options = {
 *      onExpire: function (key, value) {
 *          window.lastExpiredItem = key;
 *      },
 *      maxAge: 1000,
 *      deleteOnExpire: 'aggressive'
 *  };
 *  var cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *      window.lastExpiredItem; // '1'
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `cacheFlushInterval` must be `null` or a number greater than zero.
 *
 * @param {function|null} onExpire The new onExpire callback for this cache. If `onExpire` is `null` then the onExpire
 * callback for this cache will be removed.
 */
module.exports = function setOnExpire(onExpire) {
	if (onExpire === null) {
		delete this.$$onExpire;
	} else if (!angular.isFunction(onExpire)) {
		throw angular.$$minErr('ng')('areq', 'Expected onExpire to be a function! Found: {0}.', typeof onExpire);
	} else {
		this.$$onExpire = onExpire;
	}
};

},{}],17:[function(require,module,exports){
/**
 * @doc method
 * @id DSCache.methods:setRecycleFreq
 * @name setRecycleFreq
 * @description
 * Set the `recycleFreq` setting for this cache. This setting determines how often this cache will scan for expired
 * items. The cache will only scan for expired items if the `deleteOnExpire` setting for this cache is set to
 * `"aggressive"`.
 *
 * ## Signature:
 * ```js
 * DSCache#setRecycleFreq(recycleFreq)
 * ```
 *
 * ## Example:
 * ```js
 *  var options = {
 *      deleteOnExpire: 'aggressive',
 *      maxAge: 1000
 *  };
 *  var cache = DSCacheFactory('cache', options);
 *
 *  cache.put('1', 'apple');
 *
 *  setTimeout(function () {
 *
 *      cache.get('1'); // undefined
 *      cache.setRecycleFreq(60000);
 *
 *      // This expires after 1 second, but the cache
 *      // only checks every 60 seconds now
 *      cache.put('1', 'apple');
 *
 *      setTimeout(function () {
 *          // expired, but won't be removed
 *          // until the next check
 *          cache.get('1'); // "apple"
 *          cache.info('1').isExpired; // true
 *      }, 1500);
 *  }, 1500);
 * ```
 *
 * ## Throws:
 * - `Error` - `recycleFreq` must be `null` or a number greater than zero.
 *
 * @param {number} recycleFreq The new recycleFreq for this cache in milliseconds. If `recycleFreq` is `null` then
 * `recycleFreq` for this cache will be reset to the default (`1000` milliseconds).
 */
module.exports = function setRecycleFreq(recycleFreq) {
	if (recycleFreq === null) {
		delete this.$$recycleFreq;
	} else if (!angular.isNumber(recycleFreq)) {
		throw angular.$$minErr('ng')('areq', 'Expected recycleFreq to be a number! Found: {0}.', typeof recycleFreq);
	} else if (recycleFreq < 0) {
		throw angular.$$minErr('ng')('areq', 'Expected recycleFreq to be greater than zero! Found: {0}.', recycleFreq);
	} else {
		this.$$recycleFreq = recycleFreq;
	}
	clearInterval(this.$$recycleFreqId);
	if (this.$$deleteOnExpire === 'aggressive') {
		(function (_this) {
			_this.$$recycleFreqId = setInterval(function () {
				_this.removeExpired();
			}, _this.$$recycleFreq);
		})(this);
	} else {
		delete this.$$recycleFreqId;
	}
};

},{}],18:[function(require,module,exports){
var defaults = require('../defaults'),
	DSCache = require('../DSCache'),
	version = '3.0.0-beta.1';

/**
 * @doc function
 * @id DSCacheFactoryProvider
 * @name DSCacheFactoryProvider
 */
function DSCacheFactoryProvider() {

	var config = new defaults.Config();

	this.version = version;

	/**
	 * @doc method
	 * @id DSCacheFactoryProvider.methods:setCacheDefaults
	 * @name setCacheDefaults
	 * @desc Set the default configuration for all caches created by $angularCacheFactory.
	 * @param {object} options Default configuration options for each new cache.
	 */
	this.setCacheDefaults = function (options) {
		options = options || {};

		if (!angular.isObject(options)) {
			throw angular.$$minErr('ng')('areq', 'Expected options to be an object! Found: {0}.', typeof options);
		}

		for (var key in defaults.defaults) {
			if (key in options) {
				config[key] = options[key];
			}
		}
		if ('disabled' in options) {
			config.$$disabled = !!options.disabled;
		}
	};

	this.$get = function () {
		var caches = {};

		/*!
		 * @method _keys
		 * @desc Returns an array of the keys of the given collection.
		 * @param {object} collection The collection from which to get the keys.
		 * @returns {array} An array of the keys of the given collection.
		 */
		function _keys(collection) {
			var keys = [], key;
			for (key in collection) {
				if (collection.hasOwnProperty(key)) {
					keys.push(key);
				}
			}
			return keys;
		}

		/**
		 * @doc function
		 * @id DSCacheFactory
		 * @name DSCacheFactory
		 * @description
		 * ## Version: 3.0.0-beta.1
		 *
		 * Factory function that produces instances of `DSCache`.
		 *
		 * @param {string} cacheId The id of the new cache.
		 * @param {object} options Configuration options. Properties:
		 *
		 * - `{number}` - `capacity` - Default: `Number.MAX_VALUE`
		 * - `{number}` - `maxAge` - Default: `null`
		 * - `{number}` - `deleteOnExpire` - Default: `none`
		 * - `{function}` - `onExpire` - Default: `null`
		 * - `{number}` - `cacheFlushInterval` - Default: `null`
		 * - `{number}` - `recycleFreq` - Default: `1000`
		 * - `{number}` - `deleteOnExpire` - Default: `null`
		 * - `{string}` - `storageMode` - Default: `'none`
		 * - `{object}` - `storageImpl` - Default: `null`
		 * - `{boolean}` - `disabled` - Default: `false`
		 *
		 * @returns {DSCache} New instance of DSCache.
		 */
		function DSCacheFactory(cacheId, options) {
			if (cacheId in caches) {
				throw angular.$$minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
			} else if (!angular.isString(cacheId)) {
				throw angular.$$minErr('ng')('areq', 'Expected cacheId to be a string! Found: {0}.', typeof cacheId);
			}

			caches[cacheId] = new DSCache(cacheId, angular.extend({}, config, options));
			caches[cacheId].destroy = function () {
				this.constructor.prototype.destroy.call(this);
				delete caches[this.$$id];
			};
			return caches[cacheId];
		}

		DSCacheFactory.version = version;

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:info
		 * @name info
		 * @description
		 * Return the status of `DSCacheFactory`.
		 * @returns {object} The status of `DSCacheFactory`.
		 */
		DSCacheFactory.info = function () {
			var keys = _keys(caches);
			var info = {
				size: keys.length,
				caches: {}
			};
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				info.caches[key] = caches[key].info();
			}
			var c = info.cacheDefaults = angular.extend({}, config);
			for (var option in defaults.defaults) {
				if (!(option in c)) {
					c[option] = config['$$' + option];
				}
			}
			return info;
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:get
		 * @name get
		 * @description
		 * Return the cache with the given `cacheId`.
		 * @param {string} cacheId The id of the desired cache.
		 * @returns {DSCache} The cache with the specified `cacheId`.
		 */
		DSCacheFactory.get = function (cacheId) {
			if (!angular.isString(cacheId)) {
				throw angular.$$minErr('ng')('areq', 'Expected cacheId to be a string! Found: {0}.', typeof cacheId);
			}
			return caches[cacheId];
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:keySet
		 * @name keySet
		 * @description
		 * Return an object containing the `cacheId` of each cache.
		 * @returns {object} An object containing the `cacheId` of each cache.
		 */
		DSCacheFactory.keySet = function () {
			var cacheIds = {}, cacheId;
			for (cacheId in caches) {
				if (caches.hasOwnProperty(cacheId)) {
					cacheIds[cacheId] = cacheId;
				}
			}
			return cacheIds;
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:keys
		 * @name keys
		 * @description
		 * Return an array containing the `cacheId` of each cache.
		 * @returns {array} An array containing the `cacheId` of each cache.
		 */
		DSCacheFactory.keys = function () {
			return _keys(caches);
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:destroyAll
		 * @name destroyAll
		 * @description
		 * Destroy all caches.
		 *
		 * ## Signature:
		 * ```js
		 * DSCacheFactory.destroyAll()
		 * ```
		 *
		 * ## Example:
		 * ```js
		 * var newCache = DSCacheFactory('newCache');
		 * var otherCache = DSCacheFactory('otherCache');
		 *
		 * newCache.info().size; // 0
		 * otherCache.info().size; // 0
		 *
		 * newCache.put('1', 'apple');
		 * newCache.put('2', 'banana');
		 * otherCache.put('abcd', 'horse');
		 *
		 * newCache.info().size; // 2
		 * otherCache.info().size; // 1
		 *
		 * DSCacheFactory.destroyAll();
		 *
		 * newCache.info().size; // Error thrown
		 * otherCache.info().size; // Error thrown
		 *
		 * DSCacheFactory.get('newCache'); // undefined
		 * DSCacheFactory.get('otherCache'); // undefined
		 * ```
		 */
		DSCacheFactory.destroyAll = function () {
			for (var cacheId in caches) {
				caches[cacheId].destroy();
			}
			caches = {};
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:clearAll
		 * @name clearAll
		 * @description
		 * Clear the contents of all caches.
		 *
		 * ## Signature:
		 * ```js
		 * DSCacheFactory.clearAll()
		 * ```
		 *
		 * ## Example:
		 * ```js
		 * var newCache = DSCacheFactory('newCache');
		 * var otherCache = DSCacheFactory('otherCache');
		 *
		 * newCache.info().size; // 0
		 * otherCache.info().size; // 0
		 *
		 * newCache.put('1', 'apple');
		 * newCache.put('2', 'banana');
		 * otherCache.put('abcd', 'horse');
		 *
		 * newCache.info().size; // 2
		 * otherCache.info().size; // 1
		 *
		 * DSCacheFactory.clearAll();
		 *
		 * newCache.info().size; // 0
		 * otherCache.info().size; // 0
		 * ```
		 */
		DSCacheFactory.clearAll = function () {
			for (var cacheId in caches) {
				caches[cacheId].removeAll();
			}
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:enableAll
		 * @name enableAll
		 * @description
		 * Enable any disabled caches.
		 *
		 * ## Signature:
		 * ```js
		 * DSCacheFactory.enableAll()
		 * ```
		 *
		 * ## Example:
		 * ```js
		 * var newCache = DSCacheFactory('newCache', { disabled: true });
		 * var otherCache = DSCacheFactory('otherCache', { disabled: true });
		 *
		 * newCache.info().disabled; // true
		 * otherCache.info().disabled; // true
		 *
		 * DSCacheFactory.enableAll();
		 *
		 * newCache.info().disabled; // false
		 * otherCache.info().disabled; // false
		 * ```
		 */
		DSCacheFactory.enableAll = function () {
			for (var cacheId in caches) {
				caches[cacheId].$$disabled = false;
			}
		};

		/**
		 * @doc method
		 * @id DSCacheFactory.methods:disableAll
		 * @name disableAll
		 * @description
		 * Disable all caches.
		 *
		 * ## Signature:
		 * ```js
		 * DSCacheFactory.disableAll()
		 * ```
		 *
		 * ## Example:
		 * ```js
		 * var newCache = DSCacheFactory('newCache');
		 * var otherCache = DSCacheFactory('otherCache');
		 *
		 * newCache.info().disabled; // false
		 * otherCache.info().disabled; // false
		 *
		 * DSCacheFactory.disableAll();
		 *
		 * newCache.info().disabled; // true
		 * otherCache.info().disabled; // true
		 * ```
		 */
		DSCacheFactory.disableAll = function () {
			for (var cacheId in caches) {
				caches[cacheId].$$disabled = true;
			}
		};

		return DSCacheFactory;
	};
}

module.exports = DSCacheFactoryProvider;

},{"../DSCache":4,"../defaults":"Gv0+ce"}],"Defaults":[function(require,module,exports){
module.exports=require('Gv0+ce');
},{}],"Gv0+ce":[function(require,module,exports){
var defaults = {
	capacity: Number.MAX_VALUE,
	maxAge: Number.MAX_VALUE,
	deleteOnExpire: 'none',
	onExpire: null,
	cacheFlushInterval: null,
	recycleFreq: 1000,
	storageMode: 'memory',
	storageImpl: null,
	disabled: false,
	storagePrefix: 'ac.'
};

function Config() {
}

for (var option in defaults) {
	Config.prototype['$$' + option] = defaults[option];
}

module.exports = {
	Config: Config,
	defaults: defaults
};

},{}],21:[function(require,module,exports){
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
	 * @name Overview
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

},{"./DSBinaryHeap":1,"./DSCacheFactory":18}],22:[function(require,module,exports){
module.exports = {
	/*!
	 * Stringify a number.
	 */
	stringifyNumber: function (number) {
		if (number && angular.isNumber(number)) {
			return number.toString();
		}
		return number;
	},

	/*!
	 * Return a hash of the keys in the given collection.
	 */
	keySet: function (collection) {
		var keySet = {}, key;
		for (key in collection) {
			if (collection.hasOwnProperty(key)) {
				keySet[key] = key;
			}
		}
		return keySet;
	},

	/*!
	 * Return an array of the keys in the given collection
	 */
	keys: function (collection) {
		var keys = [], key;
		for (key in collection) {
			if (collection.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		return keys;
	}
};

},{}]},{},[21])
