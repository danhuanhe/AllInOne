process.env.NODE_ENV = "development";
// this assures React is built in prod mode and that the Babel dev config doesn't apply.
// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/* eslint-disable no-console */
import webpack from "webpack";
import {
  chalkError,
  chalkSuccess,
  chalkWarning,
  chalkProcessing
} from "./chalkConfig";
import ora from "ora";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { dllConfig, readJSON, writeJSON, gatherChunkVersions } from "./helps";
import config from "../webpack.merged.dev.dll";
import { manifesto } from "../webpack.config.dev";

const { cacheDir, cacheDirName } = dllConfig;

if (!config.output) {
  console.log(
    chalkError("无dll文件输出目录，请在config中配置 useDll 配置项。 ")
  );
  process.exit(1);
}
//  第一步，清空原来的缓存文件夹。
rimraf.sync(config.output.path);

// 第二步，执行打包
console.log(
  chalkProcessing(
    "Generating dll vendors for development via Webpack. This will take a moment..."
  )
);

const spinner = ora("Building dll vendors...");
spinner.start();

webpack(config).run((error, stats) => {
  if (error) {
    // so a fatal error occurred. Stop here.
    console.log(chalkError(error));
    process.exit(1);
    return;
  }
  // if (stats.compilation.errors && stats.compilation.errors.length) {
  //   console.log(stats.compilation.errors);
  //   process.exit(1);
  // }
  const jsonStats = stats.toJson();

  if (stats.hasErrors()) {
    jsonStats.errors.map(error => console.log(chalkError(error)));
    console.log(
      stats.toString({
        colors: true,
        hash: true,
        version: true,
        children: false,
        chunks: false,
        modules: false,
        chunkModules: false
      })
    );
    process.exit(1);
  }

  if (stats.hasWarnings()) {
    console.log(chalkWarning("Webpack generated the following warnings: "));
    jsonStats.warnings.map(warning => console.log(chalkWarning(warning)));
  }

  console.log(
    stats.toString({
      colors: true,
      hash: true,
      version: true,
      children: false,
      chunks: false,
      modules: false,
      chunkModules: false
    })
  );

  spinner.stop();

  let saveCacheSpinner = ora("Save dll cache files").start();

  Promise.all([savePkgDependencies(), saveModifyVars(), saveChunks()]).then(
    () => {
      saveCacheSpinner.succeed("Cache Saved");
      console.log(
        chalkSuccess(
          `Your dll bundle is compiled in development mode in ${cacheDirName}. It's ready to roll!`
        )
      );
    },
    e => {
      saveCacheSpinner.fail(e);
    }
  );

  return 0;
});

// 第三步，结束
// 写入当前的cache使用的一些缓存
async function savePkgDependencies() {
  let pkg = await readJSON(path.resolve(__dirname, "../package.json"));
  await writeJSON(path.resolve(cacheDir, "_dependencies"), pkg.dependencies);
}

async function saveModifyVars() {
  let vars = (manifesto.less && manifesto.less.modifyVars) || {};
  await writeJSON(path.resolve(cacheDir, "_modifyVars"), vars);
}

async function saveChunks() {
  let chunks = config.entry["dynamicLinkedLibrary"];
  let chunkVersion = await gatherChunkVersions(chunks);
  await writeJSON(path.resolve(cacheDir, "_chunkList"), chunkVersion);
}
