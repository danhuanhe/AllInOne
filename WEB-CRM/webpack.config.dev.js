/* eslint-disable no-console */

import path from "path";
import fs from "fs";
import lessToJs from "less-vars-to-js";

import { parseArgvOption, selectEntriesAndTemplates } from "./tools/helps";

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
 *  可以参考nei上配置的url和页面模板的映射。
 *  可以在下面对这个配置进行修改
 */
const appRoutes = require("./source/appRoutes.js").default;

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
  appRoutes: appRoutes,
  entriesGlob: "source/pages/**/entry.js",
  entriesIgnore: [],
  viewsGlob: "views/**/*.ftl",
  viewsIgnore: ["views/common/**"]
});

for (let entrieFiles of Object.values(entries)) {
  // 自定义处理entries，这里我们要注入的是热更新的客户端代码还有一个publicPath文件，
  // 这样就不用去污染source里的代码，引入不必要的文件
  entrieFiles.unshift(
    "./source/utils/webpackPublicPath",
    "webpack-hot-middleware/client?reload=true"
  );
}

/*
自定义entry
entries['SameNameA']=['自定义的entry路径']
*/

templates.forEach(template => {
  // 自定义处理template，这里我们要注入的是热更新的客户端代码还有一个publicPath文件
  Object.assign(template, {
    inject: false // 脚手架关闭了inject，因为脚手架里手动控制script标签的注入。
    //chunks: [...template.chunks,'vendors','libs']
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
 */
let projectConfig = {
  entry: entries,
  output: {
    path: `${__dirname}/dist`, // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: "/",
    filename: "[name].js"
  },
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
  }
};
/** @type {import('./tools/config').DevManifesto} */
const manifesto = {
  /**
   * 全局相关
   */
  spa:{index: landingPath},
  appRoutes: appRoutes,
  /**
   * webpack输入相关
   */
  typescript: true,
  globals: {
    __DEV__: true
  },
  ftl: {
    // 指定ftl的mock数据的路径
    dataPath: path.resolve(__dirname, "./ftl-mocks"),
    // 指定ftl模板的路径
    templatePath: path.resolve(__dirname, "./views")
  },
  less: {
    modifyVars: themeVariables
  },
  templatePages: templates,
  useDll: {
    chunks: Object.keys(require("./package.json").dependencies)
  },
  /**
   * webpack 开发过程中相关
   */
  progress: false, // 输出webpack打包进度
  // WEB_HOST: "localhost",
  WEB_PORT: 4000,
  WEB_BASEDIR: path.resolve(__dirname, "source"),
  WEB_ROUTES: {
    "/public": path.resolve(__dirname, "source") // 解决图标的public path
  },
  WEB_OPEN: false, // 自动打开页面
  proxy: [
    {
      // 配置neikey以后，可以自动修改nei server.config.js里的端口
      neiKey: "fab54b3759463d14e32021f352fd8541",
      config: {
        changeOrigin: true,
        target: "http://localhost:9001",
        ws: true
      },
      contextOrUri: ["/api", "/crm/api"]
    },
    {
      contextOrUri: "/db/api",
      config: {
        target: "http://localhost:9001",
        changeOrigin: true,
        ws: true
      }
    }
  ],
  browserSyncMiddleware: (req, res, next) => {
    if (req.url === "/") {
      // 首页重定向
      res.writeHead(302, { Location: landingPath });
      res.end();
    } else {
      next();
    }
  }
};

export default projectConfig;
export { manifesto };
