const path = require('path')
const webpack = require('webpack')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    site: './site/index.js',
  },
  output: {
    filename: '[name].js',
    // The output directory as an absolute path.
    path: path.resolve(__dirname, 'site/public'),
    // This option specifies the public URL of the output directory when referenced in a browser. 
    // The full path in browser is localhost/output.js
    // publicPath: path.resolve(__dirname, '/site/public'),
    publicPath: '',
  },
  // css run before style
  module: {
    rules: [
      {
        test: /\.less$|\.css$/,
        include: path.resolve(__dirname, '/node_modules/'),
        loader: 'style-loader!css-loader!less-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
      {
        test: /\.less$|\.css$/,
        exclude: [
          path.resolve(__dirname, '/site/styles/base.less'),
          '/node_modules/',
          // path.resolve(__dirname, '/node_modules/'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new ExtractTextPlugin('styles.css'),
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'site/public'),
  },
}

