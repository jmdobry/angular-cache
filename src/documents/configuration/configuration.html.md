---
sectionHeader: Using these options
sectionName: Using these options
sectionLinkName: configuration
gfm: true
index: 1
---
These are the configuration options available for customizing each instance of `AngularCache`. They can be used in three places:

<br>
#### Setting the default options for all caches
```javascript
$angularCacheFactoryProvider.setCacheDefaults({
    // configuration options
});
```
See [$angularCacheFactoryProvider.setCacheDefaults(options)](api.html#setcachedefaults)

<br>
#### Creating a cache
```javascript
$angularCacheFactory('newCache', {
    // configuration options
});
```
See [$angularCacheFactory(cacheId, options)](api.html#factory)

<br>
#### Dynamically configuring a cache
```javascript
newCache.setOptions({
    // configuration options
});
```
See [AngularCache.setOptions(options, strict)](api.html#cachesetoptions)