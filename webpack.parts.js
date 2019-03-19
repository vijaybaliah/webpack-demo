exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    historyApiFallback: true,
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true
    }
  }
});

exports.lintJavaScript =({ include, exclude, options }) => ({
  module: {
    rules: [{
        test: /\.js$/,
        include,
        exclude,
        enforce: 'pre',
        loader: 'eslint-loader',
        options
    }]
  }
})
