// Karma configuration
// Generated on Tue May 21 2013 18:52:40 GMT-0600 (Mountain Daylight Time)

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    'http://code.angularjs.org/1.1.5/angular.min.js',
    'http://code.angularjs.org/1.1.5/angular-mocks.js',
    'src/angular-cache.js',
    'test/angular-cacheSpec.js'
];

// list of files to exclude
exclude = [
    'dist/'
];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'coverage'];

preprocessors = {
    'src/angular-cache.js': 'coverage'
};

coverageReporter = {
    type: 'html',
    dir: 'coverage/'
};

// web server port
port = 9876;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

var os = require('os');
if (os.platform() !== 'win32') {
    process.env.PHANTOMJS_BIN = './node_modules/phantomjs/lib/phantom/bin/phantomjs';
} else {
    process.env.PHANTOMJS_BIN = './node_modules/phantomjs/lib/phantom/phantomjs.exe';
}

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
