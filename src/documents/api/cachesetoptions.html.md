---
sectionHeader: '.setOptions(options, strict)'
sectionName: '&emsp;.setOptions(options, strict)'
sectionLinkName: cachesetoptions
gfm: true
index: 11
---
## Description
Dynamically set the configuration for the cache. See [Configuration Options](configuration.html).

## Parameters

#### options
__Type:__ `object`

__Description:__ The configuration options for the cache. See [Configuration Options](configuration.html).

#### strict
__Type:__ `boolean`

__Required:__ No

__Description:__ If true, the cache's configuration will be reset to default before applying the new configuration.

## Usage

```javascript
$angularCacheFactory.get('someCache').setOptions({ maxAge: 900000 });

$angularCacheFactory.get('someCache').setOptions({ verifyIntegrity: false }, true);
```

#### _destroy()_
__Description:__ Completely destroy the cache. [AngularCache#destroy](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#destroy) API documentation.

#### _keySet()_
__Description:__ Return the set of keys of all items in the cache. [AngularCache#keySet](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#keySet) API documentation.

#### _keys()_
__Description:__ Return an array of the keys of all items in the cache. [AngularCache#keys](http://jmdobry.github.io/angular-cache/docs/AngularCache.html#keys) API documentation.