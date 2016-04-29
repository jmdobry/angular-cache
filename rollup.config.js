var babel = require('rollup-plugin-babel')
var pkg = require('./package.json')

module.exports = {
  moduleName: 'angularCacheModuleName',
  moduleId: 'angular-cache',
  banner: '/**\n' +
  ' * angular-cache\n' +
  ' * @version ' + pkg.version + ' - Homepage <https://github.com/jmdobry/angular-cache>\n' +
  ' * @copyright (c) 2013-2016 angular-cache project authors\n' +
  ' * @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>\n' +
  ' * @overview angular-cache is a very useful replacement for Angular\'s $cacheFactory.\n' +
  ' */',
  plugins: [
    babel({
      babelrc: false,
      presets: [
        'es2015-rollup'
      ]
    })
  ]
}
