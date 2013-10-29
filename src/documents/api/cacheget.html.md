---
sectionHeader: '.get(key, options)'
sectionName: '&emsp;.get(key, options)'
sectionLinkName: cacheget
gfm: true
index: 13
---
## Description
Retrieve the item from the cache with the specified key.

## Parameters

#### key
__Type:__ `string`

__Description:__ The key of the item to retrieve.

#### options
__Type:__ `object`

__Description:__ Configuration options for this method call. `onExpire: Function` is the only option available for this method.

## Usage

```javascript
someCache.get('key'); // 'value'

someCache.get('ageLimit'); // 55

someCache.get('things'); // { stuff: 'lots of stuff' }

someCache.get('isIt'); // true
```