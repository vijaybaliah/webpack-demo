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

exports.loadCSS = ({ include, exclude, options }) => ({
  module: {
    rules: [{
      test: /\.css$/,
      include,
      exclude,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options
        },
        {
          loader : 'postcss-loader',
          options : {
            plugins : () => ([ require ( 'autoprefixer' )(), require ( 'precss' ), ]), 
          }
        }
      ],
    }]
  }
})
