describe('DSBinaryHeap.pop()', function () {
  it('should pop the item off of the front of the DSBinaryHeap.', function () {
    var heap = new TestDSBinaryHeap();
    var objHeap = new TestDSBinaryHeap(function (x) {
      return x.value;
    });
    var items = [20, 4, 33, 1, 0, 34, 22, 31, 32, 5, 6, 7];
    for (var i = 0; i < items.length; i++) {
      heap.push(items[i]);
      objHeap.push({
        value: items[i]
      });
    }

    assert.deepEqual(heap.size(), 12);
    assert.deepEqual(objHeap.size(), 12);

    assert.deepEqual(heap.pop(), 0);
    assert.deepEqual(objHeap.pop(), { value: 0 });
    assert.deepEqual(heap.size(), 11);
    assert.deepEqual(objHeap.size(), 11);

    assert.deepEqual(heap.pop(), 1);
    assert.deepEqual(objHeap.pop(), { value: 1 });
    assert.deepEqual(heap.size(), 10);
    assert.deepEqual(objHeap.size(), 10);

    assert.deepEqual(heap.pop(), 4);
    assert.deepEqual(objHeap.pop(), { value: 4 });
    assert.deepEqual(heap.size(), 9);
    assert.deepEqual(objHeap.size(), 9);

    assert.deepEqual(heap.pop(), 5);
    assert.deepEqual(objHeap.pop(), { value: 5 });
    assert.deepEqual(heap.size(), 8);
    assert.deepEqual(objHeap.size(), 8);

    assert.deepEqual(heap.pop(), 6);
    assert.deepEqual(objHeap.pop(), { value: 6 });
    assert.deepEqual(heap.size(), 7);
    assert.deepEqual(objHeap.size(), 7);

    assert.deepEqual(heap.pop(), 7);
    assert.deepEqual(objHeap.pop(), { value: 7 });
    assert.deepEqual(heap.size(), 6);
    assert.deepEqual(objHeap.size(), 6);

    assert.deepEqual(heap.pop(), 20);
    assert.deepEqual(objHeap.pop(), { value: 20 });
    assert.deepEqual(heap.size(), 5);
    assert.deepEqual(objHeap.size(), 5);

    assert.deepEqual(heap.pop(), 22);
    assert.deepEqual(objHeap.pop(), { value: 22 });
    assert.deepEqual(heap.size(), 4);
    assert.deepEqual(objHeap.size(), 4);

    assert.deepEqual(heap.pop(), 31);
    assert.deepEqual(objHeap.pop(), { value: 31 });
    assert.deepEqual(heap.size(), 3);
    assert.deepEqual(objHeap.size(), 3);

    assert.deepEqual(heap.pop(), 32);
    assert.deepEqual(objHeap.pop(), { value: 32 });
    assert.deepEqual(heap.size(), 2);
    assert.deepEqual(objHeap.size(), 2);

    assert.deepEqual(heap.pop(), 33);
    assert.deepEqual(objHeap.pop(), { value: 33 });
    assert.deepEqual(heap.size(), 1);
    assert.deepEqual(objHeap.size(), 1);

    assert.deepEqual(heap.pop(), 34);
    assert.deepEqual(objHeap.pop(), { value: 34 });
    assert.deepEqual(heap.size(), 0);
    assert.deepEqual(objHeap.size(), 0);
  });
});
