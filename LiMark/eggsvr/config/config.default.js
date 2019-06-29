/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123456';
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  /**
   * 中间件配置
   */
  config.middleware = [
    'robot',
  ];
  // robot's configurations
  config.robot = {
    ua: [
      /Baiduspider/i,
    ],
  };

  /**
   * WEB服务配置信息
   */
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.htm': 'nunjucks',
    },
  };

  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'static'),
  };

  /**
   * 业务配置信息
   */
  config.news = {
    pageSize: 5,
    serverUrl: 'https://hacker-news.firebaseio.com/v0',
  };
  return {
    ...config,
    ...userConfig,
  };
};
