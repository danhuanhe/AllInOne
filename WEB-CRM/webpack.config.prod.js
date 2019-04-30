import path from "path";
import lessToJs from "less-vars-to-js";
import fs from "fs";
import CopyWebpackPlugin from "copy-webpack-plugin";

import { selectEntriesAndTemplates, parseArgvOption } from "./tools/helps";

// 首页URL
const landingPath = "/index/page/";

//解析命令行参数，如果过需要根据cli参数配置publicPath，可以从这里取
const cliOptions = parseArgvOption(process.argv);

// 自定义组件主题文件
const themeVariables = lessToJs(
  fs.readFileSync(
    path.join(__dirname, "./source/assets/css/lib/ppfish-theme-vars.less"),
    "utf8"
  )
);

/**
 *  url和模板的映射文件，线上服务器的url 可能填写的是 /setting/ 就能访问到 /views/ysf/index.ftl
 *  可以参考nei上配置的url和页面模板的映射
 *  可以在下面对这个配置进行修改
 */
let appRoutes = require("./source/appRoutes.js").default;

/**
 * 根据 entriesGlob 的表达式，在 source/entries目录下获取js文件，作为返回的entries.
 * 根据 viewsGlob 的表达式，在 views 目录下获取页面模板文件，作为返回的templates.
 * viewsIgnore 是忽略在views目录下匹配到的文件，不加入返回的templates
 * appRoutes 是会根据配置的模板，加入到templates中.
   views/setting/foo.ftl ,将会删除掉前缀 `views/`后文件名后缀`.ftl` 然后将最后一级的`foo`替换为`entry`
   得到 setting/entry. 然后将`/`符号替换成`_`下划线。
   例如：
    views/one/two/four/template.ftl -> one_two_four_entry
    source/pages/one/two/four/template.html -> one_two_four_entry
    source/pages/one/two/four/entry.js -> one_two_four_entry
 */
const { entries, templates } = selectEntriesAndTemplates({
  production: true,
  appRoutes: appRoutes,
  entriesGlob: "source/pages/**/entry.js",
  viewsGlob: "views/**/*.ftl"
  // viewsIgnore: ["views/common/**"]
});

// for (let entrieFiles of Object.values(entries)) {
//   // 自定义处理entries，这里我们要注入的是热更新的客户端代码还有一个publicPath文件，
//   // 这样就不用去污染source里的代码，引入不必要的文件
//   entrieFiles.unshift(
//     '引入只用于线上环境的代码'
//   );
// }

/*
自定义entry
entries['SameNameA']=['自定义的entry路径']
*/

templates.forEach(template => {
  Object.assign(template, {
    // 默认 ftl文件会被打包到 dist/templates目录下，如果希望改成其他路径，请用正则替换filename
    // filename: template.filename.replace('dist'+path.sep+'templates','dist'+path.sep+'views')
    inject: false,
    minify: false // ftl模板这个必须关闭，否则将会parseError
    //chunks: template.chunks.concat(["vendors", "libs"]),// 加入其他的Chunk
  });
});

/*
自定义template
templates.push({
  filename:"source/filename.html",//这个是输出文件路径. (appRoutes.js)
  template: path.resolve(__dirname, "../diyFolder", '这里才是模板文件.html'),//这里是模板文件路径
  chunks: ['SameNameA'], // chunkName
  inject:'head'
})
*/

// 将会覆盖webpack 配置的内容
/**
 * @type {import('webpack').Configuration}
 * */
const customConfig = {
  entry: entries,
  output: {
    path: `${__dirname}/dist/static`,
    publicPath: "/public/",
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js"
  },
  plugins: [
    // views/common文件夹直接拷贝到dist, to的路径相对于publicPath
    // new CopyWebpackPlugin([
    //   {
    //     context: "./views/",
    //     from: "./common/**/*",
    //     to: "../templates"
    //   }
    // ]),
    new CopyWebpackPlugin([
      {
        context: "./source/vendor/",
        from: "**/*",
        to: "./vendor"
      }
    ])
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        libs: {
          name: "libs", //不怎么变的基础库
          // eslint-disable-next-line max-len
          test: /node_modules\/(babel-polyfill|react|react-dom|axios|react-router|redux|react-redux|react-router-redux|lodash|core-js|rc-trigger|history|rc-animate|buffer)/,
          chunks: "all",
          priority: 1
        },
        vendors: {
          //其他所有的第三方库
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          priority: -10,
          enforce: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};

/**
 * @type {import('./tools/config').BuildManifesto}
 */
export const manifesto = {
  cleanBuild: ["dist"], // 打包将会清理的文件或文件夹
  spa: { index: landingPath, verbose: true }, //是否是单页应用
  appRoutes: appRoutes,
  // webpack输入的内容的一些声明
  typescript: true, //true表示启用功能，如果是一个object，则为传递给loader的配置项。
  globals: {
    __DEV__: false
  },
  ftl: {
    dataPath: path.resolve(__dirname, "ftl-mocks"),
    templatePath: path.resolve(__dirname, "dist/templates")
  },
  less: {
    modifyVars: themeVariables
  },
  templatePages: templates,
  // 编译过程中的配置
  bundleAnalyze: false,
  progress: false,
  minimize: true, // 是否压缩代码

  // 端口和host名称设置
  // WEB_HOST: "localhost",
  WEB_PORT: 3000,
  WEB_BASEDIR: path.resolve(__dirname, "dist/static"),
  WEB_ROUTES: {
    "/public": path.resolve(__dirname, "dist/static")
  },
  WEB_OPEN: false,
  proxy: [
    {
      neiKey: "1cd1d5dd82196a9c30f8568abb35353a",
      contextOrUri: "/api",
      config: {
        target: "http://localhost:8002",
        changeOrigin: true,
        ws: true
      }
    }
  ],
  browserSyncMiddleware: (req, res, next) => {
    if (req.url === "/") {
      // 首页重定向
      res.writeHead(302, { Location: landingPath });
      // eslint-disable-next-line no-console
      console.log("browserSyncMiddleware ", "重定向");
      res.end();
    } else {
      next();
    }
  }
};

export default customConfig;
