describe('BinaryHeap.removeAll()', function () {
    it('should remove all items from the heap.', function () {
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

        heap.removeAll();
        objHeap.removeAll();

        expect(heap.size()).toEqual(0);
        expect(objHeap.size()).toEqual(0);

        expect(heap.peek()).not.toBeDefined();
        expect(objHeap.peek()).not.toBeDefined();
    });
});