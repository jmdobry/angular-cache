---
sectionHeader: storageMode
sectionName: storageMode
sectionLinkName: storagemode
gfm: true
index: 7
---
__Type:__ `string`

__Default:__ `"none"`

__Description:__ Configure the cache to sync itself with `localStorage` or `sessionStorage`. The cache will re-initialize itself from `localStorage` or `sessionStorage` on page refresh. See [Using angular-cache with localStorage](/guide.html#using-angular-cache-with-localStorage).

__Possible Values:__

- `"none"` - The cache will not sync itself with web storage.

- `"localStorage"` - Sync with `localStorage`

- `"sessionStorage"` - Sync with `sessionStorage`

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    storageMode: 'localStorage', // this cache will sync itself to localStorage
    verifyIntegrity: true
});
```