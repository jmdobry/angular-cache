---
sectionHeader: Installation
sectionName: Installation
sectionLinkName: install
gfm: true
index: 2
---
## With Bower
Angular-cache should have installed to `path/to/bower_components/angular-cache/`. You can reference the files in the `dist/` folder, which contains development and minified versions of angular-cache.

Include angular-cache on your web page _after_ angular.js.

```html
<!-- After angular.js -->
<script src="/path/to/bower_components/angular-cache/dist/angular-cache.min.js"></script>
```

## Install Manually
Include the version of angular-cache you downloaded on your web page _after_ you include angular.js.

```html
<!-- After angular.js -->
<script src="/js/plugins/angular-cache-2.1.0.min.js"></script>
```

## Load the angular-cache module
Finally, list angular-cache as a dependency in your app's module definition.

```javascript
angular.module('app', ['jmdobry.angular-cache']).config(function ($angularCacheFactoryProvider) {

    // optionally set cache defaults
    $angularCacheFactoryProvider.setCacheDefaults({ options... });

}).run(function ($angularCacheFactory) {

    // Create a cache here, or anywhere else. Just inject $angularCacheFactory
    var newCache = $angularCacheFactory('newCache', { options... });

});
```
