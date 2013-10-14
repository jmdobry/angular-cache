describe('BinaryHeap.pop()', function () {
    it('should pop the item off of the front of the BinaryHeap.', function () {
        var heap = new BinaryHeap();
        var objHeap = new BinaryHeap(function (x) {
            return x.value;
        });
        var items = [20, 4, 33, 1, 0, 34, 22, 31, 32, 5, 6, 7];
        for (var i = 0; i < items.length; i++) {
            heap.push(items[i]);
            objHeap.push({
                value: items[i]
            });
        }

        expect(heap.size()).toEqual(12);
        expect(objHeap.size()).toEqual(12);

        expect(heap.pop()).toEqual(0);
        expect(objHeap.pop()).toEqual({ value: 0 });
        expect(heap.size()).toEqual(11);
        expect(objHeap.size()).toEqual(11);

        expect(heap.pop()).toEqual(1);
        expect(objHeap.pop()).toEqual({ value: 1 });
        expect(heap.size()).toEqual(10);
        expect(objHeap.size()).toEqual(10);

        expect(heap.pop()).toEqual(4);
        expect(objHeap.pop()).toEqual({ value: 4 });
        expect(heap.size()).toEqual(9);
        expect(objHeap.size()).toEqual(9);

        expect(heap.pop()).toEqual(5);
        expect(objHeap.pop()).toEqual({ value: 5 });
        expect(heap.size()).toEqual(8);
        expect(objHeap.size()).toEqual(8);

        expect(heap.pop()).toEqual(6);
        expect(objHeap.pop()).toEqual({ value: 6 });
        expect(heap.size()).toEqual(7);
        expect(objHeap.size()).toEqual(7);

        expect(heap.pop()).toEqual(7);
        expect(objHeap.pop()).toEqual({ value: 7 });
        expect(heap.size()).toEqual(6);
        expect(objHeap.size()).toEqual(6);

        expect(heap.pop()).toEqual(20);
        expect(objHeap.pop()).toEqual({ value: 20 });
        expect(heap.size()).toEqual(5);
        expect(objHeap.size()).toEqual(5);

        expect(heap.pop()).toEqual(22);
        expect(objHeap.pop()).toEqual({ value: 22 });
        expect(heap.size()).toEqual(4);
        expect(objHeap.size()).toEqual(4);

        expect(heap.pop()).toEqual(31);
        expect(objHeap.pop()).toEqual({ value: 31 });
        expect(heap.size()).toEqual(3);
        expect(objHeap.size()).toEqual(3);

        expect(heap.pop()).toEqual(32);
        expect(objHeap.pop()).toEqual({ value: 32 });
        expect(heap.size()).toEqual(2);
        expect(objHeap.size()).toEqual(2);

        expect(heap.pop()).toEqual(33);
        expect(objHeap.pop()).toEqual({ value: 33 });
        expect(heap.size()).toEqual(1);
        expect(objHeap.size()).toEqual(1);

        expect(heap.pop()).toEqual(34);
        expect(objHeap.pop()).toEqual({ value: 34 });
        expect(heap.size()).toEqual(0);
        expect(objHeap.size()).toEqual(0);
    });
});