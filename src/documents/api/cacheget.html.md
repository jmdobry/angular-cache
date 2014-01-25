---
sectionHeader: '.get(key[, options])'
sectionName: '&emsp;.get(key[, options])'
sectionLinkName: cacheget
gfm: true
index: 13
---
## Signature
`AngularCache#get(key[, options])`

## Description
Retrieve the item from the cache with the specified key.

## Parameters

#### key
__Type:__ `string|array`

__Description:__ The key of the item to retrieve or an array of the keys of items to retrieve.

#### options
__Type:__ `object`

__Description:__ Configuration options for this method call. Possible properties of `options` parameter:

- `onExpire` - `function` - Function to be called if the requested item has expired.

## Usage

```javascript
someCache.get('key'); // 'value'

someCache.get('ageLimit'); // 55

someCache.get('things'); // { stuff: 'lots of stuff' }

someCache.get('isIt'); // true

someCache.get(['key', 'ageLimit']); // ['value', 55]

var thing = someCache.get('thingThatExpired', {
				onExpire: function (key, value) {
					$http.get(key).then(function (thing) {
						someCache.put(key, thing);

						someCache.get('thingThatExpired'); // { name: 'A thing!' }
					});
				});

thing; // undefined
```
