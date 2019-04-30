const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let host = '127.0.0.1';
let watchOptions = {
  poll: false,
};

if (process.env.DOCKER_MODE == 'true') {
  host = '0.0.0.0';
  watchOptions = {
    poll: 600, // docker 环境，watch不起作用
  }
}


module.exports = {
  mode: 'development',
  entry: {
    main: [
      'webpack-dev-server/client?http://' + host + ':8099', // HMR必须
      'webpack/hot/only-dev-server',   // HMR必须
      './site/index'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      // fixme 去掉硬编码
      ppfish: path.resolve(__dirname, 'node_modules/ppfish/dist/ppfish.min'),
      'react-md-translator': path.resolve(__dirname, 'node_modules/react-md-translator/')
    }
  },
  // sourc-map
  devtool: 'inline-source-map',
  devServer: {
    host: host,
    contentBase: path.resolve(__dirname, 'dist'),  // webpack-dev-server可访问文件目录
    hot: true,   // HMR必须
    port: 8099,
    disableHostCheck: true,
    watchOptions: watchOptions
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            require('@babel/plugin-syntax-dynamic-import'),
            require('@babel/plugin-proposal-class-properties'),
            require("@babel/plugin-proposal-export-default-from")
          ]
        }
      }],
      exclude: /node_modules/
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.(png|svg|jpg|gif|ico)$/,
      use: [
        'file-loader'
      ]
    }, {
      test: /\.md$/,
      use: [{
        loader: 'raw-loader'
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './site/index.html'),
      favicon: path.join(__dirname, './site/assets/favicon.ico'),
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(), // HMR必须
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
  ]
};
