module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['jasmine'],
        autoWatch: true,
        browsers: ['Chrome'],
        captureTimeout: 60000,
        colors: true,
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        exclude: ['dist/'],
        files: [
            'test/vendor/angular-1.1.5.min.js',
            'test/vendor/angular-mocks-1.1.5.js',
            'src/angular-cache.js',
            'test/*.js'
        ],
        logLevel: config.LOG_DEBUG,
        port: 9876,
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage'
        ],
        preprocessors: {
            'src/angular-cache.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        runnerPort: 9100,
        singleRun: false
    });
};