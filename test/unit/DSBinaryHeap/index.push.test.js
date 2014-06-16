describe('DSBinaryHeap.push(node)', function () {
  it('should push items to the front of the DSBinaryHeap.', function () {
    var heap = new TestDSBinaryHeap();
    var objHeap = new TestDSBinaryHeap(function (x) {
      return x.value;
    });
    var items = [20, 4, 33, 1, 0, 34, 22, 31, 32, 5, 6, 7],
      objItems = [];
    for (var i = 0; i < items.length; i++) {
      objItems.push({
        value: items[i]
      });
    }

    heap.push(items[0]);
    objHeap.push(objItems[0]);
    assert.deepEqual(heap.size(), 1);
    assert.deepEqual(objHeap.size(), 1);
    assert.deepEqual(heap.peek(), items[0]);
    assert.deepEqual(objHeap.peek(), objItems[0]);

    heap.push(items[1]);
    objHeap.push(objItems[1]);
    assert.deepEqual(heap.size(), 2);
    assert.deepEqual(objHeap.size(), 2);
    assert.deepEqual(heap.peek(), items[1]);
    assert.deepEqual(objHeap.peek(), objItems[1]);

    heap.push(items[2]);
    objHeap.push(objItems[2]);
    assert.deepEqual(heap.size(), 3);
    assert.deepEqual(objHeap.size(), 3);
    assert.deepEqual(heap.peek(), items[1]);
    assert.deepEqual(objHeap.peek(), objItems[1]);

    heap.push(items[3]);
    objHeap.push(objItems[3]);
    assert.deepEqual(heap.size(), 4);
    assert.deepEqual(objHeap.size(), 4);
    assert.deepEqual(heap.peek(), items[3]);
    assert.deepEqual(objHeap.peek(), objItems[3]);

    heap.push(items[4]);
    objHeap.push(objItems[4]);
    assert.deepEqual(heap.size(), 5);
    assert.deepEqual(objHeap.size(), 5);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[5]);
    objHeap.push(objItems[5]);
    assert.deepEqual(heap.size(), 6);
    assert.deepEqual(objHeap.size(), 6);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[6]);
    objHeap.push(objItems[6]);
    assert.deepEqual(heap.size(), 7);
    assert.deepEqual(objHeap.size(), 7);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[7]);
    objHeap.push(objItems[7]);
    assert.deepEqual(heap.size(), 8);
    assert.deepEqual(objHeap.size(), 8);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[8]);
    objHeap.push(objItems[8]);
    assert.deepEqual(heap.size(), 9);
    assert.deepEqual(objHeap.size(), 9);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[9]);
    objHeap.push(objItems[9]);
    assert.deepEqual(heap.size(), 10);
    assert.deepEqual(objHeap.size(), 10);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[10]);
    objHeap.push(objItems[10]);
    assert.deepEqual(heap.size(), 11);
    assert.deepEqual(objHeap.size(), 11);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[11]);
    objHeap.push(objItems[11]);
    assert.deepEqual(heap.size(), 12);
    assert.deepEqual(objHeap.size(), 12);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);
  });
});
