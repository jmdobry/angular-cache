var webpack = require('webpack');
var pkg = JSON.parse(require('fs').readFileSync('package.json'));
var banner = 'angular-cache\n' +
    '@version ' + pkg.version + ' - Homepage <https://github.com/jmdobry/angular-cache>\n' +
    '@author Jason Dobry <jason.dobry@gmail.com>\n' +
    '@copyright (c) 2013-2016 Jason Dobry \n' +
    '@license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>\n' +
    '\n' +
    '@overview angular-cache is a very useful replacement for Angular\'s $cacheFactory.';

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: './dist/angular-cache.js',
    libraryTarget: 'umd',
    library: 'angularCacheModuleName'
  },
  externals: {
    'angular': 'angular'
  },
  module: {
    loaders: [
      {
        test: /(src)(.+)\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    {
      apply: function (compiler) {
        function isObject (value) {
          return toString.call(value) === '[object Object]' || false
        }

        function findAndReplace (target, search, str) {
          if (Array.isArray(target)) {
            target.forEach(function (target) {
              findAndReplace(target, search, str)
            })
          } else if (isObject(target)) {
            for (var key in target) {
              if (target.hasOwnProperty(key)) {
                if (typeof target[key] === 'string') {
                  target[key] = target[key]
                    .replace(search, str)
                } else if (Array.isArray(target[key])) {
                  target[key].forEach(function (target) {
                    findAndReplace(target, search, str)
                  });
                } else if (target[key] && isObject(target[key])) {
                  findAndReplace(target[key], search, str);
                }
              }
            }
          }
        }

        compiler.plugin('compilation', function (compilation) {
          compilation.plugin('optimize-chunk-assets', function (chunks, callback) {
            chunks.forEach(function (chunk) {
              if (chunk.initial) {
                var start = new Date().getTime();
                chunk.files.forEach(function (file) {
                  findAndReplace(compilation.assets[file]._source, 'define(["angular"], factory)', 'define("angular-cache", ["angular"], factory)');
                  findAndReplace(compilation.assets[file]._source, 'define([], factory)', 'define("cachefactory", [], factory)');
                });
                var end = new Date().getTime();
                console.log('time taken: ' + (end - start) + 'ms');
              }
            });
            callback();
          });
        });
      }
    },
    new webpack.BannerPlugin(banner)
  ]
};
