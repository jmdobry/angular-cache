/*
 * angular-cache
 * https://github.com/jmdobry/angular-cache
 *
 * Copyright (c) 2014 Jason Dobry <https://github.com/jmdobry/angular-cache>
 * Licensed under the MIT license. <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      dist: ['dist/'],
      coverage: ['coverage/']
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/unit/**/*.js'],
      jshintrc: '.jshintrc'
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
          banner: '/**\n' +
          '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
          '* @file angular-cache.min.js\n' +
          '* @version <%= pkg.version %> - Homepage <https://github.com/jmdobry/angular-cache>\n' +
          '* @copyright (c) 2013-2014 Jason Dobry <http://www.pseudobry.com>\n' +
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
    browserify: {
      dist: {
        files: {
          'dist/angular-cache.js': ['src/index.js']
        }
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dist: {},
      dev: {
        browsers: ['Firefox'],
        autoWatch: true,
        singleRun: false
      },
      min: {
        options: {
          files: [
            'bower_components/angular-1.2.25/angular.js',
            'bower_components/angular-mocks-1.2.25/angular-mocks.js',
            'dist/angular-cache.min.js',
            './karma.start.js',
            'test/unit/**/*.js'
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

  grunt.registerTask('version', function (filePath) {
    var file = grunt.file.read(filePath);

    file = file.replace(/<%= pkg\.version %>/gi, pkg.version);

    grunt.file.write(filePath, file);
  });

  grunt.registerTask('banner', function () {
    var file = grunt.file.read('dist/angular-cache.js');

    var banner = '/**\n' +
      '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
      '* @file angular-cache.js\n' +
      '* @version ' + pkg.version + ' - Homepage <https://github.com/jmdobry/angular-cache>\n' +
      '* @copyright (c) 2013-2014 Jason Dobry <http://www.pseudobry.com>\n' +
      '* @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>\n' +
      '*\n' +
      '* @overview angular-cache is a very useful replacement for Angular\'s $cacheFactory.\n' +
      '*/\n';

    file = banner + file;

    grunt.file.write('dist/angular-cache.js', file);
  });

  grunt.registerTask('test', ['karma:dist']);
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'browserify',
    'version:dist/angular-cache.js',
    'banner',
    'uglify'
  ]);
  grunt.registerTask('default', ['build']);

  grunt.registerTask('go', ['build', 'watch']);
};
