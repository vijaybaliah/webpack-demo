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
  parts.lintCSS({ include: PATHS.app }),
  parts.loadFonts({
    options: {
      name: '[name].[ext]'
    }
  }),
  parts.loadJavaScripts({
    include:  PATHS.app
  })
])

const productionConfig = merge([
  parts.clean(),
  // {
  //   entry: {
  //     vendor: ['react']
  //   }
  // },
  // {
  //     plugins: [
  //     new webpack.optimize.CommonsChunkPlugin({
  //       name: 'vendor'
  //     }),
  //   ]
  // },
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.purifyCSS({paths: glob.sync(`${PATHS.app}/**/*.js`, {nodir: true})}),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]'
    }
  })
])

const developmentConfig = merge([
  {
    output: {
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
  },
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT
  }),
  parts.loadImages(),
])

console.log('\n====webpack config====:\n', merge(commonConfig, developmentConfig))
console.log('\nrules: ', commonConfig.module.rules[1].use)

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
}
