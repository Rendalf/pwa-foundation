const path = require('path')

const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')

const ROOT_PATH = path.join(__dirname, '..')
const SOURCE_PATH = path.join(ROOT_PATH, 'src')

module.exports = merge(baseConfig, {
  mode: 'development',

  devtool: 'eval-source-map',

  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: '/',
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    hotOnly: true,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: SOURCE_PATH,
        use: [
          'ts-loader',
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        include: SOURCE_PATH,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[folder]_[local]-[hash:base64:5]',
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, 'postcss.config.js'),
              },
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
})
