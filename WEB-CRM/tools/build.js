process.env.NODE_ENV = "production";
// this assures React is built in prod mode and that the Babel dev config doesn't apply.
// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/* eslint-disable no-console */
import webpack from "webpack";
import rimraf from "rimraf";
import config, { defaultOptions } from "../webpack.merged.prod";
import {
  chalkError,
  chalkSuccess,
  chalkWarning,
  chalkProcessing
} from "./chalkConfig";
import ora from "ora";
import path from "path";

const { cleanBuild } = defaultOptions;

if (cleanBuild) {
  let pathToClean = [];
  let foribiden = /^\//;

  if (typeof cleanBuild == "string") {
    pathToClean = [cleanBuild];
  } else {
    pathToClean = cleanBuild.slice();
  }

  //不允许根路径
  if (pathToClean.some(path => foribiden.test(path))) {
    console.log(chalkError("不允许从根路径开始"));
    process.exit(1);
  } else {
    let projectDir = path.resolve(__dirname, "../");
    pathToClean.forEach(path => {
      rimraf.sync(path, {
        disableGlob: false,
        glob: { cwd: projectDir }
      });
    });
  }
}

console.log(
  chalkProcessing(
    "Generating minified bundle for production via Webpack. This will take a moment..."
  )
);

const spinner = ora("building for production...");
spinner.start();

webpack(config).run((error, stats) => {
  if (error) {
    // so a fatal error occurred. Stop here.
    console.log(chalkError(error));
    return 1;
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

  spinner.stop();

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

  // if we got this far, the build succeeded.
  console.log(
    chalkSuccess(
      "Your app is compiled in production mode in /dist. It's ready to roll!"
    )
  );

  return 0;
});
