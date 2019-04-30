/* eslint-disable no-console */
import path from "path";
import fs from "fs";
import glob from "glob";
import Freemarker from "freemarker.js";
import HistoryApiFallback from "connect-history-api-fallback";

export function readJSON(file) {
  return new Promise((res, rej) => {
    fs.readFile(path.resolve(file), (err, data) => {
      if (err) rej(err);
      else res(JSON.parse(data.toString()));
    });
  });
}

export function writeJSON(file, json) {
  return new Promise((res, rej) => {
    fs.writeFile(
      path.resolve(file),
      JSON.stringify(json, Object.keys(json).sort(), 2),
      err => {
        if (err) rej(err);
        else res();
      }
    );
  });
}

/**
 *  脚手架内的一些常量
 */

// dll打包的输出目录
const cacheDirName = "__dllCache__";
const cacheDir = path.resolve(__dirname, "../", cacheDirName);

// dll打包出来的chunk文件名称，用户可以自定义
const dllFilename = "dll.dependencies.js";

// dll内的资源索引文件，包含那个库文件对应的hash值
const manifestPath = path.resolve(cacheDir, "manifest.json");
const dllPath = path.resolve(cacheDir, dllFilename);
export const dllConfig = {
  cacheDirName,
  cacheDir,
  dllFilename,
  manifestPath,
  dllPath
};

//需要转换为对象的命令行参数
const CLI_OPTIONS_TO_PARSE = ["proxy", "useDll", "ftl"];
const CLI_OPTIONS_ARR = ["filter", "cleanBuild"];
// 不允许为true的命令行参数
const OPTION_FILTER_TURTHY = ["useDLl", "filter", "ftl", "proxy"];
// 不需要的无效信息前缀
export const prefixNeedRemove = /^(views|source\/pages)\//;
export const getEntryChunkName = (
  file,
  transform = x => x.replace("/", "_"),
  prefix = prefixNeedRemove,
  suffix = /\.(jsx?|tsx?)$/
) => transform(file.replace(prefix, "").replace(suffix, ""));

export const getViewChunkName = (
  file,
  transform = x => x.replace(/\/([^/]+)$/, "/entry").replace("/", "_"),
  prefix = prefixNeedRemove,
  suffix = /\.(ftl|html|ejs)$/
) => transform(file.replace(prefix, "").replace(suffix, ""));
/**
 * @param {String} key
 */

/**
 * 解析process.argv数组，返回options对象
 * @example
 *    let options = parseArgvOption(process.argv);
 * @param {String[]} argv
 * @returns {Object}
 */
export const parseArgvOption = argv => {
  if (argv.length == 2) return {};
  argv = argv.slice(2);
  const regx = /^--([\w\d-]+)(=(.+))?$/i;
  return argv.reduce((options, argStr) => {
    let matched = regx.exec(argStr);
    if (matched) {
      let key = matched[1];
      let value = matched[3];
      if (matched[2] === undefined) {
        // argv : --enableCache
        value = true;
      } else {
        // argv : --cacheDir=/home/mathin/.cache
        if (value === "false") {
          value = false;
        } else if (value === "true") {
          value = true;
        }
      }

      if (typeof value !== "boolean") {
        if (CLI_OPTIONS_TO_PARSE.includes(key)) {
          value = JSON.parse(`"${value}"`);
        }

        if (CLI_OPTIONS_ARR.includes(key)) {
          value = value.split("|");
        }
      }
      // 过滤掉一些不需要的参数
      // 1.过滤掉 useDll:true, 只允许 false 和对象
      if (OPTION_FILTER_TURTHY.includes(key) && value === true) {
        return options;
      }
      options[key] = value;
    }
    return options;
  }, {});
};

/** 从配置的路径中读取url的映射信息
 * @type {import('./config').selectEntriesAndTemplates}
 */
export const selectEntriesAndTemplates = function({
  production,
  appRoutes,
  viewsGlob,
  viewsIgnore,
  entriesGlob,
  entriesIgnore
}) {
  if (typeof appRoutes === "string") {
    throw new Error("appRoutes 不能为字符串");
  }

  const projetctDir = path.resolve(__dirname, "../");
  // 第一步 根据给出的glob选出文件
  let templateFiles = glob.sync(viewsGlob, {
    cwd: projetctDir,
    ignore: viewsIgnore,
    nodir: true
  });

  let entryFiles = glob.sync(entriesGlob, {
    cwd: projetctDir,
    ignore: entriesIgnore,
    nodir: true
  });

  const pagesTester = /source\/pages/g;

  // 对配置的appRoutes进行分类 ，找出source/pages下的模板和使用插件自带模板的配置
  let allTemplates = Object.keys(appRoutes).map(key => appRoutes[key]);
  let objectTemplates = allTemplates.filter(
    template => typeof template === "object"
  );
  let pagesFiles = allTemplates.filter(
    template => typeof template === "string" && pagesTester.test(template)
  );

  // 过滤文件处理
  let cliOptions = parseArgvOption(process.argv);
  let { filter } = cliOptions;
  if (typeof filter === "string") {
    filter = [filter];
  }
  if (filter) {
    console.log("Using filter :", filter);
    let filterFiles = file => filter.some(str => file.search(str) > -1);

    templateFiles = templateFiles.filter(filterFiles);
    entryFiles = entryFiles.filter(filterFiles);
    pagesFiles = pagesFiles.filter(filterFiles);
    console.log("templateFiles: ", templateFiles);
    console.log("entryFiles   : ", entryFiles);
    console.log("pagesFiles   : ", pagesFiles);
  }

  // 第二步，处理entries

  let entries = entryFiles.reduce((entries, entryFile) => {
    const chunkName = getEntryChunkName(entryFile);
    entries[chunkName] = [path.resolve(__dirname, "../", entryFile)];
    return entries;
  }, {});

  // 第三步，处理views下面的模板

  const getTemplateFilename = filename => {
    // 在浏览器访问到真实文件其实是由browserSync和webpackDevMiddleware这两个中间件提供内容的。
    // 在开发阶段，不会替换模板的路径，所以可以通过
    // localhost:3000/views/setting/setting.ftl  localhost:3000/source/pages/setting/setting.html  访问到文件
    // 是因为filename是 views/setting/setting.ftl, 内容是由 devMiddleware提供的。
    // 能够访问到vendor下面的文件是因为设置了WEB_BASEDIR. 是由browsersync提供的。

    // filename是可以控制输出文件的目录的
    if (production) {
      // 在生产阶段，需要把ftl移动到templates下面，还有把 source/pages/a/a.html, 去掉source/pages这样的路径，
      // 这样在outpath下的文件就不会有source/pages 这样冗余的文件夹了
      // filename - views/setting/setting.ftl
      // 把views替换成 templates, 然后放到"dist/templates"下面，而不是static下面
      let prodPath = filename.replace(prefixNeedRemove, "");
      if (/\.ftl/i.test(prodPath)) {
        return path.resolve(__dirname, "../dist/templates", prodPath);
      }
      return prodPath;
    } else {
      return filename;
    }
  };

  let templates = templateFiles.map(templateFile => {
    let chunkName = getViewChunkName(templateFile);
    return {
      filename: getTemplateFilename(templateFile),
      template: path.resolve(__dirname, "../", templateFile),
      chunks: [chunkName]
    };
  });

  // 第四步，处理pages下面的模板。
  templates = templates.concat(
    pagesFiles.map(pageFile => {
      let chunkName = getViewChunkName(pageFile);
      return {
        filename: getTemplateFilename(pageFile),
        template: path.resolve(__dirname, "../", pageFile),
        chunks: [chunkName]
      };
    })
  );

  // 加入不需要 Html文件的模板
  if (objectTemplates.length) {
    templates = templates.concat(objectTemplates);
  }

  return { entries, templates };
};

/** @type {import('./config').getMiddlewareFunc} */
export const getRouteMiddleware = (
  appRoutes,
  { renderFtl, production, spa } = {}
) => {
  let urls = Object.keys(appRoutes);
  let urlCache = new Map(); // 提前缓存的url
  urls.forEach(url => {
    let viewPath = appRoutes[url];
    let file;
    if (typeof viewPath === "string") {
      file = viewPath;
    } else if (typeof viewPath === "object" && !!viewPath) {
      file = viewPath.filename;
    }
    if (production) {
      file = file.replace(prefixNeedRemove, "");
    }
    // url路径要加上 `/` 前缀
    file = "/" + file;
    urlCache.set(url, file);
  });
  let spaConfig = null;
  if (typeof spa === "object" && spa) {
    spaConfig = spa;
  }
  const historyApi = HistoryApiFallback(spaConfig);
  return (req, res, next) => {
    // 去掉?query
    let url = req.url.replace(/\?.*$/, "");
    let file;
    if (urls.includes(url)) {
      req.url = urlCache.get(url);
      // 如果匹配到了将会直接走匹配到了的逻辑
      urlMatched();
    } else {
      //没用匹配到，如果有SPA，就先经过spa然后再匹配一次，没有匹配到就才溜走
      if (spa) {
        historyApi(req, res, () => {
          if (urls.includes(req.url)) {
            // 匹配到了
            req.url = urlCache.get(req.url);
            // 如果匹配到了将会直接走匹配到了的逻辑
            urlMatched();
          } else {
            next();
          }
        });
      } else {
        return next();
      }
    }
    function urlMatched() {
      // 匹配到文件了。
      if (/\.ftl$/.test(req.url) && typeof renderFtl === "function") {
        renderFtl(req.url, (err, data, responseData) => {
          if (err) {
            res.end(
              JSON.stringify(err, null, 2) +
                "\n" +
                JSON.stringify(responseData, null, 2)
            );
          }
          res.end(data);
        });
        //
      } else {
        next();
      }
    }
  };
};

export const getDistFtlRender = ({ dataPath, templatePath }) => {
  let freemarker = new Freemarker({
    viewRoot: templatePath,
    options: {
      sourceEncoding: "utf-8"
    }
  });
  return (file, done) => {
    // 去掉路径里的URL前缀，将文件后缀改为json
    file = file.replace(/^\//, "");
    let json = path.resolve(dataPath, file.replace(/\.ftl$/, ".json"));
    let data = {};

    if (fs.existsSync(json)) {
      try {
        delete require.cache[json];
        data = require(json);
      } catch (e) {
        done(e);
      }
    }

    freemarker.render(file, data, done);
  };
};

export function gatherChunkVersions(chunks = []) {
  let signal = chunks.length;
  if (signal === 0) return {};
  return new Promise((res, rej) => {
    let fileList = chunks.map(chunkName =>
      path.resolve(__dirname, "../node_modules", chunkName, "package.json")
    );

    let memo = {};
    fileList.forEach((file, index) => {
      fs.readFile(file, (err, data) => {
        if (err) rej(err);
        --signal;
        let pkg = JSON.parse(data.toString());
        memo[chunks[index]] = pkg.version;
        if (signal === 0) {
          res(JSON.parse(stringifyObject(memo)));
        }
      });
    });
  });
}
export function stringifyObject(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}
