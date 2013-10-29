---
sectionHeader: Upgrade
sectionName: Upgrade
sectionLinkName: upgrade
gfm: true
---
## Transition Details
See [TRANSITION.md](https://github.com/jmdobry/angular-cache/blob/master/TRANSITION.md) for details on breaking changes between versions.

## Upgrade with Bower
After installing angular-cache with Bower, your `bower.json` file lists angular-cache as a dependency.

```javascript
"dependencies": {
    "angular-cache": "~1.2.1"
}
```

<br>
The command:

`bower install angular-cache -F --save`

will install the latest stable version of angular-cache and save the change to your `bower.json`.

<br>
Alternatively, you can specify the new version you want to install, for example:

`bower install angular-cache#2.0.0 --save`.

<br>
`bower prune` will remove the old installation of angular-cache.

## Upgrade Manually
Download the version of angular-cache you want as specified in the [Download](#download) section.

Remember to update your references to angular-cache.