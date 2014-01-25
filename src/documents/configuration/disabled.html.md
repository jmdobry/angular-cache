---
sectionHeader: disabled
sectionName: disabled
sectionLinkName: disabled
gfm: true
index: 10
---
__Type:__ `boolean`

__Default:__ `false`

__Description:__ Disabled the cache. The cache will continue to function as normal, aside from the fact that
any calls to `AngularCache#put(key, value[, options])` or `AngularCache#get(key[, options])` will have no effect whatsoever.

__Usage:__
```javascript
var newCache = $angularCacheFactory('newCache', { disabled: true }); // This cache starts disabled

newCache.put('4', 'thing');

newCache.get('4'); // undefined, because the cache is disabled
```
