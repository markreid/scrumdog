/**
 * Config for Webpack
 */

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  context: `${__dirname}/client/src`,
  entry: './js/app.jsx',
  output: {
    filename: 'js/app.js',
    path: `${__dirname}/client/build`,
    library: 'Scrumdog',
  },

  devtool: 'source-map',
// optimize: {
//     minimize: true,
// },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel-loader'],
    }, {
      test: /\.html$/,
      loader: `file?name=[path][name].[ext]&context=${__dirname}/client/build/html`,
    }],
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'index.html',
    }, {
      from: 'css/*.css',
    }]),
  ],
};
