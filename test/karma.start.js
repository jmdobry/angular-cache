var fail = function (msg) {
        expect('should not reach this!: ' + msg).toEqual('failure');
    },
    TYPES_EXCEPT_STRING = [123, 123.123, null, undefined, {}, [], true, false, function () {}],
    TYPES_EXCEPT_STRING_OR_ARRAY = [123, 123.123, null, undefined, {}, true, false, function () {}],
    TYPES_EXCEPT_NUMBER = ['string', null, undefined, {}, [], true, false, function () {}],
    TYPES_EXCEPT_OBJECT = ['string', 123, 123.123, null, undefined, true, false, function () {}],
    TYPES_EXCEPT_BOOLEAN = ['string', 123, 123.123, null, undefined, {}, [], function () {}],
    TYPES_EXCEPT_FUNCTION = ['string', 123, 123.123, null, undefined, {}, [], true, false],
    CACHE_DEFAULTS = {
        capacity: Number.MAX_VALUE,
        maxAge: null,
        deleteOnExpire: 'none',
        onExpire: null,
        cacheFlushInterval: null,
        recycleFreq: 1000,
        storageMode: 'none',
        storageImpl: null,
        verifyIntegrity: true
    };

var $angularCacheFactoryProvider, $angularCacheFactory, BinaryHeap;
beforeEach(module('jmdobry.angular-cache', function (_$angularCacheFactoryProvider_) {
    $angularCacheFactoryProvider = _$angularCacheFactoryProvider_;
}));
beforeEach(inject(function (_$angularCacheFactory_, _BinaryHeap_) {
    $angularCacheFactory = _$angularCacheFactory_;
    BinaryHeap = _BinaryHeap_;
}));
afterEach(function () {
    $angularCacheFactory.removeAll();
});