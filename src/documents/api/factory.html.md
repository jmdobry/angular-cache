---
sectionHeader: '$angularCacheFactory(cacheId, options)'
sectionName: '$angularCacheFactory(cacheId, options)'
sectionLinkName: factory
gfm: true
index: 3
---
## Description
Angular Factory Service. Produces instances of  `AngularCache`.

## Parameters

#### cacheId
__Type:__ `string`

__Required:__ Yes

__Description:__ The name of the new cache. Must be unique.

#### options
__Type:__ `object`

__Required:__ No

__Description:__ The configuration options for the new cache. See [Configuration Options](configuration.html);

## Usage

```javascript
angular.module('app').controller('myCtrl', function ($angularCacheFactory) {
    var newCache = $angularCacheFactory('newCache', { options... });
});
```