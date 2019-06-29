'use strict';
const path = require('path');
/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  reghelp:{
    enable: true,
    path: path.join(__dirname, '../lib/plugin/reg-help'),
  }
};
