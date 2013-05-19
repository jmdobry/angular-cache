/*
 * ngAdvancedCache
 * http://github.com/jmdobry/ngAdvancedCache
 *
 * Copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/ngAdvancedCache>
 * Licensed under the MIT license. <https://github.com/jmdobry/ngAdvancedCache/blob/master/LICENSE>
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist/'],
        jshint: ['src/ngAdvancedCache.js'],
        copy: {
            options: {
                processContent: function (contents) {
                    contents = contents.replace(/<%= pkg.version %>/g, grunt.file.readJSON('package.json').version);
                    return contents;
                }
            },
            dist: {
                src: ['src/ngAdvancedCache.js'],
                dest: 'dist/ngAdvancedCache-<%= pkg.version %>.js'
            }
        },
        uglify: {
            main: {
                files: {
                    'dist/ngAdvancedCache-<%= pkg.version %>.min.js': ['dist/ngAdvancedCache-<%= pkg.version %>.js']
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['clean', 'jshint', 'copy', 'uglify']);
};