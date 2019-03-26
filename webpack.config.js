const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const parts = require('./webpack.parts');
const webpack = require('webpack');
const glob = require('glob');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
}

const commonConfig = merge([
  {
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
  },
  parts.lintJavaScript({ include: PATHS.app }),
  // parts.loadCSS({
  //   options: {
  //     modules: true,
  //     localIdentName: '[local]--[hash:base64:5]',
  //     importLoaders: 1,
  //   }
  // })
  parts.extractCSS({
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]--[hash:base64:5]',
          importLoaders: 1,
        }
      },
      parts.autoprefix()
    ]
  }),
  parts.lintCSS({ include: PATHS.app })
])

const productionConfig = merge([
  parts.purifyCSS({paths: glob.sync(`${PATHS.app}/**/*.js`, {nodir: true})})
])

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  })
])

console.log('\n====webpack config====:\n', merge(commonConfig, developmentConfig))
console.log('\nrules: ', commonConfig.module.rules[1].use)

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
}
