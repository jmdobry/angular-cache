---
sectionHeader: '.setCacheDefaults(options)'
sectionName: '&emsp;.setCacheDefaults(options)'
sectionLinkName: setcachedefaults
---
## Description
Set the default configuration for all caches created by `$angularCacheFactory`.

## Parameters

#### options
__Type:__ `object`

__Description:__ Configuration object for global cache defaults. See [Configuration Options](/configuration.html).

## Usage

```javascript
app.module('app', ['jmdobry.angular-cache'])
    .config(function ($angularCacheFactoryProvider) {
        $angularCacheFactoryProvider.setCacheDefaults({
            maxAge: 3600000,
            deleteOnExpire: 'aggressive'
        });
    })
    .run(function ($angularCacheFactory) {
        var info = $angularCacheFactory.info();

        console.log(info.cacheDefaults); // output below

        // {
        //    capacity: Number.MAX_VALUE,
        //    maxAge: 3600000,
        //    deleteOnExpire: 'aggressive',
        //    onExpire: null,
        //    cacheFlushInterval: null,
        //    storageMode: 'none',
        //    storageImpl: null,
        //    recycleFreq: 1000,
        //    verifyIntegrity: false
        // }

        var newCache = $angularCacheFactory('newCache');

        newCache.info().maxAge; // 3600000
        newCache.info().deleteOnExpire; // "aggressive"
    });
```