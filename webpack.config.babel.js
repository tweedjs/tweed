import { optimize } from 'webpack'

export default {
  entry: './dist/index',
  output: {
    path: __dirname,
    filename: 'tweed.min.js',
    library: 'Tweed',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  plugins: [
    new optimize.UglifyJsPlugin()
  ]
}
