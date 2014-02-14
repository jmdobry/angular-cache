describe('AngularCache.get(key)', function () {
	it('should do nothing if the cache is disabled.', function () {
		var cache = $angularCacheFactory('cache');

		expect(cache.info().size).toEqual(0);
		cache.put('1', 'item');
		expect(cache.get('1')).toEqual('item');
		expect(cache.info().size).toEqual(1);
		cache.setOptions({ disabled: true });
		expect(cache.info().size).toEqual(1);
		expect(cache.get('1')).toBeUndefined();
	});
	it('should throw an error if "key" is not a string or array.', function () {
		var cache = $angularCacheFactory('cache');
		for (var i = 0; i < TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER.length; i++) {
			try {
				cache.get(TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
				fail(TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
			} catch (err) {
				expect(err.message).toEqual('AngularCache.get(key, options): key: must be a string!');
				continue;
			}
			fail(TYPES_EXCEPT_STRING_OR_ARRAY_OR_NUMBER[i]);
		}
	});
	it('should throw an error if "options" is not an object.', function () {
		var cache = $angularCacheFactory('cache');
		for (var i = 0; i < TYPES_EXCEPT_OBJECT.length; i++) {
			try {
				cache.get('item', TYPES_EXCEPT_OBJECT[i]);
				if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
					fail(TYPES_EXCEPT_OBJECT[i]);
				}
			} catch (err) {
				expect(err.message).toEqual('AngularCache.get(key, options): options: must be an object!');
				continue;
			}
			if (TYPES_EXCEPT_OBJECT[i] !== null && TYPES_EXCEPT_OBJECT[i] !== undefined && TYPES_EXCEPT_OBJECT[i] !== false) {
				fail(TYPES_EXCEPT_OBJECT[i]);
			}
		}
	});
	it('should throw an error if "onExpire" is not a function.', function () {
		var cache = $angularCacheFactory('cache');
		for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
			try {
				cache.get('item', { onExpire: TYPES_EXCEPT_FUNCTION[i] });
				if (TYPES_EXCEPT_FUNCTION[i] !== null && TYPES_EXCEPT_FUNCTION[i] !== undefined && TYPES_EXCEPT_FUNCTION[i] !== false) {
					fail(TYPES_EXCEPT_FUNCTION[i]);
				}
			} catch (err) {
				expect(err.message).toEqual('AngularCache.get(key, options): onExpire: must be a function!');
				continue;
			}
			if (TYPES_EXCEPT_FUNCTION[i] !== null && TYPES_EXCEPT_FUNCTION[i] !== undefined && TYPES_EXCEPT_FUNCTION[i] !== false) {
				fail(TYPES_EXCEPT_FUNCTION[i]);
			}
		}
	});
	it('should return the correct value for the specified key.', function () {
		var cache = $angularCacheFactory('cache');
		var value1 = 'value1',
			value2 = 2,
			value3 = {
				value3: 'stuff'
			};
		cache.put('item1', value1);
		cache.put('item2', value2);
		cache.put('item3', value3);
		expect(cache.get('item1')).toEqual(value1);
		expect(cache.get('item2')).toEqual(value2);
		expect(cache.get('item3')).toEqual(value3);
	});
	it('should return undefined if the key isn\'t in the cache.', function () {
		var cache = $angularCacheFactory('cache');
		expect(cache.get('item')).toEqual(undefined);
	});
	it('should execute globally configured "onExpire" callback if the item is expired in passive mode and global "onExpire" callback is configured.', function () {
		var cache = $angularCacheFactory('cache', {
			maxAge: 10,
			recycleFreq: 20,
			deleteOnExpire: 'passive',
			onExpire: function (key, value, done) {
				done(key, value, 'executed global callback');
			}
		});
		cache.put('item', 'value');
		waits(100);
		runs(function () {
			cache.get('item', { onExpire: function (key, value, test) {
				expect(key).toEqual('item');
				expect(value).toEqual('value');
				expect(test).toEqual('executed global callback');
			}});
		});
	});
	it('should execute globally configured "onExpire" callback when an item is aggressively deleted and global "onExpire" callback is configured.', function () {
		var onExpire = jasmine.createSpy();
		var cache = $angularCacheFactory('cache', {
			maxAge: 10,
			recycleFreq: 20,
			deleteOnExpire: 'aggressive',
			onExpire: onExpire
		});
		cache.put('item', 'value');
		waits(100);
		runs(function () {
			expect(onExpire).toHaveBeenCalled();
			expect(onExpire).toHaveBeenCalledWith('item', 'value');
		});
	});
	it('should execute local "onExpire" callback if the item is expired in passive mode and global "onExpire" callback is NOT configured.', function () {
		var cache = $angularCacheFactory('cache', {
			maxAge: 10,
			deleteOnExpire: 'passive',
			recycleFreq: 20
		});
		cache.put('item', 'value');
		waits(100);
		runs(function () {
			cache.get('item', { onExpire: function (key, value) {
				expect(key).toEqual('item');
				expect(value).toEqual('value');
			}});
		});
	});
	it('should return the correct values for multiple keys.', function () {
		var cache = $angularCacheFactory('cache');
		var value1 = 'value1',
			value2 = 2,
			value3 = {
				value3: 'stuff'
			};
		cache.put('item1', value1);
		cache.put('item2', value2);
		cache.put('item3', value3);
		expect(cache.get(['item1', 'item2', 'item3'])).toEqual([value1, value2, value3]);
	});
	it('should not return undefined values for multiple keys.', function () {
		var cache = $angularCacheFactory('cache');
		var value1 = 'value1',
			value2 = 2;
		cache.put('item1', value1);
		cache.put('item2', value2);
		expect(cache.get(['item1', 'item2', 'item3'])).toEqual([value1, value2]);
	});

	/* See: https://github.com/jmdobry/angular-cache/blob/master/src/angular-cache.js#L1062	*/
	xit('should keep sync with other caches which has same name.', function () {
		var options = {
			storageMode: 'localStorage'
		};

		var cache1 = $angularCacheFactory('cache', options),
			cache2 = $angularCacheFactory('cache', options),
			valueSync = 'valueSync';

		$angularCacheFactory.clearAll();

		cache1.put('itemSync', valueSync);
		expect(cache2.get('itemSync').toEqual(valueSync));
	});
});
