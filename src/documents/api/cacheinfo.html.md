---
sectionHeader: '.info(key)'
sectionName: '&emsp;.info(key)'
sectionLinkName: cacheinfo
gfm: true
index: 18
---
## Description
Return an object containing information about the item with the specified key, or if no key is specified, return information about the cache itself.

## Parameters

#### options
__Type:__ `string`

__Required:__ No

__Description:__ The key of the item about which to retrieve information.

## Usage

```javascript
someCache.info('someKey'); // { // info about 'someKey'... }

someCache.info(); // { // info about 'someCache'... }
```