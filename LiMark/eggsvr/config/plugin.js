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

  reactssr: {
    enable: true,
    package: 'egg-view-react-ssr',
  },

  reghelp: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/reghelp'),
  },
};
