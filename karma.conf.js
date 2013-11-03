module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine'],
        browsers: ['Firefox', 'PhantomJS'],
        files: [
            'bower_components/angular-1.1.5/angular.min.js',
            'bower_components/angular-mocks-1.1.5/angular-mocks.js',
            'src/angular-cache.js',
            'test/karma.start.js',
            'test/*.js'
        ],
        captureTimeout: 60000,
        colors: true,
        exclude: ['dist/'],
        logLevel: config.LOG_INFO,
        port: 9876,
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
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
            'src/angular-cache.js': ['coverage']
        },
        reporters: ['progress', 'coverage']
    });
};