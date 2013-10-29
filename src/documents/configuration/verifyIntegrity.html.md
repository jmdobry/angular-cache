---
sectionHeader: verifyIntegrity
sectionName: verifyIntegrity
sectionLinkName: verifyintegrity
gfm: true
index: 9
---
__Type:__ `boolean`

__Default:__ `false`

__Description:__ Specify whether to verify integrity of data saved in `localStorage` on every operation. If true, angular-cache will perform a full sync with `localStorage` on every operation. Increases reliability of data synchronization, but may incur a performance penalty. Has no effect if `storageMode` is set to "none".

__Usage:__
```javascript
$angularCacheFactory('newCache', {
    storageMode: 'localStorage',
    verifyIntegrity: true
});
```