const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
// TODO @rendalf try out mini-css-extract-plugin when it gets ready
// TODO @rendalf try to get use of "disable" option and move plugin to base config
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
})
