const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ServiceWorkerPlugin = require('serviceworker-webpack-plugin')

const ROOT_PATH = path.join(__dirname, '..')
const SOURCE_PATH = path.join(ROOT_PATH, 'src')
const SERVICE_WORKER_PATH = path.join(SOURCE_PATH, 'sw.ts')

module.exports = {
  entry: {
    app: path.resolve(SOURCE_PATH, 'index.ts'),
  },

  resolve: {
    modules: [
      SOURCE_PATH,
      'node_modules',
    ],
    extensions: ['.tsx', '.ts', '.js'],
    symlinks: false,
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 4,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: SOURCE_PATH,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: SOURCE_PATH,
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
      template: path.resolve(SOURCE_PATH, 'templates', 'index.html'),
      excludeChunks: ['sw'],
    }),
    new ServiceWorkerPlugin({
      entry: SERVICE_WORKER_PATH,
    }),
  ],
}
