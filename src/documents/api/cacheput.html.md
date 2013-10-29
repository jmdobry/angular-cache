---
sectionHeader: '.put(key, value, options)'
sectionName: '&emsp;.put(key, value, options)'
sectionLinkName: cacheput
gfm: true
index: 12
---
## Description
Add a key-value pair to the cache.

## Parameters

#### options
__Type:__ `string`

__Required:__ Yes

__Description:__ The key of the item to be added to the cache.

#### options
__Type:__ `*`

__Required:__ Yes

__Description:__ The item to be added to the cache.

#### options
__Type:__ `object`

__Required:__ No

__Description:__ The configuration options for the item to be added.

## Usage

```javascript
someCache.put('key', 'value');

someCache.put('ageLimit', 55);

someCache.put('things', { stuff: 'lots of stuff' });

someCache.put('isIt', true);
```