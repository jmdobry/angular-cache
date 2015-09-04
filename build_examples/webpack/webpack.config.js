module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'angular-cache': '../../dist/angular-cache.js'
    }
  }
};
