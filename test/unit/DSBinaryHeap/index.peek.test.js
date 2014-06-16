describe('DSBinaryHeap.peek()', function () {
  it('should show the item at the front of the DSBinaryHeap.', function () {
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

    assert.isUndefined(heap.peek());
    assert.isUndefined(objHeap.peek());

    heap.push(items[0]);
    objHeap.push(objItems[0]);
    assert.deepEqual(heap.peek(), items[0]);
    assert.deepEqual(objHeap.peek(), objItems[0]);

    heap.push(items[1]);
    objHeap.push(objItems[1]);
    assert.deepEqual(heap.peek(), items[1]);
    assert.deepEqual(objHeap.peek(), objItems[1]);

    heap.push(items[2]);
    objHeap.push(objItems[2]);
    assert.deepEqual(heap.peek(), items[1]);
    assert.deepEqual(objHeap.peek(), objItems[1]);

    heap.push(items[3]);
    objHeap.push(objItems[3]);
    assert.deepEqual(heap.peek(), items[3]);
    assert.deepEqual(objHeap.peek(), objItems[3]);

    heap.push(items[4]);
    objHeap.push(objItems[4]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[5]);
    objHeap.push(objItems[5]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[6]);
    objHeap.push(objItems[6]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[7]);
    objHeap.push(objItems[7]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[8]);
    objHeap.push(objItems[8]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[9]);
    objHeap.push(objItems[9]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[10]);
    objHeap.push(objItems[10]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    heap.push(items[11]);
    objHeap.push(objItems[11]);
    assert.deepEqual(heap.peek(), items[4]);
    assert.deepEqual(objHeap.peek(), objItems[4]);

    assert.deepEqual(heap.pop(), 0);
    assert.deepEqual(objHeap.pop(), { value: 0 });
    assert.deepEqual(heap.peek(), 1);
    assert.deepEqual(objHeap.peek(), { value: 1 });

    assert.deepEqual(heap.pop(), 1);
    assert.deepEqual(objHeap.pop(), { value: 1 });
    assert.deepEqual(heap.peek(), 4);
    assert.deepEqual(objHeap.peek(), { value: 4 });

    assert.deepEqual(heap.pop(), 4);
    assert.deepEqual(objHeap.pop(), { value: 4 });
    assert.deepEqual(heap.peek(), 5);
    assert.deepEqual(objHeap.peek(), { value: 5 });

    assert.deepEqual(heap.pop(), 5);
    assert.deepEqual(objHeap.pop(), { value: 5 });
    assert.deepEqual(heap.peek(), 6);
    assert.deepEqual(objHeap.peek(), { value: 6 });

    assert.deepEqual(heap.pop(), 6);
    assert.deepEqual(objHeap.pop(), { value: 6 });
    assert.deepEqual(heap.peek(), 7);
    assert.deepEqual(objHeap.peek(), { value: 7 });

    assert.deepEqual(heap.pop(), 7);
    assert.deepEqual(objHeap.pop(), { value: 7 });
    assert.deepEqual(heap.peek(), 20);
    assert.deepEqual(objHeap.peek(), { value: 20 });

    assert.deepEqual(heap.pop(), 20);
    assert.deepEqual(objHeap.pop(), { value: 20 });
    assert.deepEqual(heap.peek(), 22);
    assert.deepEqual(objHeap.peek(), { value: 22 });

    assert.deepEqual(heap.pop(), 22);
    assert.deepEqual(objHeap.pop(), { value: 22 });
    assert.deepEqual(heap.peek(), 31);
    assert.deepEqual(objHeap.peek(), { value: 31 });

    assert.deepEqual(heap.pop(), 31);
    assert.deepEqual(objHeap.pop(), { value: 31 });
    assert.deepEqual(heap.peek(), 32);
    assert.deepEqual(objHeap.peek(), { value: 32 });

    assert.deepEqual(heap.pop(), 32);
    assert.deepEqual(objHeap.pop(), { value: 32 });
    assert.deepEqual(heap.peek(), 33);
    assert.deepEqual(objHeap.peek(), { value: 33 });

    assert.deepEqual(heap.pop(), 33);
    assert.deepEqual(objHeap.pop(), { value: 33 });
    assert.deepEqual(heap.peek(), 34);
    assert.deepEqual(objHeap.peek(), { value: 34 });

    assert.deepEqual(heap.pop(), 34);
    assert.deepEqual(objHeap.pop(), { value: 34 });
    assert.isUndefined(heap.peek());
    assert.isUndefined(objHeap.peek());
  });
});
