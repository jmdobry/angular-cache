---
sectionHeader: '$angularCacheFactoryProvider'
sectionName: '$angularCacheFactoryProvider'
sectionLinkName: provider
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