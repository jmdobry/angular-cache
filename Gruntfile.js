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
        clean: ['dist/', 'docs/', 'coverage/'],
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
                files: {
                    'dist/angular-cache.min.js': ['dist/angular-cache.js']
                }
            }
        },
        karma: {
            options: {
                configFile: './karma.conf.js',
                singleRun: true,
                autoWatch: false
            },
            dev: {
                browsers: ['Chrome']
            },
            travis: {
                browsers: ['Firefox', 'PhantomJS'],
                coverageReporter: {
                    type: 'lcov',
                    dir: 'coverage/'
                },
                preprocessors: {
                    'src/angular-cache.js': ['coverage']
                },
                reporters: ['progress', 'coverage']
            },
            release: {
                coverageReporter: {
                    type: 'lcov',
                    dir: 'coverage/'
                },
                preprocessors: {
                    'src/angular-cache.js': ['coverage']
                },
                reporters: ['progress', 'coverage']
            }
        },
        coveralls: {
            options: {
                coverage_dir: 'coverage'
            }
        },
        jsdoc: {
            dist: {
                src: ['dist/angular-cache.js'],
                options: {
                    destination: 'docs',
                    lenient: true,
                    verbose: true,
                    private: true
                }
            }
        }
    });

    grunt.registerTask('release', ['clean', 'jshint', 'copy', 'uglify', 'karma:dev']);
    grunt.registerTask('build', ['clean', 'jshint', 'copy', 'uglify', 'karma:dev', 'jsdoc', 'clean']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('test', ['karma:dev']);

    // Used by the CLI build servers
    grunt.registerTask('travis', ['clean', 'jshint', 'copy', 'uglify', 'karma:travis', 'coveralls']);

    // Only used on the gh-pages branch
    grunt.registerTask('pages', ['clean', 'jshint', 'build', 'copy', 'uglify', 'karma:release', 'jsdoc']);
};