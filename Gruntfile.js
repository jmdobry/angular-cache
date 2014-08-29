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
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false
      },
      min: {
        options: {
          files: [
            'bower_components/angular-1.2.16/angular.js',
            'bower_components/angular-mocks-1.2.16/angular-mocks.js',
            'dist/angular-cache.min.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      min_old: {
        options: {
          files: [
            'bower_components/angular-1.1.5/angular.js',
            'bower_components/angular-mocks-1.1.5/angular-mocks.js',
            'dist/angular-cache.min.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.0.4': {
        options: {
          files: [
            'bower_components/angular-1.0.4/angular.js',
            'bower_components/angular-mocks-1.0.4/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.0.5': {
        options: {
          files: [
            'bower_components/angular-1.0.5/angular.js',
            'bower_components/angular-mocks-1.0.5/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.0.6': {
        options: {
          files: [
            'bower_components/angular-1.0.6/angular.js',
            'bower_components/angular-mocks-1.0.6/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.0.7': {
        options: {
          files: [
            'bower_components/angular-1.0.7/angular.js',
            'bower_components/angular-mocks-1.0.7/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.0.8': {
        options: {
          files: [
            'bower_components/angular-1.0.8/angular.js',
            'bower_components/angular-mocks-1.0.8/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.1.4': {
        options: {
          files: [
            'bower_components/angular-1.1.4/angular.js',
            // hopefully this works. 1.1.4 isn't available on bower
            'bower_components/angular-mocks-1.1.5/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.1.5': {
        options: {
          files: [
            'bower_components/angular-1.1.5/angular.js',
            'bower_components/angular-mocks-1.1.5/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.0': {
        options: {
          files: [
            'bower_components/angular-1.2.0/angular.js',
            'bower_components/angular-mocks-1.2.0/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.1': {
        options: {
          files: [
            'bower_components/angular-1.2.1/angular.js',
            'bower_components/angular-mocks-1.2.1/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.2': {
        options: {
          files: [
            'bower_components/angular-1.2.2/angular.js',
            'bower_components/angular-mocks-1.2.2/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.3': {
        options: {
          files: [
            'bower_components/angular-1.2.3/angular.js',
            'bower_components/angular-mocks-1.2.3/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.4': {
        options: {
          files: [
            'bower_components/angular-1.2.4/angular.js',
            'bower_components/angular-mocks-1.2.4/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.5': {
        options: {
          files: [
            'bower_components/angular-1.2.5/angular.js',
            'bower_components/angular-mocks-1.2.5/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.6': {
        options: {
          files: [
            'bower_components/angular-1.2.6/angular.js',
            'bower_components/angular-mocks-1.2.6/angular-mocks.js',
            'dist/angular-cache.js',
            './karma.start.js',
            'test/unit/**/*.js'
          ]
        }
      },
      '1.2.7': {
        options: {
          files: [
            'bower_components/angular-1.2.7/angular.js',
            'bower_components/angular-mocks-1.2.7/angular-mocks.js',
            'dist/angular-cache.js',
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

  grunt.registerTask('test', ['karma:1.2.7']);
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'browserify',
    'version:dist/angular-cache.js',
    'uglify'
  ]);
  grunt.registerTask('default', ['build']);

  // Used by the CLI build servers
  grunt.registerTask('test-ci', [
//		'karma:1.0.4',
//		'karma:1.0.5',
//		'karma:1.0.6',
//		'karma:1.0.7',
//		'karma:1.0.8',
//		'karma:1.1.4',
//		'karma:1.1.5',
    'karma:1.2.1',
    'karma:1.2.2',
    'karma:1.2.3',
    'karma:1.2.4',
    'karma:1.2.5',
    'karma:1.2.6',
    'karma:1.2.7',
    'karma:min',
    'karma:min_old'
  ]);
  grunt.registerTask('ci', ['build', 'test-ci']);
  grunt.registerTask('go', ['build', 'watch']);
};
