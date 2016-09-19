module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai', 'sinon'],
    browsers: ['Chrome'],
    // browsers: ['PhantomJS'],
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/cachefactory/dist/cachefactory.es2015.js',
      'src/index.js',
      'test/_setup.js',
      'test/**/*.js'
    ],
    captureTimeout: 60 * 1000,
    colors: true,
    logLevel: config.LOG_INFO,
    port: 9876,
    plugins: [
      'karma-sourcemap-loader',
      'karma-babel-preprocessor',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-sinon',
      'karma-coverage'
    ],
    runnerPort: 9100,
    singleRun: false,
    autoWatch: true,
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    preprocessors: {
      'node_modules/cachefactory/dist/cachefactory.es2015.js': ['babel'],
      'src/index.js': ['babel', 'coverage', 'sourcemap'],
      'test/**/*.js': ['babel', 'sourcemap']
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        plugins: [
          'transform-es2015-modules-umd'
        ],
        sourceMap: 'inline'
      }
    },
    reporters: ['progress', 'coverage']
  })
}
