/* eslint-disable import/default */

const loaderUtils = require("loader-utils");
// 使用本地freemarker.js package以解决mock中文数据乱码的问题，见https://github.com/ijse/freemarker.js/issues/27
const Freemarker = require("freemarker.js");
const fs = require("fs");
const path = require("path");

module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  if (!options.dataPath) {
    throw new Error("ftl-loader require dataPath options.");
  }
  if (!options.templatePath) {
    throw new Error("ftl-loader require templatePath options.");
  }

  this.cacheable && this.cacheable(true);
  const fm = new Freemarker({
    viewRoot: options.templatePath,
    options: {
      sourceEncoding: "utf-8"
    }
  });
  options.client = true;

  // Skip compile debug for production when running with
  // webpack --optimize-minimize
  if (this.minimize && options.compileDebug === undefined) {
    options.compileDebug = false;
  }
  const jsonPath = this.resourcePath
    .replace(options.templatePath, options.dataPath)
    .replace(/(\.\w+)?$/, ".json");

  if (!fs.existsSync(jsonPath)) {
    throw new Error(
      `not find ftl mock data on jsonPath: ${jsonPath}, please run nei update first and check mock data on nei`
    );
  }

  this.addDependency(jsonPath); // Add json file to dependency.

  const callback = this.async(); // async callback

  const tplPath = path.relative(options.templatePath, this.resourcePath);

  fs.readFile(jsonPath, function(err, buff) {
    let mockData = {};

    if (err) {
      callback(err);
      return;
    }
    try {
      mockData = JSON.parse(buff.toString("utf8"));
    } catch (e) {
      mockData = {};
      callback(new Error(`ftl mock data parse error: ${jsonPath}`));
      return;
    }
    fm.render(tplPath, mockData, function(err, templateData) {
      callback(err, templateData);
    });
  });
  return;
};
