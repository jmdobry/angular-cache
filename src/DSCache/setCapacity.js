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
