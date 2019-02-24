const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const productionConfig = () => commonConfig;

const developmentConfig = () => {
  const config = {
    devServer: {
      watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
      },
      historyApiFallback: true,
      stats: 'errors-only',
      host: process.env.HOST,
      port: process.env.PORT,
      overlay: {
        errors: true,
        warnings: true
      }
    },
    module: {
      rules: [{
          test: /\.js$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            emitWarning: true
          }
      }]
    },
    plugins: [
      ...commonConfig.plugins,
      new webpack.WatchIgnorePlugin([
          path.join(__dirname, 'node_modules')
        ]),
      new webpack.LoaderOptionsPlugin({
          options: {
            failOnWarning: false,
            failOnError: true,
            fix: true,
            outputReport: {
              filePath: 'checkstyle.xml',
              formatter: require('eslint/lib/formatters/checkstyle'),
            }
          }
        })
    ],
  }

  return { ...commonConfig, ...config }
}

const commonConfig = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
}

module.exports = (env) => {
  if (env === 'production') {
    return productionConfig();
  }

  return developmentConfig();
}
