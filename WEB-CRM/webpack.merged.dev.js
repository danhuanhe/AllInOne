/* eslint-disable no-console */
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
import HtmlWebpackIncludeAssetsPlugin from "html-webpack-include-assets-plugin";
// import SubmoduleReferencedStatisticsPlugin from "./tools/SubmoduleReferencedStatisticsPlugin";

import { parseArgvOption, dllConfig } from "./tools/helps";

const { cacheDir, cacheDirName, dllFilename, manifestPath } = dllConfig;

// 导入默认配置
import { default as projectConfig, manifesto } from "./webpack.config.dev";

// 全局默认变量
/** @type {import('./tools/config').DevManifesto} */
export const defaultOptions = {
  progress: false,
  WEB_HOST: null,
  WEB_PORT: 3000,
  WEB_BASEDIR: path.resolve(__dirname, "./source"),
  WEB_ROUTES: undefined,
  WEB_OPEN: false
};

let cliOptions = parseArgvOption(process.argv);

// 压缩混淆代码开关，默认开启，通过REPL运行npm run build -- --minimize=false来修改
Object.assign(defaultOptions, manifesto, cliOptions);

let happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

/**
 * @type {import('webpack').Configuration}
 */
const commonConfig = {
  mode: "development",
  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps
  // and https://webpack.github.io/docs/configuration.html#devtool
  devtool: "cheap-module-source-map",
  target: "web", // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
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
    // new SubmoduleReferencedStatisticsPlugin({
    //   __dirname: __dirname,
    //   submodule: {
    //     url: 'ssh://git@g.hz.netease.com:22222/ysf/web-project/web-common.git',
    //     recorderFolder: 'tools',
    //     excludePathRegex: 'node_modules',
    //   }
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        components: {
          name: "components",
          test: /\/source\/pages\/components/,
          chunks: "all"
        }
      }
    }
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
          loader: "ejs-loader"
        },
        {
          loader: "ftl-loader",
          options: manifesto.ftl
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

if (defaultOptions.progress) {
  commonConfig.plugins.push(
    new webpack.ProgressPlugin((percentage, message, ...args) => {
      // e.g. Output each progress message directly to the console:
      console.log((percentage * 100).toFixed(2) + "%", message, ...args);
    })
  );
}

if (typeof defaultOptions.useDll === "object") {
  // 由于broswersync的baseDir设置为了source文件夹,
  // 所以注入的dll文件在浏览器请求的时候，ajax的请求是相对于source文件夹来的

  commonConfig.plugins.push(
    new HtmlWebpackIncludeAssetsPlugin({
      assets: `${cacheDirName}/${dllFilename}`,
      append: false
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(manifestPath) // eslint-disable-line
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
    "process.env.NODE_ENV": JSON.stringify("development")
  };
  Object.assign(defaultGlobals, manifesto.globals);
  // Tells React to build in prod mode.
  // https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin());
  commonConfig.plugins.push(new webpack.DefinePlugin(defaultGlobals));
}

// 合并公共配置项

/**@type {import('webpack').Configuration} */
let finnalWebpackConfig;
finnalWebpackConfig = merge(commonConfig, projectConfig);

export default finnalWebpackConfig;
