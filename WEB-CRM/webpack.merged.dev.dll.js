/* eslint-disable no-console */
import webpack from "webpack";
import path from "path";

import os from "os";
import HappyPack from "happypack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { manifesto } from "./webpack.config.dev";
import { dllConfig } from "./tools/helps";

const { cacheDir, cacheDirName, dllFilename, manifestPath } = dllConfig;

let useDll = manifesto.useDll;

let dynamicLinkedLibrary =
  useDll && useDll.chunks
    ? useDll.chunks
    : Object.keys(require("./package.json").dependencies);

/**
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  mode: "development",
  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps
  // and https://webpack.github.io/docs/configuration.html#devtool
  devtool: "cheap-module-source-map",
  entry: {
    dynamicLinkedLibrary: dynamicLinkedLibrary
  },
  target: "web", // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: cacheDir, // Note: Physical files are only output by the production build task `npm run build`.
    library: "[name]_[chunkhash]",
    filename: dllFilename
  },
  plugins: [
    new webpack.DllPlugin({
      path: manifestPath,
      name: "[name]_[chunkhash]",
      context: __dirname
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ].concat(getHappyPackPlugin()),
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, "source")],
        use: ["happypack/loader?id=happyTS"]
      },
      {
        test: /\.jsx?$/,
        use: ["happypack/loader?id=happyJS"]
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [{ loader: "file-loader" }]
      },
      {
        test: /\.(woff|woff2)$/,
        use: [{ loader: "url-loader?limit=100000" }]
      },
      {
        test: /\.ttf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: "file-loader?limit=10000&mimetype=application/octet-stream"
          }
        ]
      },
      {
        test: /\.svg(\?v=\d+.\d+.\d+)?$/,
        use: [{ loader: "file-loader?limit=10000&mimetype=image/svg+xml" }]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{ loader: "file-loader" }]
      },
      {
        test: /\.ico$/,
        use: [{ loader: "file-loader?name=[name].[ext]" }]
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "less-loader",
            options: manifesto.less ? manifesto.less : undefined
          }
        ]
      },
      {
        test: /(\.html)$/,
        use: [{ loader: "ejs-loader" }]
      }
    ]
  },
  // 定义loader从哪里搜索
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "tools/loader")]
  }
};

if (manifesto.globals) {
  let defaultGlobals = {
    "process.env.NODE_ENV": JSON.stringify("development"),
    __DEV__: true
  };
  Object.assign(defaultGlobals, manifesto.globals);
  // Tells React to build in prod mode.
  // https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin());
  commonConfig.plugins.push(new webpack.DefinePlugin(defaultGlobals));
}

export default commonConfig;

function getHappyPackPlugin() {
  let happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

  return [
    new HappyPack({
      id: "happyTS",
      loaders: [
        {
          loader: "ts-loader",
          options: { happyPackMode: true }
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    }),
    new HappyPack({
      id: "happyJS",
      loaders: [
        {
          loader: "babel-loader"
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    }),
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
  ];
}
