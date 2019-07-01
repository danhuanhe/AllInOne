'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/limark/daily', controller.home.index);
  router.get('/news', controller.news.list);
  router.get('/gq', controller.news.gq);

};
