const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const ROOT_PATH = path.join(__dirname, '..')

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
    new CleanWebpackPlugin(['dist'], {
      root: ROOT_PATH,
    }),
    new HtmlWebpackPlugin({
      title: 'Some Day it will become a PWA',
    }),
  ],
}
