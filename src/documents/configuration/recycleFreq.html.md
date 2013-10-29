---
sectionHeader: recycleFreq
sectionName: recycleFreq
sectionLinkName: recyclefreq
gfm: true
index: 4
---
__Type:__ `number` (milliseconds)

__Default:__ `1000`

__Description:__ How often the cache should check for expired items. Only used when `maxAge` is set.

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    maxAge: 3600000,
    recycleFreq: 10000 // check for expired items every 10 seconds
});
```