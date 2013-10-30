---
sectionHeader: '.info(key)'
sectionName: '&emsp;.info(key), .keySet() & .keys()'
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

# .keySet()

## Description
Return the set of keys of all items in the cache.

## Usage

```javascript
someCache.keySet();
```

# .keys()

## Description
Return an array of the keys of all items in the cache.

## Usage

```javascript
someCache.keys();
```