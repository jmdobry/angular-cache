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

/**
 * @desc Provider for the DSBinaryHeap.
 */
function DSBinaryHeapProvider() {
  this.$get = function () {
    return DSBinaryHeap;
  };
}

module.exports = {
  DSBinaryHeapProvider: DSBinaryHeapProvider,
  DSBinaryHeap: DSBinaryHeap
};
