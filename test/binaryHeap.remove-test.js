describe('BinaryHeap.remove(node)', function () {
    it('should remove the item from the heap.', function () {
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

        expect(heap.remove(0)).toEqual(0);
        expect(objHeap.remove({ value: 0 })).toEqual({ value: 0 });
        expect(heap.peek()).toEqual(1);
        expect(objHeap.peek()).toEqual({ value: 1 });

        expect(heap.remove(1)).toEqual(1);
        expect(objHeap.remove({ value: 1 })).toEqual({ value: 1 });
        expect(heap.peek()).toEqual(4);
        expect(objHeap.peek()).toEqual({ value: 4 });

        expect(heap.remove(4)).toEqual(4);
        expect(objHeap.remove({ value: 4 })).toEqual({ value: 4 });
        expect(heap.peek()).toEqual(5);
        expect(objHeap.peek()).toEqual({ value: 5 });

        expect(heap.remove(5)).toEqual(5);
        expect(objHeap.remove({ value: 5 })).toEqual({ value: 5 });
        expect(heap.peek()).toEqual(6);
        expect(objHeap.peek()).toEqual({ value: 6 });

        expect(heap.remove(6)).toEqual(6);
        expect(objHeap.remove({ value: 6 })).toEqual({ value: 6 });
        expect(heap.peek()).toEqual(7);
        expect(objHeap.peek()).toEqual({ value: 7 });

        expect(heap.remove(7)).toEqual(7);
        expect(objHeap.remove({ value: 7 })).toEqual({ value: 7 });
        expect(heap.peek()).toEqual(20);
        expect(objHeap.peek()).toEqual({ value: 20 });

        expect(heap.remove(20)).toEqual(20);
        expect(objHeap.remove({ value: 20 })).toEqual({ value: 20 });
        expect(heap.peek()).toEqual(22);
        expect(objHeap.peek()).toEqual({ value: 22 });

        expect(heap.remove(22)).toEqual(22);
        expect(objHeap.remove({ value: 22 })).toEqual({ value: 22 });
        expect(heap.peek()).toEqual(31);
        expect(objHeap.peek()).toEqual({ value: 31 });

        expect(heap.remove(31)).toEqual(31);
        expect(objHeap.remove({ value: 31 })).toEqual({ value: 31 });
        expect(heap.peek()).toEqual(32);
        expect(objHeap.peek()).toEqual({ value: 32 });

        expect(heap.remove(32)).toEqual(32);
        expect(objHeap.remove({ value: 32 })).toEqual({ value: 32 });
        expect(heap.peek()).toEqual(33);
        expect(objHeap.peek()).toEqual({ value: 33 });

        expect(heap.remove(33)).toEqual(33);
        expect(objHeap.remove({ value: 33 })).toEqual({ value: 33 });
        expect(heap.peek()).toEqual(34);
        expect(objHeap.peek()).toEqual({ value: 34 });

        expect(heap.remove(34)).toEqual(34);
        expect(objHeap.remove({ value: 34 })).toEqual({ value: 34 });
        expect(heap.peek()).not.toBeDefined();
        expect(objHeap.peek()).not.toBeDefined();
    });
});