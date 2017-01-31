import { optimize } from 'webpack'

export default {
  entry: './src/webpack',
  output: {
    path: __dirname,
    filename: 'tweed.min.js',
    library: 'Tweed',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }]
  },
  devtool: 'source-map',
  plugins: [
    new optimize.UglifyJsPlugin()
  ]
}
