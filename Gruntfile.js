/*
 * angular-cache
 * http://jmdobry.github.io/angular-cache/
 *
 * Copyright (c) 2013-2015 Jason Dobry <http://jmdobry.github.io/angular-cache/>
 * Licensed under the MIT license. <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';
  'use strict';

  require('jit-grunt')(grunt, {
    coveralls: 'grunt-karma-coveralls'
  });
  require('time-grunt')(grunt);

  var webpack = require('webpack');
  var pkg = grunt.file.readJSON('package.json');
  var banner = 'angular-cache\n' +
    '@version ' + pkg.version + ' - Homepage <http://jmdobry.github.io/angular-cache/>\n' +
    '@author Jason Dobry <jason.dobry@gmail.com>\n' +
    '@copyright (c) 2013-2015 Jason Dobry \n' +
    '@license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>\n' +
    '\n' +
    '@overview angular-cache is a very useful replacement for Angular\'s $cacheFactory.';

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      dist: ['dist/'],
      coverage: ['coverage/']
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['build']
    },
    uglify: {
      main: {
        options: {
          report: 'min',
          sourceMap: true,
          sourceMapName: 'dist/angular-cache.min.map',
          banner: '/*!\n' +
          '* angular-cache\n' +
          '* @version <%= pkg.version %> - Homepage <http://jmdobry.github.io/angular-cache/>\n' +
          '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
          '* @copyright (c) 2013-2015 Jason Dobry <http://www.pseudobry.com>\n' +
          '* @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>\n' +
          '*\n' +
          '* @overview angular-cache is a very useful replacement for Angular\'s $cacheFactory.\n' +
          '*/\n'
        },
        files: {
          'dist/angular-cache.min.js': ['dist/angular-cache.js']
        }
      }
    },
    webpack: {
      dist: {
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
            { test: /(src)(.+)\.js$/, exclude: /node_modules/, loader: 'babel-loader?blacklist=useStrict' }
          ],
          preLoaders: [
            {
              test: /(src)(.+)\.js$|(test)(.+)\.js$/, // include .js files
              exclude: /node_modules/, // exclude any and all files in the node_modules folder
              loader: "jshint-loader?failOnHint=true"
            }
          ]
        },
        plugins: [
          new webpack.BannerPlugin(banner)
        ]
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dist: {},
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false
      },
      min: {
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        options: {
          files: [
            'bower_components/angular-1.2.25/angular.js',
            'bower_components/angular-mocks-1.2.25/angular-mocks.js',
            'dist/angular-cache.min.js',
            './karma.start.js',
            'test/**/*.js'
          ]
        }
      }
    },
    coveralls: {
      options: {
        coverage_dir: 'coverage'
      }
    }
  });

  grunt.registerTask('test', ['build', 'karma:dist', 'karma:min']);
  grunt.registerTask('build', [
    'clean',
    'webpack',
    'uglify'
  ]);
  grunt.registerTask('default', ['build']);

  grunt.registerTask('go', ['build', 'watch']);
};
