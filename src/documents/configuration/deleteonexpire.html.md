---
sectionHeader: deleteOnExpire
sectionName: deleteOnExpire
sectionLinkName: deleteonexpire
gfm: true
index: 3
---
__Type:__ `string`

__Default:__ `"none"`

__Description:__ Specifies what should happen when an item expires. `maxAge` must be set in order for `"passive"` or `"aggressive"` to have any effect. Can be configured on a per-item basis for greater specificity.

__Possible Values:__

- `"none"` - Items will not be removed from the cache even if they have expired.

- `"passive"` - Items will be deleted if they are requested after they have expired, resulting in a miss.

- `"aggressive"` - Items will be deleted as soon as they expire.

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    maxAge: 3600000,
    deleteOnExpire: 'aggressive'
});
```

<br>
Can be configured on a per-item basis:
```javascript
newCache.put('someKey', 'someValue', {
    maxAge: 90000,
    deleteOnExpire: 'passive' // overrides the maxAge for "newCache"
});
```