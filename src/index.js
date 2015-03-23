import angular from 'angular';
import BinaryHeap from 'yabh';

let _keys = collection => {
  let keys = [], key;
  for (key in collection) {
    if (collection.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys;
};

let _isPromiseLike = v => {
  return v && typeof v.then === 'function';
};

let _stringifyNumber = number => {
  if (angular.isNumber(number)) {
    return number.toString();
  }
  return number;
};

let _keySet = collection => {
  var keySet = {}, key;
  for (key in collection) {
    if (collection.hasOwnProperty(key)) {
      keySet[key] = key;
    }
  }
  return keySet;
};

class BinaryHeapProvider {
  constructor() {
    this.$get = () => BinaryHeap;
  }
}

class CacheFactoryProvider {
  constructor() {
    var defaults = this.defaults = {
      capacity: Number.MAX_VALUE,
      maxAge: Number.MAX_VALUE,
      deleteOnExpire: 'none',
      onExpire: null,
      cacheFlushInterval: null,
      recycleFreq: 1000,
      storageMode: 'memory',
      storageImpl: null,
      disabled: false,
      storagePrefix: 'angular-cache.caches.',
      storeOnResolve: false,
      storeOnReject: false
    };

    this.$get = ['$q', $q => {
      let caches = {};

      let createCache = (cacheId, options) => {
        if (cacheId in caches) {
          throw new Error(`${cacheId} already exists!`);
        } else if (!angular.isString(cacheId)) {
          throw new Error('cacheId must be a string!');
        }

        let cache = caches[cacheId] = {

          $$id: cacheId,
          $$data: {},
          $$promises: {},
          $$storage: null,
          $$expiresHeap: new BinaryHeap(x => x.expires, angular.equals),
          $$lruHeap: new BinaryHeap(x => x.accessed, angular.equals),

          destroy() {
            clearInterval(this.$$cacheFlushIntervalId);
            clearInterval(this.$$recycleFreqId);
            this.removeAll();
            if (this.$$storage) {
              this.$$storage().removeItem(`${this.$$prefix}.keys`);
              this.$$storage().removeItem(this.$$prefix);
            }
            this.$$storage = null;
            this.$$data = null;
            this.$$lruHeap = null;
            this.$$expiresHeap = null;
            this.$$prefix = null;
            delete caches[this.$$id];
          },

          disable() {
            this.$$disabled = true;
          },

          enable() {
            delete this.$$disabled;
          },

          get(key, options) {
            if (angular.isArray(key)) {
              let keys = key;
              let values = [];

              angular.forEach(keys, key => {
                let value = this.get(key, options);
                if (value !== null && value !== undefined) {
                  values.push(value);
                }
              });

              return values;
            } else {
              key = _stringifyNumber(key);

              if (this.$$disabled) {
                return;
              }
            }

            options = options || {};
            if (!angular.isString(key)) {
              throw new Error('key must be a string!');
            } else if (options && !angular.isObject(options)) {
              throw new Error('options must be an object!');
            } else if (options.onExpire && !angular.isFunction(options.onExpire)) {
              throw new Error('options.onExpire must be a function!');
            }

            let item;

            if (this.$$storage) {
              if (this.$$promises[key]) {
                return this.$$promises[key];
              }

              let itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

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

            let value = item.value;
            let now = new Date().getTime();

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
                this.$$onExpire.call(this, key, item.value, options.onExpire);
              } else if (options.onExpire) {
                options.onExpire.call(this, key, item.value);
              }
              value = undefined;
            } else if (this.$$storage) {
              this.$$storage().setItem(`${this.$$prefix}.data.${key}`, JSON.stringify(item));
            }

            return value;
          },

          info(key) {
            if (key) {
              let item;
              if (this.$$storage) {
                var itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

                if (itemJson) {
                  item = angular.fromJson(itemJson);
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
                if (key in this.$$data) {
                  item = this.$$data[key];

                  return {
                    created: item.created,
                    accessed: item.accessed,
                    expires: item.expires,
                    isExpired: (new Date().getTime() - item.created) > this.$$maxAge
                  };
                } else {
                  return undefined;
                }
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
                storageImpl: this.$$storage ? this.$$storage() : undefined,
                disabled: !!this.$$disabled,
                size: this.$$lruHeap && this.$$lruHeap.size() || 0
              };
            }
          },

          keys() {
            if (this.$$storage) {
              let keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);

              if (keysJson) {
                return angular.fromJson(keysJson);
              } else {
                return [];
              }
            } else {
              return _keys(this.$$data);
            }
          },

          keySet() {
            if (this.$$storage) {
              let keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);
              let kSet = {};

              if (keysJson) {
                var keys = angular.fromJson(keysJson);

                for (var i = 0; i < keys.length; i++) {
                  kSet[keys[i]] = keys[i];
                }
              }
              return kSet;
            } else {
              return _keySet(this.$$data);
            }
          },

          put(key, value, options) {
            options = options || {};

            let storeOnResolve = 'storeOnResolve' in options ? !!options.storeOnResolve : this.$$storeOnResolve;
            let storeOnReject = 'storeOnReject' in options ? !!options.storeOnReject : this.$$storeOnReject;

            let getHandler = (store, isError) => {
              return v => {
                if (store) {
                  delete this.$$promises[key];
                  if (angular.isObject(v) && 'status' in v && 'data' in v) {
                    v = [v.status, v.data, v.headers(), v.statusText];
                    this.put(key, v);
                  } else {
                    this.put(key, v);
                  }
                }
                if (isError) {
                  return $q.reject(v);
                } else {
                  return v;
                }
              };
            };

            if (this.$$disabled || value === null || value === undefined) {
              return;
            }
            key = _stringifyNumber(key);

            if (!angular.isString(key)) {
              throw new Error('key must be a string!');
            }

            var now = new Date().getTime();
            var item = {
              key: key,
              value: _isPromiseLike(value) ? value.then(getHandler(storeOnResolve, false), getHandler(storeOnReject, true)) : value,
              created: now,
              accessed: now
            };

            item.expires = item.created + this.$$maxAge;

            if (this.$$storage) {
              if (_isPromiseLike(item.value)) {
                this.$$promises[key] = item.value;
                return this.$$promises[key];
              }
              var keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);
              var keys = keysJson ? angular.fromJson(keysJson) : [];
              var itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

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
              this.$$storage().setItem(`${this.$$prefix}.data.${key}`, JSON.stringify(item));
              var exists = false;
              for (var i = 0; i < keys.length; i++) {
                if (keys[i] === key) {
                  exists = true;
                  break;
                }
              }
              if (!exists) {
                keys.push(key);
              }
              this.$$storage().setItem(`${this.$$prefix}.keys`, JSON.stringify(keys));
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
              delete this.$$promises[key];
            }

            // Handle exceeded capacity
            if (this.$$lruHeap.size() > this.$$capacity) {
              this.remove(this.$$lruHeap.peek().key);
            }

            return value;
          },

          remove(key) {
            key += '';
            delete this.$$promises[key];
            if (this.$$storage) {
              let itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

              if (itemJson) {
                let item = angular.fromJson(itemJson);
                this.$$lruHeap.remove({
                  key: key,
                  accessed: item.accessed
                });
                this.$$expiresHeap.remove({
                  key: key,
                  expires: item.expires
                });
                this.$$storage().removeItem(`${this.$$prefix}.data.${key}`);
                let keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);
                let keys = keysJson ? angular.fromJson(keysJson) : [];
                let index = keys.indexOf(key);

                if (index >= 0) {
                  keys.splice(index, 1);
                }
                this.$$storage().setItem(`${this.$$prefix}.keys`, JSON.stringify(keys));
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
          },

          removeAll() {
            if (this.$$storage) {
              this.$$lruHeap.removeAll();
              this.$$expiresHeap.removeAll();
              let keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);

              if (keysJson) {
                let keys = angular.fromJson(keysJson);

                for (var i = 0; i < keys.length; i++) {
                  this.remove(keys[i]);
                }
              }
              this.$$storage().setItem(`${this.$$prefix}.keys`, JSON.stringify([]));
            } else {
              this.$$lruHeap.removeAll();
              this.$$expiresHeap.removeAll();
              for (var key in this.$$data) {
                this.$$data[key] = null;
              }
              this.$$data = {};
            }
          },

          removeExpired() {
            let now = new Date().getTime();
            let expired = {};
            let key;
            let expiredItem;

            while ((expiredItem = this.$$expiresHeap.peek()) && expiredItem.expires <= now) {
              expired[expiredItem.key] = expiredItem.value ? expiredItem.value : null;
              this.$$expiresHeap.pop();
            }

            if (this.$$storage) {
              for (key in expired) {
                var itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);
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
                this.$$onExpire.call(this, key, expired[key]);
              }
            }

            return expired;
          },

          setCacheFlushInterval(cacheFlushInterval) {
            if (cacheFlushInterval === null) {
              delete this.$$cacheFlushInterval;
            } else if (!angular.isNumber(cacheFlushInterval)) {
              throw new Error('cacheFlushInterval must be a number!');
            } else if (cacheFlushInterval < 0) {
              throw new Error('cacheFlushInterval must be greater than zero!');
            } else if (cacheFlushInterval !== this.$$cacheFlushInterval) {
              this.$$cacheFlushInterval = cacheFlushInterval;
              clearInterval(this.$$cacheFlushIntervalId);
              (function (self) {
                self.$$cacheFlushIntervalId = setInterval(function () {
                  self.removeAll();
                }, self.$$cacheFlushInterval);
              })(this);
            }
          },

          setCapacity(capacity) {
            if (capacity === null) {
              delete this.$$capacity;
            } else if (!angular.isNumber(capacity)) {
              throw new Error('capacity must be a number!');
            } else if (capacity < 0) {
              throw new Error('capacity must be greater than zero!');
            } else {
              this.$$capacity = capacity;
            }
            var removed = {};
            while (this.$$lruHeap.size() > this.$$capacity) {
              removed[this.$$lruHeap.peek().key] = this.remove(this.$$lruHeap.peek().key);
            }
            return removed;
          },

          setDeleteOnExpire(deleteOnExpire, setRecycleFreq) {
            if (deleteOnExpire === null) {
              delete this.$$deleteOnExpire;
            } else if (!angular.isString(deleteOnExpire)) {
              throw new Error('deleteOnExpire must be a string!');
            } else if (deleteOnExpire !== 'none' && deleteOnExpire !== 'passive' && deleteOnExpire !== 'aggressive') {
              throw new Error('deleteOnExpire must be "none", "passive" or "aggressive"!');
            } else {
              this.$$deleteOnExpire = deleteOnExpire;
            }
            if (setRecycleFreq !== false) {
              this.setRecycleFreq(this.$$recycleFreq);
            }
          },

          setMaxAge(maxAge) {
            if (maxAge === null) {
              this.$$maxAge = Number.MAX_VALUE;
            } else if (!angular.isNumber(maxAge)) {
              throw new Error('maxAge must be a number!');
            } else if (maxAge < 0) {
              throw new Error('maxAge must be greater than zero!');
            } else {
              this.$$maxAge = maxAge;
            }
            let i, keys, key;

            this.$$expiresHeap.removeAll();

            if (this.$$storage) {
              let keysJson = this.$$storage().getItem(`${this.$$prefix}.keys`);

              keys = keysJson ? angular.fromJson(keysJson) : [];

              for (i = 0; i < keys.length; i++) {
                key = keys[i];
                let itemJson = this.$$storage().getItem(`${this.$$prefix}.data.${key}`);

                if (itemJson) {
                  let item = angular.fromJson(itemJson);
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
              keys = _keys(this.$$data);

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
          },

          setOnExpire(onExpire) {
            if (onExpire === null) {
              delete this.$$onExpire;
            } else if (!angular.isFunction(onExpire)) {
              throw new Error('onExpire must be a function!');
            } else {
              this.$$onExpire = onExpire;
            }
          },

          setOptions(cacheOptions, strict) {
            cacheOptions = cacheOptions || {};
            strict = !!strict;
            if (!angular.isObject(cacheOptions)) {
              throw new Error('cacheOptions must be an object!');
            }

            if ('storagePrefix' in cacheOptions) {
              this.$$storagePrefix = cacheOptions.storagePrefix;
            } else if (strict) {
              this.$$storagePrefix = defaults.storagePrefix;
            }

            this.$$prefix = this.$$storagePrefix + this.$$id;

            if ('disabled' in cacheOptions) {
              this.$$disabled = !!cacheOptions.disabled;
            } else if (strict) {
              this.$$disabled = defaults.disabled;
            }

            if ('storageMode' in cacheOptions || 'storageImpl' in cacheOptions) {
              this.setStorageMode(cacheOptions.storageMode, cacheOptions.storageImpl);
            } else if (strict) {
              this.setStorageMode(defaults.storageMode, defaults.storageImpl);
            }

            if ('storeOnResolve' in cacheOptions) {
              this.$$storeOnResolve = !!cacheOptions.storeOnResolve;
            } else if (strict) {
              this.$$storeOnResolve = defaults.storeOnResolve;
            }

            if ('storeOnReject' in cacheOptions) {
              this.$$storeOnReject = !!cacheOptions.storeOnReject;
            } else if (strict) {
              this.$$storeOnReject = defaults.storeOnReject;
            }

            if ('capacity' in cacheOptions) {
              this.setCapacity(cacheOptions.capacity);
            } else if (strict) {
              this.setCapacity(defaults.capacity);
            }

            if ('deleteOnExpire' in cacheOptions) {
              this.setDeleteOnExpire(cacheOptions.deleteOnExpire, false);
            } else if (strict) {
              this.setDeleteOnExpire(defaults.deleteOnExpire, false);
            }

            if ('maxAge' in cacheOptions) {
              this.setMaxAge(cacheOptions.maxAge);
            } else if (strict) {
              this.setMaxAge(defaults.maxAge);
            }

            if ('recycleFreq' in cacheOptions) {
              this.setRecycleFreq(cacheOptions.recycleFreq);
            } else if (strict) {
              this.setRecycleFreq(defaults.recycleFreq);
            }

            if ('cacheFlushInterval' in cacheOptions) {
              this.setCacheFlushInterval(cacheOptions.cacheFlushInterval);
            } else if (strict) {
              this.setCacheFlushInterval(defaults.cacheFlushInterval);
            }

            if ('onExpire' in cacheOptions) {
              this.setOnExpire(cacheOptions.onExpire);
            } else if (strict) {
              this.setOnExpire(defaults.onExpire);
            }
          },

          setRecycleFreq(recycleFreq) {
            if (recycleFreq === null) {
              delete this.$$recycleFreq;
            } else if (!angular.isNumber(recycleFreq)) {
              throw new Error('recycleFreq must be a number!');
            } else if (recycleFreq < 0) {
              throw new Error('recycleFreq must be greater than zero!');
            } else {
              this.$$recycleFreq = recycleFreq;
            }
            clearInterval(this.$$recycleFreqId);
            if (this.$$deleteOnExpire === 'aggressive') {
              (function (self) {
                self.$$recycleFreqId = setInterval(function () {
                  self.removeExpired();
                }, self.$$recycleFreq);
              })(this);
            } else {
              delete this.$$recycleFreqId;
            }
          },

          setStorageMode(storageMode, storageImpl) {
            if (!angular.isString(storageMode)) {
              throw new Error('storageMode must be a string!');
            } else if (storageMode !== 'memory' && storageMode !== 'localStorage' && storageMode !== 'sessionStorage') {
              throw new Error('storageMode must be "memory", "localStorage" or "sessionStorage"!');
            }

            let shouldReInsert = false;
            let items = {};

            if (typeof this.$$storageMode === 'string' && this.$$storageMode !== storageMode) {
              let keys = this.keys();

              if (keys.length) {
                for (var i = 0; i < keys.length; i++) {
                  items[keys[i]] = this.get(keys[i]);
                }
                for (i = 0; i < keys.length; i++) {
                  this.remove(keys[i]);
                }
                shouldReInsert = true;
              }
            }

            this.$$storageMode = storageMode;

            if (storageImpl) {
              if (!angular.isObject(storageImpl)) {
                throw new Error('storageImpl must be an object!');
              } else if (!('setItem' in storageImpl) || typeof storageImpl.setItem !== 'function') {
                throw new Error('storageImpl must implement "setItem(key, value)"!');
              } else if (!('getItem' in storageImpl) || typeof storageImpl.getItem !== 'function') {
                throw new Error('storageImpl must implement "getItem(key)"!');
              } else if (!('removeItem' in storageImpl) || typeof storageImpl.removeItem !== 'function') {
                throw new Error('storageImpl must implement "removeItem(key)"!');
              }
              this.$$storage = () => storageImpl;
            } else if (this.$$storageMode === 'localStorage') {
              try {
                localStorage.setItem('angular-cache', 'angular-cache');
                localStorage.removeItem('angular-cache');
                this.$$storage = () => localStorage;
              } catch (e) {
                delete this.$$storage;
                this.$$storageMode = 'memory';
              }
            } else if (this.$$storageMode === 'sessionStorage') {
              try {
                sessionStorage.setItem('angular-cache', 'angular-cache');
                sessionStorage.removeItem('angular-cache');
                this.$$storage = () => sessionStorage;
              } catch (e) {
                delete this.$$storage;
                this.$$storageMode = 'memory';
              }
            }

            if (shouldReInsert) {
              for (var key in items) {
                this.put(key, items[key]);
              }
            }
          },

          touch(key) {
            if (key) {
              let val = this.get(key, {
                onExpire: (k, v) => this.put(k, v)
              });
              if (val) {
                this.put(key, val);
              }
            } else {
              let keys = this.keys();
              for (var i = 0; i < keys.length; i++) {
                this.touch(keys[i]);
              }
            }
          }
        };

        cache.setOptions(options, true);

        return cache;
      };

      function CacheFactory(cacheId, options) {
        return createCache(cacheId, options);
      }

      CacheFactory.createCache = createCache;

      CacheFactory.info = () => {
        let keys = _keys(caches);
        let info = {
          size: keys.length,
          caches: {}
        };
        angular.extend(info, this.defaults);
        for (var i = 0; i < keys.length; i++) {
          let key = keys[i];
          info.caches[key] = caches[key].info();
        }
        return info;
      };

      CacheFactory.get = cacheId => {
        return caches[cacheId];
      };

      CacheFactory.keySet = () => {
        return _keySet(caches);
      };

      CacheFactory.keys = () => _keys(caches);

      CacheFactory.destroy = cacheId => {
        if (caches[cacheId]) {
          caches[cacheId].destroy();
          delete caches[cacheId];
        }
      };

      CacheFactory.destroyAll = () => {
        for (var cacheId in caches) {
          caches[cacheId].destroy();
        }
        caches = {};
      };

      CacheFactory.clearAll = () => {
        for (var cacheId in caches) {
          caches[cacheId].removeAll();
        }
      };

      CacheFactory.removeExpiredFromAll = () => {
        let expired = {};
        for (var cacheId in caches) {
          expired[cacheId] = caches[cacheId].removeExpired();
        }
        return expired;
      };

      CacheFactory.enableAll = () => {
        for (var cacheId in caches) {
          caches[cacheId].$$disabled = false;
        }
      };

      CacheFactory.disableAll = () => {
        for (var cacheId in caches) {
          caches[cacheId].$$disabled = true;
        }
      };

      CacheFactory.touchAll = () => {
        for (var cacheId in caches) {
          caches[cacheId].touch();
        }
      };

      return CacheFactory;
    }];
  }
}

angular.module('angular-cache', [])
  .provider('BinaryHeap', BinaryHeapProvider)
  .provider('CacheFactory', CacheFactoryProvider);

export default 'angular-cache';
