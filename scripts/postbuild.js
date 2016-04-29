var fs = require('fs')
var path = __dirname + '/../dist/angular-cache.js'
var file = fs.readFileSync(path, { encoding: 'utf8' })
file = file.replace(
  'module.exports = factory(require(\'angular\'))',
  'module.exports = factory(typeof angular === \'undefined\' ? require(\'angular\') : angular)'
)
var index = file.indexOf('babelHelpers;')
var str = 'var babelHelpers = {};\n' +
'  babelHelpers.typeof = typeof Symbol === "function" && babelHelpers.typeof(Symbol.iterator) === "symbol" ? function (obj) {\n' +
'    return typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);\n' +
'  } : function (obj) {\n' +
'    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj);\n' +
'  };'

var index2 = file.indexOf(str)

var file2 = file.substring(index2 + str.length)
file = file.substring(0, index) + file2

fs.writeFileSync(path, file)
