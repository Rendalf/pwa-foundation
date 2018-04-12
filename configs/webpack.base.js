const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.ts',
    helper: './src/helper.ts',
  },

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  // TODO @rendalf check default cacheGroup from here:
  // https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 4,
      automaticNameDelimiter: '-',
      name: true,
    },
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
    new HtmlWebpackPlugin({
      title: 'Some Day it will become a PWA',
    }),
  ],
}
