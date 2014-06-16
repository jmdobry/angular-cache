describe('DSBinaryHeap.removeAll()', function () {
  it('should remove all items from the heap.', function () {
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

    heap.removeAll();
    objHeap.removeAll();

    assert.deepEqual(heap.size(), 0);
    assert.deepEqual(objHeap.size(), 0);

    assert.isUndefined(heap.peek());
    assert.isUndefined(objHeap.peek());
  });
});
