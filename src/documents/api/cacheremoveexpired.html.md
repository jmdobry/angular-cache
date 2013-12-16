---
sectionHeader: '.removeExpired(options)'
sectionName: '&emsp;.removeExpired(options)'
sectionLinkName: cacheremoveexpired
gfm: true
index: 15
---
## Description
Remove all expired items from the cache and return an object (or array) of the removed items.

## Parameters

#### options
__Type:__ `object`

__Description:__ Configuration options for this method call. `verifyIntegrity: true|false` is available, as well as `asArray: true|false`, which will cause the method to return an array instead of an object.

## Usage

```javascript
someCache.removeExpired(options);
```
