describe('DSCacheFactory(cacheId, options)', function () {
	it('should be able to create a default cache.', function (done) {
		var cache = DSCacheFactory('DSCacheFactory.cache');
		assert.isDefined(cache);
		assert.equal(cache.info().id, 'DSCacheFactory.cache');
		assert.equal(cache.info().capacity, CACHE_DEFAULTS.capacity);
		assert.equal(cache.info().maxAge, CACHE_DEFAULTS.maxAge);
		assert.equal(cache.info().cacheFlushInterval, CACHE_DEFAULTS.cacheFlushInterval);
		assert.equal(cache.info().deleteOnExpire, CACHE_DEFAULTS.deleteOnExpire);
		assert.equal(cache.info().onExpire, CACHE_DEFAULTS.onExpire);
		assert.equal(cache.info().recycleFreq, CACHE_DEFAULTS.recycleFreq);
		assert.equal(cache.info().storageMode, CACHE_DEFAULTS.storageMode);
		assert.equal(cache.info().storageImpl, CACHE_DEFAULTS.storageImpl);

		done();
	});
	it('should be able to create a cache with options.', function (done) {
		var options = {
			capacity: Math.floor((Math.random() * 100000) + 1),
			maxAge: Math.floor((Math.random() * 100000) + 1),
			cacheFlushInterval: Math.floor((Math.random() * 100000) + 1),
			deleteOnExpire: 'aggressive',
			storageMode: 'localStorage',
			localStorageImpl: {
				setItem: function () {
				},
				getItem: function () {
				},
				removeItem: function () {
				}
			},
			recycleFreq: 2000,
			onExpire: function () {
			},
			readOnGet: false
		};
		var cache = DSCacheFactory('DSCacheFactory.cache', options);
		assert.isDefined(cache);
		assert.equal(cache.info().id, 'DSCacheFactory.cache');
		assert.equal(cache.info().capacity, options.capacity);
		assert.equal(cache.info().maxAge, options.maxAge);
		assert.equal(cache.info().cacheFlushInterval, options.cacheFlushInterval);
		assert.equal(cache.info().deleteOnExpire, options.deleteOnExpire);
		assert.equal(cache.info().storageMode, options.storageMode);
		assert.isUndefined(cache.info().localStorageImpl); // We don't expose this to the user
		assert.equal(cache.info().onExpire, options.onExpire);
		done();
	});
	it('should throw an exception if "capacity" is not a number or is less than zero.', function (done) {
		var capacity = Math.floor((Math.random() * 100000) + 1) * -1;
		try {
			DSCacheFactory('capacityCache99', { capacity: capacity });
			fail();
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected capacity to be greater than zero! Found: ' + capacity + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + capacity);
		for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
			if (TYPES_EXCEPT_NUMBER[i] === null) {
				continue;
			}
			try {
				DSCacheFactory('capacityCache' + i, { capacity: TYPES_EXCEPT_NUMBER[i] });
				fail();
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected capacity to be a number! Found: ' + typeof TYPES_EXCEPT_NUMBER[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_NUMBER[i]);
				continue;
			}
			fail();
		}
		done();
	});
	it('should validate maxAge.', function (done) {
		var maxAge = Math.floor((Math.random() * 100000) + 1) * -1;
		try {
			DSCacheFactory('maxAgeCache99', { maxAge: maxAge });
			fail();
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected maxAge to be greater than zero! Found: ' + maxAge + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + maxAge);
		for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
			try {
				DSCacheFactory('maxAgeCache' + i, { maxAge: TYPES_EXCEPT_NUMBER[i] });
				if (TYPES_EXCEPT_NUMBER[i] !== null) {
					fail(TYPES_EXCEPT_NUMBER[i]);
				}
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected maxAge to be a number! Found: ' + typeof TYPES_EXCEPT_NUMBER[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_NUMBER[i]);
				continue;
			}
			if (TYPES_EXCEPT_NUMBER[i] !== null) {
				fail(TYPES_EXCEPT_NUMBER[i]);
			}
		}

		done();
	});
	it('should validate cacheFlushInterval.', function (done) {
		var cacheFlushInterval = Math.floor((Math.random() * 100000) + 1) * -1;
		try {
			DSCacheFactory('cacheFlushIntervalCache99', { cacheFlushInterval: cacheFlushInterval });
			fail();
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected cacheFlushInterval to be greater than zero! Found: ' + cacheFlushInterval + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + cacheFlushInterval);
		for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
			try {
				DSCacheFactory('cacheFlushIntervalCache' + i, { cacheFlushInterval: TYPES_EXCEPT_NUMBER[i] });
				if (TYPES_EXCEPT_NUMBER[i] !== null) {
					fail();
				}
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected cacheFlushInterval to be a number! Found: ' + typeof TYPES_EXCEPT_NUMBER[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_NUMBER[i]);
				continue;
			}
			if (TYPES_EXCEPT_NUMBER[i] !== null) {
				fail();
			}
		}

		done();
	});
	it('should validate recycleFreq.', function (done) {
		var recycleFreq = Math.floor((Math.random() * 100000) + 1) * -1;
		try {
			DSCacheFactory('recycleFreqCache99', { recycleFreq: recycleFreq });
			fail();
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected recycleFreq to be greater than zero! Found: ' + recycleFreq + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + recycleFreq);
		for (var i = 0; i < TYPES_EXCEPT_NUMBER.length; i++) {
			try {
				DSCacheFactory('recycleFreqCache' + i, { recycleFreq: TYPES_EXCEPT_NUMBER[i] });
				if (TYPES_EXCEPT_NUMBER[i] !== null) {
					fail();
				}
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected recycleFreq to be a number! Found: ' + typeof TYPES_EXCEPT_NUMBER[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_NUMBER[i]);
				continue;
			}
			if (TYPES_EXCEPT_NUMBER[i] !== null) {
				fail();
			}
		}

		done();
	});
	it('should validate onExpire.', function (done) {
		var onExpire = 234;
		try {
			DSCacheFactory('onExpireCache99', { onExpire: onExpire });
			assert.equal('should not reach this!', false);
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected onExpire to be a function! Found: ' + typeof onExpire + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof onExpire);
		for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
			try {
				if (TYPES_EXCEPT_FUNCTION[i]) {
					DSCacheFactory('onExpireCache' + i, { onExpire: TYPES_EXCEPT_FUNCTION[i] });
				} else {
					continue;
				}
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected onExpire to be a function! Found: ' + typeof TYPES_EXCEPT_FUNCTION[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_FUNCTION[i]);
				continue;
			}
			if (TYPES_EXCEPT_FUNCTION[i] !== null) {
				fail();
			}
		}

		done();
	});
	it('should validate deleteOnExpire.', function (done) {
		var deleteOnExpire = 'fail';
		try {
			DSCacheFactory('cache', { deleteOnExpire: deleteOnExpire });
			fail('should not reach this!');
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected deleteOnExpire to be "none", "passive" or "aggressive"! Found: ' + deleteOnExpire + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + deleteOnExpire);
		for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
			if (TYPES_EXCEPT_STRING[i] === null) {
				continue;
			}
			try {
				DSCacheFactory('deleteOnExpireCache' + i, { deleteOnExpire: TYPES_EXCEPT_STRING[i] });
				fail(TYPES_EXCEPT_STRING[i]);
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected deleteOnExpire to be a string! Found: ' + typeof TYPES_EXCEPT_STRING[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_STRING[i]);
				continue;
			}
			fail(TYPES_EXCEPT_STRING[i]);
		}

		done();
	});
	it('should validate storageMode.', function (done) {
		var storageMode = 'fail';
		try {
			DSCacheFactory('cache', { storageMode: storageMode });
			assert.equal('should not reach this!', false);
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected storageMode to be "memory", "localStorage" or "sessionStorage"! Found: ' + storageMode + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + storageMode);
		for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
			try {
				DSCacheFactory('storageModeCache' + i, { storageMode: TYPES_EXCEPT_STRING[i] });
				fail(TYPES_EXCEPT_STRING[i]);
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected storageMode to be a string! Found: ' + typeof TYPES_EXCEPT_STRING[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_STRING[i]);
				continue;
			}
			fail(TYPES_EXCEPT_STRING[i]);
		}

		done();
	});
	it('should validate storageImpl.', function (done) {
		var storageImpl = 'fail';
		try {
			DSCacheFactory('cache', { storageMode: 'localStorage', storageImpl: storageImpl });
			assert.equal('should not reach this!', false);
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[ng:areq] Expected storageImpl to be an object! Found: ' + typeof storageImpl + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof storageImpl);
		for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
			try {
				DSCacheFactory('storageImplCache' + i, { storageMode: 'localStorage', storageImpl: TYPES_EXCEPT_OBJECT[i] });
				if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
					fail(TYPES_EXCEPT_OBJECT[i]);
				}
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected storageImpl to be an object! Found: ' + typeof TYPES_EXCEPT_OBJECT[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_OBJECT[i]);
				continue;
			}
			if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
				fail(TYPES_EXCEPT_OBJECT[i]);
			}
		}
		try {
			storageImpl = {
				getItem: function () {
				},
				removeItem: function () {
				}
			};
			DSCacheFactory('storageImplCache-noSetItem', {
				storageMode: 'localStorage',
				storageImpl: storageImpl
			});
			fail();
		} catch (err) {
			assert.equal(err.message, '[ng:areq] Expected storageImpl to implement "setItem(key, value)"! Found: ' + typeof storageImpl.setItem + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof storageImpl.setItem);
		}
		try {
			storageImpl = {
				setItem: function () {
				},
				removeItem: function () {
				}
			};
			DSCacheFactory('storageImplCache-noGetItem', {
				storageMode: 'localStorage',
				storageImpl: storageImpl
			});
			fail();
		} catch (err) {
			assert.equal(err.message, '[ng:areq] Expected storageImpl to implement "getItem(key)"! Found: ' + typeof storageImpl.getItem + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof storageImpl.getItem);
		}
		try {
			storageImpl = {
				getItem: function () {
				},
				setItem: function () {
				}
			};
			DSCacheFactory('storageImplCache-noRemoveItem', {
				storageMode: 'localStorage',
				storageImpl: storageImpl
			});
			fail();
		} catch (err) {
			assert.equal(err.message, '[ng:areq] Expected storageImpl to implement "removeItem(key)"! Found: ' + typeof storageImpl.removeItem + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof storageImpl.removeItem);
		}

		done();
	});
	it('should prevent a cache from being duplicated.', function (done) {
		try {
			DSCacheFactory('cache');
			DSCacheFactory('cache');
		} catch (err) {
			var msg = err.message;
		}
		assert.equal(msg, '[$cacheFactory:iid] CacheId \'cache\' is already taken!\nhttp://errors.angularjs.org/' + angular.version.full + '/$cacheFactory/iid?p0=cache');

		done();
	});
	it('should require cacheId to be a string.', function (done) {
		for (var i = 0; i < TYPES_EXCEPT_STRING.length; i++) {
			try {
				DSCacheFactory(TYPES_EXCEPT_STRING[i]);
				fail(TYPES_EXCEPT_STRING[i]);
			} catch (err) {
				assert.equal(err.message, '[ng:areq] Expected cacheId to be a string! Found: ' + typeof TYPES_EXCEPT_STRING[i] + '.\nhttp://errors.angularjs.org/' + angular.version.full + '/ng/areq?p0=' + typeof TYPES_EXCEPT_STRING[i]);
				continue;
			}
			fail(TYPES_EXCEPT_STRING[i]);
		}

		done();
	});
});
