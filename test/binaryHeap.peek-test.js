describe('BinaryHeap.peek()', function () {
    it('should show the item at the front of the BinaryHeap.', function () {
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

        expect(heap.peek()).not.toBeDefined();
        expect(objHeap.peek()).not.toBeDefined();

        heap.push(items[0]);
        objHeap.push(objItems[0]);
        expect(heap.peek()).toEqual(items[0]);
        expect(objHeap.peek()).toEqual(objItems[0]);

        heap.push(items[1]);
        objHeap.push(objItems[1]);
        expect(heap.peek()).toEqual(items[1]);
        expect(objHeap.peek()).toEqual(objItems[1]);

        heap.push(items[2]);
        objHeap.push(objItems[2]);
        expect(heap.peek()).toEqual(items[1]);
        expect(objHeap.peek()).toEqual(objItems[1]);

        heap.push(items[3]);
        objHeap.push(objItems[3]);
        expect(heap.peek()).toEqual(items[3]);
        expect(objHeap.peek()).toEqual(objItems[3]);

        heap.push(items[4]);
        objHeap.push(objItems[4]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[5]);
        objHeap.push(objItems[5]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[6]);
        objHeap.push(objItems[6]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[7]);
        objHeap.push(objItems[7]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[8]);
        objHeap.push(objItems[8]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[9]);
        objHeap.push(objItems[9]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[10]);
        objHeap.push(objItems[10]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        heap.push(items[11]);
        objHeap.push(objItems[11]);
        expect(heap.peek()).toEqual(items[4]);
        expect(objHeap.peek()).toEqual(objItems[4]);

        expect(heap.pop()).toEqual(0);
        expect(objHeap.pop()).toEqual({ value: 0 });
        expect(heap.peek()).toEqual(1);
        expect(objHeap.peek()).toEqual({ value: 1 });

        expect(heap.pop()).toEqual(1);
        expect(objHeap.pop()).toEqual({ value: 1 });
        expect(heap.peek()).toEqual(4);
        expect(objHeap.peek()).toEqual({ value: 4 });

        expect(heap.pop()).toEqual(4);
        expect(objHeap.pop()).toEqual({ value: 4 });
        expect(heap.peek()).toEqual(5);
        expect(objHeap.peek()).toEqual({ value: 5 });

        expect(heap.pop()).toEqual(5);
        expect(objHeap.pop()).toEqual({ value: 5 });
        expect(heap.peek()).toEqual(6);
        expect(objHeap.peek()).toEqual({ value: 6 });

        expect(heap.pop()).toEqual(6);
        expect(objHeap.pop()).toEqual({ value: 6 });
        expect(heap.peek()).toEqual(7);
        expect(objHeap.peek()).toEqual({ value: 7 });

        expect(heap.pop()).toEqual(7);
        expect(objHeap.pop()).toEqual({ value: 7 });
        expect(heap.peek()).toEqual(20);
        expect(objHeap.peek()).toEqual({ value: 20 });

        expect(heap.pop()).toEqual(20);
        expect(objHeap.pop()).toEqual({ value: 20 });
        expect(heap.peek()).toEqual(22);
        expect(objHeap.peek()).toEqual({ value: 22 });

        expect(heap.pop()).toEqual(22);
        expect(objHeap.pop()).toEqual({ value: 22 });
        expect(heap.peek()).toEqual(31);
        expect(objHeap.peek()).toEqual({ value: 31 });

        expect(heap.pop()).toEqual(31);
        expect(objHeap.pop()).toEqual({ value: 31 });
        expect(heap.peek()).toEqual(32);
        expect(objHeap.peek()).toEqual({ value: 32 });

        expect(heap.pop()).toEqual(32);
        expect(objHeap.pop()).toEqual({ value: 32 });
        expect(heap.peek()).toEqual(33);
        expect(objHeap.peek()).toEqual({ value: 33 });

        expect(heap.pop()).toEqual(33);
        expect(objHeap.pop()).toEqual({ value: 33 });
        expect(heap.peek()).toEqual(34);
        expect(objHeap.peek()).toEqual({ value: 34 });

        expect(heap.pop()).toEqual(34);
        expect(objHeap.pop()).toEqual({ value: 34 });
        expect(heap.peek()).not.toBeDefined();
        expect(objHeap.peek()).not.toBeDefined();
    });
});