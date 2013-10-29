---
sectionHeader: cacheFlushInterval
sectionName: cacheFlushInterval
sectionLinkName: cacheflushinterval
gfm: true
index: 6
---
__Type:__ `number` (milliseconds)

__Default:__ `null`

__Description:__ Set the cache to periodically clear itself.

__Usage:__
```javascript
$angularCacheFactory('newCache', { cacheFlushInterval: 3600000 }); // clear the cache every hour
```