describe('BinaryHeap.push(node)', function () {
    it('should push items to the front of the BinaryHeap.', function () {
        var heap = new BinaryHeap();
        var objHeap = new BinaryHeap(function (x) {
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
        expect(heap.size()).toEqual(1);
        expect(objHeap.size()).toEqual(1);
        expect(heap.peek()).toEqual(items[0]);
        expect(objHeap.peek()).toEqual(objItems[0]);

        heap.push(items[1]);
        objHeap.push(objItems[1]);
        expect(heap.size()).toEqual(2);
        expect(objHeap.size()).toEqual(2);
        expect(heap.peek()).toEqual(items[1]);
        expect(objHeap.peek()).toEqual(objItems[1]);

        heap.push(items[2]);
        objHeap.push(objItems[2]);
        expect(heap.size()).toEqual(3);
        expect(objHeap.size()).toEqual(3);
        expect(heap.peek()).toEqual(items[1]);
        expect(objHeap.peek()).toEqual(objItems[1]);

        heap.push(items[3]);
        objHeap.push(objItems[3]);
        expect(heap.size()).toEqual(4);
        expect(objHeap.size()).toEqual(4);
        expect(heap.peek()).toEqual(items[3]);
        expect(objHeap.peek()).toEqual(objItems[3]);

        heap.push(items[4]);
        objHeap.push(objItems[4]);
        expect(heap.size()).toEqual(5);
        expect(objHeap.size()).toEqual(5);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[5]);
        objHeap.push(objItems[5]);
        expect(heap.size()).toEqual(6);
        expect(objHeap.size()).toEqual(6);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[6]);
        objHeap.push(objItems[6]);
        expect(heap.size()).toEqual(7);
        expect(objHeap.size()).toEqual(7);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[7]);
        objHeap.push(objItems[7]);
        expect(heap.size()).toEqual(8);
        expect(objHeap.size()).toEqual(8);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[8]);
        objHeap.push(objItems[8]);
        expect(heap.size()).toEqual(9);
        expect(objHeap.size()).toEqual(9);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[9]);
        objHeap.push(objItems[9]);
        expect(heap.size()).toEqual(10);
        expect(objHeap.size()).toEqual(10);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[10]);
        objHeap.push(objItems[10]);
        expect(heap.size()).toEqual(11);
        expect(objHeap.size()).toEqual(11);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[11]);
        objHeap.push(objItems[11]);
        expect(heap.size()).toEqual(12);
        expect(objHeap.size()).toEqual(12);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);
    });
});