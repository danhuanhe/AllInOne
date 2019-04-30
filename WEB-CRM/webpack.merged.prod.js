import path from "path";
import fs from "fs";
import os from "os";

// webpack
import webpack from "webpack";
import merge from "webpack-merge";
import HappyPack from "happypack";
// webpack plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

// Other tools

import { parseArgvOption } from "./tools/helps";

// Webpcack config
import { default as projectConfig, manifesto } from "./webpack.config.prod";

// 先处理manifesto里的声明，设置flag标志位。
/** @type {import('./tools/config').BuildManifesto} */
export const defaultOptions = {
  cleanBuild: "dist",
  minimize: true,
  uglifyParallel: true,
  bundleAnalyze: false,
  progress: false,
  WEB_HOST: null,
  WEB_PORT: 3000,
  WEB_BASEDIR: projectConfig.output.path,
  WEB_ROUTES: undefined,
  WEB_OPEN: false
};
let cliOptions = parseArgvOption(process.argv);
// 压缩混淆代码开关，默认开启，通过REPL运行npm run build -- --minimize=false来修改
Object.assign(defaultOptions, manifesto, cliOptions);

let { minimize } = defaultOptions;
const sourceMap = !minimize;

//
if (
  os.platform() === "linux" &&
  os
    .release()
    .toLowerCase()
    .includes("microsoft")
) {
  defaultOptions.uglifyParallel = false;
} //https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/302

/**
 *  Happypack config
 */
let happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// more info: https://github.com/isaacs/node-glob
//const newEntries = getEntries(["./source/entries/**/*.js"]);

/**
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  mode: "production",
  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps
  // and https://webpack.github.io/docs/configuration.html#devtool
  devtool: sourceMap ? "cheap-module-source-map" : false,
  //entry: newEntries,
  target: "web", // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: `${__dirname}/dist/static`,
    publicPath: "/public/",
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[name].[contenthash].chunk.css" // for dynamic import
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
    })
  ], // ROOT.plugins end
  optimization: {
    minimize: minimize,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: sourceMap,
        uglifyOptions: {
          compress: minimize
        },
        cache: true,
        parallel: defaultOptions.uglifyParallel
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [{ loader: "happypack/loader?id=happyJS" }]
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
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              minimize: minimize,
              sourceMap: sourceMap
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: sourceMap
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: sourceMap,
              ...(manifesto.less || {})
            }
          }
        ]
      }
    ]
  },
  // 定义loader从哪里搜索
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "tools/loader")]
  }
};

if (manifesto.typescript) {
  commonConfig.plugins.unshift(
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
    new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
  );
  commonConfig.module.rules.unshift({
    test: /\.tsx?$/,
    include: [path.resolve(__dirname, "source")],
    use: [{ loader: "happypack/loader?id=happyTS" }]
  });
}

if (manifesto.ftl) {
  commonConfig.plugins.unshift(
    new HappyPack({
      id: "happyFTL",
      loaders: [
        {
          loader: "ftl-loader-prod"
        }
      ],
      threadPool: happyThreadPool,
      verbose: true
    })
  );
  commonConfig.module.rules.unshift({
    test: /(\.ftl)$/,
    use: [{ loader: "happypack/loader?id=happyFTL" }]
  });
}

if (defaultOptions.bundleAnalyze) {
  commonConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static"
    })
  );
}

if (defaultOptions.progress) {
  commonConfig.plugins.push(
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      // e.g. Output each progress message directly to the console:
      //eslint-disable-next-line no-console
      console.log((percentage * 100).toFixed(2) + "%", message, ...args);
    })
  );
}

if (manifesto.templatePages) {
  commonConfig.plugins.push(
    ...manifesto.templatePages.map(o => new HtmlWebpackPlugin(o))
  );
}

if (manifesto.globals) {
  let defaultGlobals = {
    "process.env.NODE_ENV": JSON.stringify("production")
  };
  Object.assign(defaultGlobals, manifesto.globals);
  commonConfig.plugins.push(new webpack.DefinePlugin(defaultGlobals));
}

// 合并公共配置项

/**
 * @type {import('webpack').Configuration}
 */
let finnalWebpackConfig;
finnalWebpackConfig = merge(commonConfig, projectConfig);

export default finnalWebpackConfig;
