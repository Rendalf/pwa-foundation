const path = require('path')

const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const ROOT_PATH = path.join(__dirname, '..')
const SOURCE_PATH = path.join(ROOT_PATH, 'src')

module.exports = merge(baseConfig, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: '/',
  },

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
        test: /\.tsx?$/,
        include: SOURCE_PATH,
        use: [
          'ts-loader',
        ],
      },
      {
        test: /\.css$/,
        include: SOURCE_PATH,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
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
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: SOURCE_PATH,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[hash:base64:7].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // if you need concat css files from all entries, you need:
    // 1) use cacheGroup styles, but you will have styles.js file;
    // 2) use extract-text-webpack-plugin, but you'll change hash of css file very compilation.
    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css',
    }),
  ],
})
