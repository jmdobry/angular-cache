---
sectionHeader: Basics
sectionName: Basics
sectionLinkName: basics
gfm: true
index: 1
---
## Create a cache
First, inject `$angularCacheFactory` then create as many caches as you so desire. Let's go:

```javascript
app.service('myService', function ($angularCacheFactory) {

    // Create a new cache called "profileCache"
    var profileCache = $angularCacheFactory('profileCache');
});
```

Let's add some items to the cache:

```javascript
profileCache.put('/profiles/34', {
    name: 'John',
    skills: ['programming', 'piano']
});

profileCache.put('/profiles/22', {
    name: 'Sally',
    skills: ['marketing', 'climbing', 'painting']
});
```

Right now, these items will stay in the cache indefinitely. What if, for the sake of the example, I know that users change their skills in their profile once a week. The profile information is subject to change, but we don't want to make tons of requests for profiles that probably haven't changed.

Let's have items which are added to `profileCache` expire after an hour:

```javascript
profileCache.setOptions({
    maxAge: 3600000
});
```

Perfect. Say we also want the items removed from the cache when they expire:

```javascript
profileCache.setOptions({
    deleteOnExpire: 'aggressive'
});
```

Let's say that when the items do expire, we want to refresh them with new values:

```javascript
profileCache.setOptions({
    onExpire: function (key, value) {
        $http.get(key).success(function (data) {
            profileCache.put(key, data);
        });
    }
});
```

Sweet! Now we'd probably have configured our cache correctly when we created it:

```javascript
var profileCache = $angularCacheFactory('profileCache', {
    maxAge: 3600000,
    deleteOnExpire: 'aggressive',
    onExpire: function (key, value) {
        $http.get(key).success(function (data) {
            profileCache.put(key, data);
        });
    }
});
```

Or say we want all of our caches to use that configuration as their default:

```javascript
angular.module('app', ['jmdobry.angular-cache'])
    .config(function ($angularCacheFactoryProvider) {

        $angularCacheFactoryProvider.setCacheDefaults({
            maxAge: 3600000,
                deleteOnExpire: 'aggressive',
                onExpire: function (key, value) {
                    $http.get(key).success(function (data) {
                        profileCache.put(key, data);
                    });
                }
        });
    });
```

## Working with a cache
We can retrieve items from a cache like so:

```javascript
var profile = profileCache.get('/profiles/34');

profile.name; // 'John'
```

And get information about items in the cache:

```javascript
var info = profileCache.info('/profiles/34');

info.isExpired; // false
// etc.
```

and information about the cache itself:

```javascript
var info = profileCache.info();

info.size; // 2
info.maxAge; // 3600000
info.deleteOnExpire; // 'aggressive'
// etc.
```

Items are easily removed, and we can destroy out cache when we're done with it:

```javascript
profileCache.remove('/profiles/34');

profileCache.get('/profiles/34'); // undefined

profileCache.destroy();

$angularCacheFactory.get('profileCache'); // undefined
```

See the [API Documentation](api.html) for more information on the available methods.