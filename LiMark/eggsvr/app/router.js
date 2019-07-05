'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/limark/daily', controller.home.index);
  router.get('/api/dailylist', controller.daily.dailylist);
  router.get('/api/daily/get', controller.daily.get);
  router.get('/api/daily/save', controller.daily.save);
  router.get('/api/daily/delByIds', controller.daily.delByIds);
  router.get('/news', controller.news.list);
  router.get('/gq', controller.news.gq);

};
