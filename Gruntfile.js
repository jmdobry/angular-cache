/*
 * angular-cache
 * http://github.com/jmdobry/angular-cache
 *
 * Copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/angular-cache>
 * Licensed under the MIT license. <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // these folders will no longer be checked into development branches
    clean: {
      pre: ['dist/', 'coverage/'],
      post: ['coverage/']
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],
      jshintrc: '.jshintrc'
    },
    copy: {
      options: {
        processContent: function (contents) {
          contents = contents.replace(/<%= pkg.version %>/g, grunt.file.readJSON('package.json').version);
          return contents;
        }
      },
      dist: {
        src: ['src/angular-cache.js'],
        dest: 'dist/angular-cache.js'
      }
    },
    uglify: {
      main: {
        options: {
          banner: '/**\n' +
            '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
            '* @file angular-cache.min.js\n' +
            '* @version <%= pkg.version %> - Homepage <http://jmdobry.github.io/angular-cache/>\n' +
            '* @copyright (c) 2013-2014 Jason Dobry <http://jmdobry.github.io/angular-cache>\n' +
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
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false
      },
      '1.0.4': {
        options: {
          files: [
            'bower_components/angular-1.0.4/angular.js',
            'bower_components/angular-mocks-1.0.4/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.0.5': {
        options: {
          files: [
            'bower_components/angular-1.0.5/angular.js',
            'bower_components/angular-mocks-1.0.5/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.0.6': {
        options: {
          files: [
            'bower_components/angular-1.0.6/angular.js',
            'bower_components/angular-mocks-1.0.6/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.0.7': {
        options: {
          files: [
            'bower_components/angular-1.0.7/angular.js',
            'bower_components/angular-mocks-1.0.7/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.0.8': {
        options: {
          files: [
            'bower_components/angular-1.0.8/angular.js',
            'bower_components/angular-mocks-1.0.8/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.1.4': {
        options: {
          files: [
            'bower_components/angular-1.1.4/angular.js',
            // hopefully this works. 1.1.4 isn't available on bower
            'bower_components/angular-mocks-1.1.5/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.1.5': {
        options: {
          files: [
            'bower_components/angular-1.1.5/angular.js',
            'bower_components/angular-mocks-1.1.5/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.0': {
        options: {
          files: [
            'bower_components/angular-1.2.0/angular.js',
            'bower_components/angular-mocks-1.2.0/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.1': {
        options: {
          files: [
            'bower_components/angular-1.2.1/angular.js',
            'bower_components/angular-mocks-1.2.1/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.2': {
        options: {
          files: [
            'bower_components/angular-1.2.2/angular.js',
            'bower_components/angular-mocks-1.2.2/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.3': {
        options: {
          files: [
            'bower_components/angular-1.2.3/angular.js',
            'bower_components/angular-mocks-1.2.3/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.4': {
        options: {
          files: [
            'bower_components/angular-1.2.4/angular.js',
            'bower_components/angular-mocks-1.2.4/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.5': {
        options: {
          files: [
            'bower_components/angular-1.2.5/angular.js',
            'bower_components/angular-mocks-1.2.5/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.6': {
        options: {
          files: [
            'bower_components/angular-1.2.6/angular.js',
            'bower_components/angular-mocks-1.2.6/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.7': {
        options: {
          files: [
            'bower_components/angular-1.2.7/angular.js',
            'bower_components/angular-mocks-1.2.7/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
          ]
        }
      },
      '1.2.16': {
        options: {
          files: [
            'bower_components/angular-1.2.16/angular.js',
            'bower_components/angular-mocks-1.2.16/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
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

  grunt.registerTask('test', ['karma:1.2.16']);
  grunt.registerTask('release', ['clean:pre', 'jshint', 'copy', 'uglify', 'test', 'clean:post']);
  grunt.registerTask('build', ['release', 'clean:pre']);
  grunt.registerTask('default', ['build']);

  // Used by the CLI build servers
  grunt.registerTask('test-cli', ['karma:1.0.4', 'karma:1.0.5', 'karma:1.0.6', 'karma:1.0.7', 'karma:1.0.8', 'karma:1.1.4', 'karma:1.1.5', 'karma:1.2.1', 'karma:1.2.2', 'karma:1.2.3', 'karma:1.2.4', 'karma:1.2.5', 'karma:1.2.6', 'karma:1.2.7', 'karma:1.2.16']);
  grunt.registerTask('cli', ['clean', 'jshint', 'copy', 'uglify', 'test-cli', 'coveralls']);
};
