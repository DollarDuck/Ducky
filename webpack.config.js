const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
if (isDev) require('./secrets')

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: [
    '@babel/polyfill', // enables async-await
    './client/index.js'
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.TWILIO_SID': JSON.stringify(process.env.TWILIO_SID),
      'process.env.TWILIO_TOKEN': JSON.stringify(process.env.TWILIO_TOKEN)
    })
  ]
}
