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
    filename: '[name].js',
    chunkFilename: '[name].js',
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
