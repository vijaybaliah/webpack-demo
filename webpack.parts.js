const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');

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

// Deprecate loadcss
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

exports.extractCSS = ({ include, exclude, use, env }) => {
  // TODO: seperate development and prod
  // ref: https://github.com/webpack-contrib/mini-css-extract-plugin
  const plugin = new MiniCssExtractPlugin({
    filename: '[name].css'
  });

  return {
    module: {
      rules: [{
        test: /\.css$/,
        include,
        exclude,
        use: [
          MiniCssExtractPlugin.loader,
          ...use
        ]
      }]
    },
    plugins: [plugin]
  }
}

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options : {
    plugins : () => ([
      require('autoprefixer')()
    ]), 
  }
})

exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths })
  ]
})

