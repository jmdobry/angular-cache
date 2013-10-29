---
sectionHeader: onExpire
sectionName: onExpire
sectionLinkName: onexpire
gfm: true
index: 5
---
__Type:__ `function`

__Default:__ `null`

__Description:__ A callback function to be executed when an item expires.

__Usage:__
#### Using 'onExpire' in passive delete mode
In passive delete mode the cache doesn't know if an item has expired until the item is requested, at which point the cache checks to see if the item has expired. If the item has expired then it is immediately removed from the cache, resulting in a "miss".

If you specify a global "onExpire" callback function, the cache will execute this function when it is discovered the item has expired, passing to the callback the key and value of the expired item.

When you actually request the expired item via `myCache.get('someKey')` you can also pass a second argument to `get()` specifying a callback that your cache's "onExpire" callback can execute when it finishes. For example:

```javascript
var newCache = $angularCacheFactory('newCache', {
    maxAge: 1000, // Items expire after 1 second, but we don't know it until the item is requested
    onExpire: function (key, value, done) {
        // "onExpire" callback for the cache.
        // The third optional parameter "done", is the second argument passed to `get()` as described above

        console.log(key + ' expired!');
        // Retrieve fresh value for "key" from server, of course you'll need to figure out
        // what the url is if key != url
        $http.get(key).success(function (data) {
            $angularCacheFactory.get('newCache').put(key, data);
            done(data); // Execute the "done" callback specified in the `get()` call
        });
    });
});

newCache.put('denver', 'broncos');

// wait a few seconds

var value = newCache.get('denver', function (value) {
    // here value is defined, because we retrieved it from the server
});
// here value is undefined because the item with
// the key "denver" has expired and was deleted from the
// cache when we requested it. The callback passed to
// "get()" will receive the new value for 'denver' which
// will be retrieved from the server. This callback
// is the "done" callback executed by the "onExpire"
// callback specified when we created the cache.
```

Another example:
```javascript
// We don't specify an "onExpire" callback for this cache
var newCache = $angularCacheFactory('newCache', {
    maxAge: 1000, // Items expire after 1 second, but we don't know it until the item is requested
});

newCache.put('denver', 'broncos');

// wait a few seconds

// In this cache the callback is immediately executed when
// the cache discovers that 'denver' has expired, and the
// callback is passed the key and value of the expired item.
// Here you could retrieve a new value for 'denver' from
// the server or decide to keep the old value and re-insert
// it into the cache. Specifying an "onExpire" callback for
// the cache is a good way to stay DRY.
var value = newCache.get('denver', function (key, value) {
    if (isGoodThisYear(key, value)) {
        newCache.put(key, value);
    } else {
        $http.get(key).success(function (data) {
            newCache.put(key, data);
        });
    }
});
```

#### Using 'onExpire' in aggressive delete mode
In aggressive delete mode you can't pass a second parameter to `get()` because your "onExpire" callback for the cache has already been executed for expired items.

__Usage:__
```javascript
var newCache = $angularCacheFactory('newCache', {
    maxAge: 1000, // Items expire after 1 second and are immediately deleted
    onExpire: function (key, value) {
        // "onExpire" callback for the cache.
        // The third optional parameter "done", is the second argument passed to `get()` as described above

        console.log(key + ' expired!');
        // Retrieve fresh value for "key" from server, of course you'll need to figure out
        // what the url is if key != url
        $http.get(key).success(function (data) {
            $angularCacheFactory.get('newCache').put(key, data);
        });
    });
});

newCache.put('denver', 'broncos');

// wait a few seconds, during which time the "onExpire" callback is automatically executed

newCache.get('denver'); // 'broncos' or whatever was returned by the server in the "onExpire" callback
```