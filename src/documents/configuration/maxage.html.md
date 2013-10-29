---
sectionHeader: maxAge
sectionName: maxAge
sectionLinkName: maxage
gfm: true
index: 2
---
__Type:__ `number` (milliseconds)

__Default:__ `null`

__Description:__ Set a default maximum lifetime on all items added to the cache. They will be removed aggressively or passively or not at all depending on the value of `deleteOnExpire` (see below). Can be configured on a per-item basis for greater specificity.

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    maxAge: 3600000
});
```

<br>
Can be configured on a per-item basis:
```javascript
newCache.put('someKey', 'someValue', {
    maxAge: 90000 // overrides the maxAge for "newCache"
});
```