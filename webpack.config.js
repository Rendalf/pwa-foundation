const path = require('path')

// TODO @rendalf try out mini-css-extract-plugin when it gets ready
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  mode: NODE_ENV === 'development' ? 'development' : 'production',

  entry: {
    app: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    hotOnly: true,
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          'ts-loader',
        ],
      },
      {
        test: /\.css$/,
        use: NODE_ENV === 'development'
          ? [
              'style-loader',
              'css-loader',
            ]
          : ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader',
            }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      }
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'Some Day it will become a PWA',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}
