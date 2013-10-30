---
sectionHeader: storageImpl
sectionName: storageImpl
sectionLinkName: storageimpl
gfm: true
index: 8
---
__Type:__ `object`

__Default:__ `null`

__Description:__ When `storageMode` is set to `"localStorage"` or `"sessionStorage"` angular-cache will default to using the global `localStorage` or `sessionStorage` object.

`storageImpl` provides angular-cache an implementation of `localStorage` or `sessionStorage`. This is useful when you don't want to override the global storage objects or when using angular-cache in a browser that doesn't support `localStorage` or `sessionStorage`.

__Note:__ If angular-cache doesn't detect a global `localStorage` or `sessionStorage` and you don't provide a polyfill, then syncing with web storage will be disabled. It is up to the developer to provide a polyfill for browsers that don't support `localStorage` and `sessionStorage`. Any implementation of `localStorage` and `sessionStorage` provided to angular-cache must implement at least the `setItem`, `getItem`, and `removeItem` methods.

See [Using angular-cache with localStorage](guide.html#using-angular-cache-with-localStorage).

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    storageImpl: mystorageImplementation,
    storageMode: 'localStorage'
});

$angularCacheFactory('otherCache', {
    storageImpl: mySessionStorageImplementation,
    storageMode: 'sessionStorage'
});
```