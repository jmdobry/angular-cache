---
sectionHeader: '$angularCacheFactoryProvider'
sectionName: '$angularCacheFactoryProvider'
sectionLinkName: provider
gfm: true
index: 1
---
## Description
Provider for `$angularCacheFactory`. Injectable into an Angular module's `config()` method call.

## Usage

```javascript
app.module('app', ['jmdobry.angular-cache'])
    .config(function ($angularCacheFactoryProvider) {
        // ...
    });
```