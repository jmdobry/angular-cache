describe('BinaryHeap(weightFunc)', function () {
    it('should create an empty heap with size 0.', function () {
        var heap = new BinaryHeap();
        expect(heap.size()).toEqual(0);
    });
    it('should throw an error if "weightFunc" is not a function.', function () {
        var heap;
        for (var i = 0; i < TYPES_EXCEPT_FUNCTION.length; i++) {
            try {
                heap = new BinaryHeap(TYPES_EXCEPT_FUNCTION[i]);
                if (TYPES_EXCEPT_FUNCTION[i]) {
                    fail();
                }
            } catch (err) {
                expect(err.message).toEqual('BinaryHeap(weightFunc): weightFunc: must be a function!');
                continue;
            }
            if (TYPES_EXCEPT_FUNCTION[i]) {
                fail();
            }
        }
    });
});