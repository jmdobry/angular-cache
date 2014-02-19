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

	var dev = process.cwd().indexOf('/home/codetrain/angular-cache') === -1;

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			dist: ['dist/'],
			coverage: ['coverage/'],
			doc: ['doc/'],
			afterDoc: [
				'doc/resources/img/angular.png',
				'doc/resources/img/angular_grey.png',
				'doc/resources/img/AngularJS-small.png',
				'doc/resources/img/docular-small.png',
				'doc/resources/img/favicon.ico',
				'doc/resources/img/grunt.png',
				'doc/resources/img/grunt_grey.png',
				'doc/resources/img/node.png',
				'doc/resources/img/node_grey.png',
				'doc/resources/angular/',
				'doc/resources/doc_api_resources/doc_api.js',
				'doc/resources/js/docs*.js',
				'doc/resources/js/jquery*.js'
			]
		},
		jshint: {
			all: ['Gruntfile.js', 'src/**/*.js', 'test/unit/**/*.js'],
			jshintrc: '.jshintrc'
		},
		watch: {
			files: ['src/**/*.js'],
			tasks: ['build', 'doc']
		},
		uglify: {
			main: {
				options: {
					banner: '/**\n' +
						'* @author Jason Dobry <jason.dobry@gmail.com>\n' +
						'* @file angular-cache.min.js\n' +
						'* @version <%= pkg.version %> - Homepage <https://github.com/jmdobry/angular-cache>\n' +
						'* @copyright (c) 2013 Jason Dobry <http://www.pseudobry.com>\n' +
						'* @license MIT <https://github.com/jmdobry/angular-cache/blob/master/LICENSE>\n' +
						'*\n' +
						'* @overview angular-cache is a very useful replacement for Angular\'s $cacheFactory.\n' +
						'*/\n'
				},
				files: {
					'dist/angular-cache.min.js': ['dist/angular-cache.js']
				}
			},
			scripts: {
				files: {
					'doc/resources/js/libs.min.js': ['doc/resources/js/libs.js']
				}
			}
		},
		browserify: {
			options: {
				alias: ['src/defaults/index.js:Defaults']
			},
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
			'1.0.4': {
				options: {
					files: [
						'bower_components/angular-1.0.4/angular.js',
						'bower_components/angular-mocks-1.0.4/angular-mocks.js',
						'dist/angular-cache.js',
						'./karma.start.js',
						'test/unit/*.js'
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
						'test/unit/*.js'
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
						'test/unit/*.js'
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
						'test/unit/*.js'
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
						'test/unit/*.js'
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
		concat: {
			libs: {
				src: [
					'doc/resources/js/jquery.js',
					'doc/resources/js/jquery.goto.js',
					'doc/resources/js/jquery.cookie.js',
					'doc/resources/angular/angular.js',
					'doc/resources/angular/angular-bootstrap.js',
					'doc/resources/angular/angular-bootstrap-prettify.js',
					'doc/resources/angular/angular-cookies.js',
					'doc/resources/angular/angular-resource.js',
					'doc/resources/angular/angular-sanitize.js'

				],
				dest: 'doc/resources/js/libs.js'
			},
			scripts: {
				src: [
					'doc/resources/js/docs_module_begin.js',
					'guide/angular-data.js',
					'doc/resources/doc_api_resources/doc_api.js',
					'doc/resources/js/docs_module_end.js',
					'doc/documentation/docs-metadata.js',
					'doc/documentation/groups-metadata.js',
					'doc/documentation/layout-metadata.js'

				],
				dest: 'doc/resources/js/scripts.js'
			},
			css: {
				src: [
					'doc/resources/css/bootstrap.min.css',
					'doc/resources/css/font-awesome.css',
					'doc/resources/css/docular.css',
					'doc/resources/css/custom.css',
					'doc/resources/doc_api_resources/doc_api.css',
					'guide/angular-data.css'
				],
				dest: 'doc/resources/css/styles.css'
			}
		},
		copy: {
			favicon: {
				expand: true,
				cwd: 'guide/',
				src: 'favicon.ico',
				dest: 'doc/',
				flatten: true
			},
			index: {
				expand: true,
				cwd: 'guide/',
				src: 'index.html',
				dest: 'doc/',
				flatten: true
			},
			data_white: {
				expand: true,
				cwd: 'guide/',
				src: 'data_white.png',
				dest: 'doc/resources/img/',
				flatten: true
			},
			chart: {
				expand: true,
				cwd: 'guide/',
				src: 'chart.png',
				dest: 'doc/resources/img/',
				flatten: true
			},
			cream_dust: {
				expand: true,
				cwd: 'guide/',
				src: 'cream_dust.png',
				dest: 'doc/resources/img/',
				flatten: true
			}
		},
		docular: {
			groups: [
				{
					groupTitle: 'Guide',
					groupId: 'guide',
					groupIcon: 'icon-book',
					sections: [
						{
							id: 'overview',
							title: 'Overview',
							docs: ['guide/overview/'],
							rank: {
								index: 1,
								overview: 2,
								resources: 3,
								synchronous: 4,
								asynchronous: 5
							}
						},
						{
							id: 'resource',
							title: 'Defining Resources',
							docs: ['guide/resource/'],
							rank: {
								index: 1,
								overview: 2,
								basic: 3,
								advanced: 4,
								lifecycle: 5
							}
						},
						{
							id: 'queries',
							title: 'Queries',
							docs: ['guide/queries/'],
							rank: {
								index: 1,
								overview: 2
							}
						},
						{
							id: 'adapters',
							title: 'Adapters',
							docs: ['guide/adapters/'],
							rank: {
								index: 1,
								overview: 2
							}
						}
					]
				},
				{
					groupTitle: 'API',
					groupId: 'api',
					groupIcon: 'icon-wrench',
					showSource: true,
					sections: [
						{
							id: 'api',
							title: 'angular-data',
							scripts: [
								'src/',
								'../angular-data/src/'
							],
							docs: ['guide/api']
						}
					]
				}
			],
			docular_webapp_target: 'doc',
			showDocularDocs: false,
			showAngularDocs: false,
			docular_partial_home: 'guide/home.html',
			docular_partial_navigation: 'guide/nav.html',
			docular_partial_footer: 'guide/footer.html'//,
//			analytics: {
//				account: 'UA-46792694-5',
//				domainName: 'angular-cache.codetrain.io'
//			},
//			discussions: {
//				shortName: 'angular-data',
//				url: 'http://angular-cache.codetrain.io',
//				dev: dev
//			}
		},
		coveralls: {
			options: {
				coverage_dir: 'coverage'
			}
		}
	});

	grunt.registerTask('test', ['karma:1.1.5']);
	grunt.registerTask('build', ['clean', 'jshint', 'browserify', 'uglify:main']);
	grunt.registerTask('default', ['build']);

	// Used by the CLI build servers
	grunt.registerTask('test-ci', [
		'karma:1.0.4',
		'karma:1.0.5',
		'karma:1.0.6',
		'karma:1.0.7',
		'karma:1.0.8',
		'karma:1.1.4',
		'karma:1.1.5',
		'karma:1.2.1',
		'karma:1.2.2',
		'karma:1.2.3',
		'karma:1.2.4',
		'karma:1.2.5',
		'karma:1.2.6',
		'karma:1.2.7'
	]);
	grunt.registerTask('doc', ['clean:doc', 'docular', 'concat', 'copy', 'clean:afterDoc', 'uglify:scripts']);
	grunt.registerTask('ci', ['clean', 'jshint', 'copy', 'uglify', 'test-ci', 'coveralls']);
};
