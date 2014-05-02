module.exports = function (config) {
	config.set({
		basePath: './',
		frameworks: ['mocha', 'chai', 'sinon'],
		browsers: ['Firefox', 'PhantomJS'],
		files: [
			'bower_components/angular-1.2.16/angular.js',
			'bower_components/angular-mocks-1.2.16/angular-mocks.js',
			'dist/angular-cache.js',
			'./karma.start.js',
			'test/unit/**/*.js'
		],
		captureTimeout: 60000,
		colors: true,
		logLevel: config.LOG_INFO,
		port: 9876,
		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-phantomjs-launcher',
			'karma-mocha',
			'karma-chai',
			'karma-sinon',
			'karma-coverage'
		],
		runnerPort: 9100,
		singleRun: true,
		autoWatch: false,
		coverageReporter: {
			type: 'lcov',
			dir: 'coverage/'
		},
		preprocessors: {
			'dist/angular-cache.js': ['coverage']
		},
		reporters: ['progress', 'coverage']
	});
};
