const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
// if you need concat css files from all entries, you need:
// 1) use cacheGroup styles, but you will have styles.js file;
// 2) use extract-text-webpack-plugin, but you'll change hash of css file very compilation.
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',

  devtool: 'source-map',

  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         // test: /\.css$/,
  //         test: (module) => module.nameForCondition
  //           && /\.css$/.test(module.nameForCondition())
  //           && !/^javascript/.test(module.type),
  //         chunks: 'all',
  //         enforce: true,
  //       },
  //     },
  //   },
  // },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
  ],
})
