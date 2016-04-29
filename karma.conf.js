module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['PhantomJS'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'dist/angular-cache.js',
      './karma.start.js',
      'test/**/*.js'
    ],
    captureTimeout: 60000,
    colors: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    plugins: [
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
  })
}
