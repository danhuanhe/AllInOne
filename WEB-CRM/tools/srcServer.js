/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import childProcess from "child_process";
import Url from "url";
process.env.NODE_ENV = "development";
// This file configures the development web server
// which supports hot reloading and synchronized testing.
// Require Browsersync along with webpack and middleware for it
import browserSync from "browser-sync";
// Required for react-router browserHistory
// see https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-102623643
import historyApiFallback from "connect-history-api-fallback";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import httpProxy from "http-proxy-middleware";

import { patchNeiPort } from "./neiPatch";
import {
  getRouteMiddleware,
  parseArgvOption,
  dllConfig,
  readJSON,
  gatherChunkVersions,
  stringifyObject
} from "./helps";
import { chalkWarning, chalkError, chalkSuccess } from "./chalkConfig";
import { manifesto } from "../webpack.config.dev";
const { cacheDir, cacheDirName, dllPath, manifestPath } = dllConfig;

//=====================  dll 缓存的检查逻辑

/**
 *  0. 如果cli参数中有useDll, 则将其解析为对象或bool，
 *     然后 config.dev.js中useDll的配置 merge 传入的配置。
 *     相当于  useDll = Object.assign(config.useDll, cliArg.useAll)
 *
 *  1. 如果useDll为false，跳过检查，跳过dll打包。
 *  2. 如果useDll为对象,
 *      2.1 如果有cli参数 --buildDll， 则忽略dll缓存，运行dll打包; 否则执行2.2
 *      2.2 如果 缓存文件丢失或者缓存文件夹不存在，则运行dll打包; 否则执行2.3
 *      2.3 如果 package.json 中的depencies有变动，则运行dll打包；如果没有变动，执行2.4
 *      2.4 如果 modifyVars 中的内容有变动，则运行dll打包；如果没有变动，执行2.5
 *      2.5 创建一个Object, 读取当前需要打包到dll中的模块名称作为键名，如果有package.json,则取模块的version 为键值;
 *          没有package.json的，就读取源文件作为键值。将对象序列化为字符串 checklistStr。
 *          读取缓存文件夹下的一个checklist.json文件为字符串，如果文件不存在，或者文件内容与checklistStr不匹配，
 *          就将checklistStr写入checklist.json文件，然后运行dll打包;
 *          如果读取的文件和checklistStr相同，命中缓存，跳过dll打包。
 *
 */

let cliOptions = parseArgvOption(process.argv); // merged中已经处理了cli参数
let defaultOptions = {
  ...manifesto,
  ...cliOptions
};
const { useDll, buildDll } = defaultOptions;
if (useDll === false) {
  startDevBuild();
} else if (typeof useDll === "object") {
  // dll模式开关，默认开启，如果需要关闭，请运行 npm run open:src -- --dll=off

  console.log(
    chalkWarning(
      "当前开发环境编译已开启dll模式，如果需要关闭，请运行 npm run open:src -- --useDll=false\n" +
        "每次启动前将会自动检查dll缓存是否失效，缓存失效时才会重新打包DLL。\n" +
        "可以使用 npm run open:src -- --filter='login|setting|demo' 来只调试3个页面"
    )
  );
  console.log();

  if (buildDll) {
    buildWithoutCache("检测到--buildDll参数"); // Rule 2.1
  } else {
    if (
      !exists(cacheDir) ||
      !exists(dllPath) ||
      !exists(manifestPath) ||
      !exists(cacheDir, "_dependencies") ||
      !exists(cacheDir, "_modifyVars") ||
      !exists(cacheDir, "_chunkList")
    ) {
      buildWithoutCache("DLL缓存文件缺失"); // Rule 2.2
    } else {
      checkDllCache();
    }
  }
} else {
  startDevBuild();
}

//===================== dll检查结束
async function checkDllCache() {
  let stringEqual = (a, b) => stringifyObject(a) === stringifyObject(b);
  let dependencies = (await readJSON(
    path.resolve(__dirname, "../package.json")
  )).dependencies;
  let dependencies$ = await readJSON(path.resolve(cacheDir, "_dependencies"));

  if (stringEqual(dependencies, dependencies$)) {
    let modifyVars = (manifesto.less && manifesto.less.modifyVars) || {};
    let modifyVars$ = await readJSON(path.resolve(cacheDir, "_modifyVars"));
    if (stringEqual(modifyVars, modifyVars$)) {
      const { chunks } = useDll;
      let chunkVersions = await gatherChunkVersions(chunks);
      let chunkVersions$ = await readJSON(path.resolve(cacheDir, "_chunkList"));
      if (stringEqual(chunkVersions, chunkVersions$)) {
        console.log(chalkSuccess("DLL缓存未失效，跳过编译 dll chunk"));
        startDevBuild();
      } else {
        // 将变动输出到终端中
        showDiffs(chunkVersions, chunkVersions$);
        buildWithoutCache("DLL中的chunks的版本有变动"); // Rule 2.2
      }
    } else {
      showDiffs(modifyVars, modifyVars$);
      buildWithoutCache("modifyVars 有变动"); // Rule 2.2
    }
  } else {
    showDiffs(dependencies, dependencies$);
    buildWithoutCache("package.json中的依赖有变动"); // Rule 2.2
  }
}

async function buildWithoutCache(reason) {
  if (reason) {
    console.log(chalkWarning(reason + "，将重新打包dll chunk"));
  }
  await buildDllCache();
  await startDevBuild();
}

function buildDllCache() {
  return new Promise((res, rej) => {
    let buildProcess = childProcess.fork(
      path.resolve(__dirname, "./build.dll.js"),
      [],
      {
        stdio: "inherit"
      }
    );
    buildProcess.on("exit", (code, signal) => {
      if (code !== 0) {
        process.exit(code);
      } else {
        res();
      }
    });
  });
}

function startDevBuild() {
  const {
    default: webpackConfig,
    defaultOptions
  } = require("../webpack.merged.dev");
  const bundler = webpack(webpackConfig);
  /*
const upcaseFirstChar = name => {
  if (!name || typeof name != "string") {
    return "";
  }
  return name.replace(/^\w/, function(a) {
    return a.toUpperCase();
  });
};
 */
  const middlewares = [];
  const { proxy, browserSyncMiddleware, appRoutes, spa } = defaultOptions;
  if (proxy && proxy.length) {
    proxy.forEach(({ neiKey, contextOrUri, config }) => {
      if (neiKey) {
        let url = Url.parse(config.target);
        patchNeiPort(neiKey, url.port || 80);
      }
      middlewares.push(httpProxy(...[contextOrUri, config].filter(Boolean)));
    });
  }

  if (browserSyncMiddleware) {
    middlewares.push(browserSyncMiddleware);
  }

  // 如果有应用配置的appRoutes则将spa的配置逻辑内置至getRouteMiddleware里，否则使用用户设置的spa
  if (appRoutes) {
    middlewares.push(getRouteMiddleware(appRoutes, { spa }));
  } else {
    if (spa) {
      // 使用historyApiFallback做SPA路由
      let spaConfig = undefined;
      if (typeof spa === "object") {
        spaConfig = spa;
      }
      middlewares.push(historyApiFallback(spaConfig));
    }
  }
  middlewares.push(
    webpackDevMiddleware(bundler, {
      // Dev middleware can't access config, so we provide publicPath
      publicPath: webpackConfig.output.publicPath,

      // pretty colored output
      stats: { colors: true },

      // Set to false to display a list of each file that is being bundled.
      noInfo: false

      // for other settings see
      // http://webpack.github.io/docs/webpack-dev-middleware.html
    }),

    // bundler should be the same as above
    webpackHotMiddleware(bundler)
  );

  // Run Browsersync and use middleware for Hot Module Replacement
  browserSync({
    host: defaultOptions.WEB_HOST,
    port: defaultOptions.WEB_PORT,
    ui: {
      port: defaultOptions.WEB_PORT + 1
    },
    server: {
      baseDir: defaultOptions.WEB_BASEDIR,
      routes: {
        ...defaultOptions.WEB_ROUTES,
        ["/" + cacheDirName]: cacheDirName
      }
    },
    middleware: middlewares,
    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: ["source/*.html", "views/*.ftl"],
    open: defaultOptions.WEB_OPEN
  });
}

function showDiffs(a, b) {
  if (typeof a == "object") {
    let keys = Object.keys({ ...a, ...b });
    let diffs = keys.reduce((ret, key) => {
      let version = a[key];
      let version$ = b[key];
      if (version !== version$) {
        ret.push(padRight(key) + " " + chalkError(version$, " => ", version));
      }
      return ret;
    }, []);
    console.log(diffs.join("\n"));
  }
}

function padRight(str, count = 14) {
  if (str.length <= count) {
    return `${str}${Array(count - str.length)
      .fill(" ")
      .join("")}`;
  }
  return str;
}

function exists(...arg) {
  return fs.existsSync(path.resolve(...arg));
}
