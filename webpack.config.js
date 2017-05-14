module.exports = {
  entry: './src/webpack',
  output: {
    path: __dirname,
    filename: 'tweed.min.js',
    library: 'Tweed',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  devtool: 'source-map'
}
